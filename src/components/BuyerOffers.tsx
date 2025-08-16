import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BuyerOffer {
  id: string;
  amount: number;
  message: string | null;
  status: string;
  counter_amount: number | null;
  counter_message: string | null;
  created_at: string;
  updated_at: string;
  vinyl_records: {
    album_name: string;
    artist: string;
    price: number;
    images: string[];
  };
  profiles: {
    username: string | null;
    full_name: string | null;
  } | null;
}

const BuyerOffers = () => {
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOffers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("offers")
        .select(`
          *,
          vinyl_records (album_name, artist, price, images),
          profiles!seller_id (username, full_name)
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers((data || []) as unknown as BuyerOffer[]);
    } catch (error) {
      console.error("Error fetching buyer offers:", error);
      toast({
        title: "Error",
        description: "Failed to load your offers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();

    // Set up real-time subscription
    const channel = supabase
      .channel('buyer-offers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
          filter: `buyer_id=eq.${user?.id}`
        },
        () => {
          fetchOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted": return "bg-green-100 text-green-800 border-green-300";
      case "countered": return "bg-blue-100 text-blue-800 border-blue-300";
      case "denied": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return <div className="p-6">Loading your offers...</div>;
  }

  if (offers.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No offers made yet</h2>
        <p className="text-muted-foreground">When you make offers on records, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Offers</h2>
      
      <div className="grid gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="border-rock-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{offer.vinyl_records.album_name}</CardTitle>
                  <p className="text-muted-foreground">by {offer.vinyl_records.artist}</p>
                  <p className="text-sm text-muted-foreground">
                    Seller: {offer.profiles?.username || offer.profiles?.full_name || "Anonymous"}
                  </p>
                </div>
                <Badge className={getStatusColor(offer.status)}>
                  {offer.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Asking price:</span> ${offer.vinyl_records.price}
                </div>
                <div>
                  <span className="font-semibold">Your offer:</span> ${offer.amount}
                </div>
              </div>
              
              {offer.message && (
                <div>
                  <span className="font-semibold text-sm">Your message:</span>
                  <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">{offer.message}</p>
                </div>
              )}

              {offer.status === "countered" && offer.counter_amount && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-sm text-blue-900">Seller's counter offer: ${offer.counter_amount}</div>
                  {offer.counter_message && (
                    <p className="text-sm text-blue-700 mt-1">{offer.counter_message}</p>
                  )}
                </div>
              )}

              {offer.status === "accepted" && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-semibold text-sm text-green-900">🎉 Your offer was accepted!</div>
                  <p className="text-sm text-green-700">The seller will contact you to arrange payment and delivery.</p>
                </div>
              )}

              {offer.status === "denied" && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-semibold text-sm text-red-900">Offer was declined</div>
                  <p className="text-sm text-red-700">You can try making a higher offer if the record is still available.</p>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Sent: {new Date(offer.created_at).toLocaleString()}
                {offer.updated_at !== offer.created_at && (
                  <> • Updated: {new Date(offer.updated_at).toLocaleString()}</>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuyerOffers;