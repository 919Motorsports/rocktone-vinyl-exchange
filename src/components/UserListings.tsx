import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

interface UserListing {
  id: string;
  album_name: string;
  artist: string;
  condition: string;
  price: number;
  images: string[];
  genre: string | null;
  release_year: number | null;
  created_at: string;
}

const UserListings = () => {
  const [listings, setListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchListings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("vinyl_records")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [user]);

  const deleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from("vinyl_records")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });

      setListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading your listings...</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No listings yet</h2>
        <p className="text-muted-foreground">Create your first listing to start selling records!</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Listings</h2>
      
      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="border-rock-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {listing.images.length > 0 && (
                    <img
                      src={listing.images[0]}
                      alt={listing.album_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{listing.album_name}</CardTitle>
                    <p className="text-muted-foreground">by {listing.artist}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="border-rock-border text-rock-primary">
                        {listing.condition}
                      </Badge>
                      {listing.genre && (
                        <Badge variant="secondary">{listing.genre}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-rock-primary">${listing.price}</div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteListing(listing.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Listed: {new Date(listing.created_at).toLocaleDateString()}</span>
                {listing.release_year && <span>Released: {listing.release_year}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserListings;