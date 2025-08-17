import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offerId } = await req.json();
    
    if (!offerId) {
      throw new Error("Offer ID is required");
    }

    // Create Supabase client with service role key for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    // Get offer details
    const { data: offer, error: offerError } = await supabaseService
      .from("offers")
      .select(`
        *,
        record:vinyl_records(album_name, artist, seller_id),
        buyer:profiles!offers_buyer_id_fkey(full_name, user_id),
        seller:profiles!offers_seller_id_fkey(full_name, user_id)
      `)
      .eq("id", offerId)
      .eq("status", "accepted")
      .single();

    if (offerError || !offer) {
      throw new Error("Offer not found or not accepted");
    }

    // Verify user is the buyer
    if (offer.buyer_id !== user.id) {
      throw new Error("Unauthorized: You are not the buyer for this offer");
    }

    // Calculate fees using the database function
    const { data: feeData, error: feeError } = await supabaseService
      .rpc("calculate_transaction_fees", { offer_amount: offer.amount });

    if (feeError || !feeData || feeData.length === 0) {
      throw new Error("Failed to calculate transaction fees");
    }

    const fees = feeData[0];

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${offer.record.album_name} by ${offer.record.artist}`,
              description: `Purchase from ${offer.seller.full_name || 'Seller'}`,
            },
            unit_amount: Math.round(parseFloat(fees.total_amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/dashboard`,
      metadata: {
        offer_id: offerId,
        buyer_id: user.id,
        seller_id: offer.seller_id,
        record_id: offer.record_id,
        offer_amount: offer.amount.toString(),
        buyer_fee: fees.buyer_fee.toString(),
        seller_fee: fees.seller_fee.toString(),
      },
    });

    // Create order record
    const { error: orderError } = await supabaseService
      .from("orders")
      .insert({
        record_id: offer.record_id,
        buyer_id: offer.buyer_id,
        seller_id: offer.seller_id,
        offer_amount: offer.amount,
        buyer_fee: fees.buyer_fee,
        seller_fee: fees.seller_fee,
        total_amount: fees.total_amount,
        payment_session_id: session.id,
        status: "pending_payment",
      });

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order record");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});