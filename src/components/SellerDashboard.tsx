import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Offer {
  id: string;
  amount: number;
  message: string | null;
  status: string;
  counter_amount: number | null;
  counter_message: string | null;
  created_at: string;
  updated_at: string;
  buyer_id: string;
  record_id: string;
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

const SellerDashboard = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterOffers, setCounterOffers] = useState<Record<string, { amount: string; message: string }>>({});
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
          profiles!buyer_id (username, full_name)
        `)
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers((data || []) as unknown as Offer[]);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
        title: "Error",
        description: "Failed to load offers",
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
      .channel('seller-offers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'offers',
          filter: `seller_id=eq.${user?.id}`
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

  const updateOfferStatus = async (offerId: string, status: string, counterData?: { amount: number; message: string }) => {
    try {
      const updateData: any = { status };
      
      if (counterData) {
        updateData.counter_amount = counterData.amount;
        updateData.counter_message = counterData.message.trim() || null;
      }

      const { error } = await supabase
        .from("offers")
        .update(updateData)
        .eq("id", offerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Offer ${status} successfully`,
      });

      // Clear counter offer form
      setCounterOffers(prev => {
        const updated = { ...prev };
        delete updated[offerId];
        return updated;
      });

      fetchOffers();
    } catch (error) {
      console.error("Error updating offer:", error);
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive",
      });
    }
  };

  const handleCounterOffer = (offerId: string) => {
    const counterData = counterOffers[offerId];
    if (!counterData || !counterData.amount) {
      toast({
        title: "Invalid counter offer",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(counterData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid counter offer amount",
        variant: "destructive",
      });
      return;
    }

    updateOfferStatus(offerId, "countered", { amount, message: counterData.message });
  };

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
    return <div className="p-6">Loading offers...</div>;
  }

  if (offers.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No offers yet</h2>
        <p className="text-muted-foreground">When buyers make offers on your listings, they'll appear here.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Offers</h1>
      
      <div className="grid gap-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="border-rock-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{offer.vinyl_records.album_name}</CardTitle>
                  <p className="text-muted-foreground">by {offer.vinyl_records.artist}</p>
                  <p className="text-sm text-muted-foreground">
                    From: {offer.profiles?.username || offer.profiles?.full_name || "Anonymous"}
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
                  <span className="font-semibold">Your asking price:</span> ${offer.vinyl_records.price}
                </div>
                <div>
                  <span className="font-semibold">Buyer's offer:</span> ${offer.amount}
                </div>
              </div>
              
              {offer.message && (
                <div>
                  <span className="font-semibold text-sm">Buyer's message:</span>
                  <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">{offer.message}</p>
                </div>
              )}

              {offer.status === "countered" && offer.counter_amount && (
                <>
                  <Separator />
                  <div>
                    <span className="font-semibold text-sm">Your counter offer:</span> ${offer.counter_amount}
                    {offer.counter_message && (
                      <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded">{offer.counter_message}</p>
                    )}
                  </div>
                </>
              )}
              
              {offer.status === "pending" && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateOfferStatus(offer.id, "accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => updateOfferStatus(offer.id, "denied")}
                      variant="destructive"
                    >
                      Deny
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Or make a counter offer:</h4>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Counter amount"
                        value={counterOffers[offer.id]?.amount || ""}
                        onChange={(e) => setCounterOffers(prev => ({
                          ...prev,
                          [offer.id]: { ...prev[offer.id], amount: e.target.value }
                        }))}
                      />
                      <Button
                        onClick={() => handleCounterOffer(offer.id)}
                        variant="outline"
                      >
                        Counter
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Optional message with your counter offer"
                      value={counterOffers[offer.id]?.message || ""}
                      onChange={(e) => setCounterOffers(prev => ({
                        ...prev,
                        [offer.id]: { ...prev[offer.id], message: e.target.value }
                      }))}
                      rows={2}
                    />
                  </div>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Received: {new Date(offer.created_at).toLocaleString()}
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

export default SellerDashboard;