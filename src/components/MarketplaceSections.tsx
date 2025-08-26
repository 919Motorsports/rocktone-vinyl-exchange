import { useEffect, useState } from "react";
import RecordCard from "./RecordCard";
import { supabase } from "@/integrations/supabase/client";

interface VinylRecord {
  id: string;
  album_name: string;
  artist: string;
  condition: string;
  price: number;
  images: string[];
  seller_id: string;
  created_at: string;
  genre?: string;
}

const MarketplaceSections = () => {
  const [newArrivals, setNewArrivals] = useState<VinylRecord[]>([]);
  const [rareFinds, setRareFinds] = useState<VinylRecord[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVinylRecords = async () => {
      try {
        const { data: records, error } = await supabase
          .from('vinyl_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (records) {
          // New Arrivals: Most recent 3 records
          setNewArrivals(records.slice(0, 3));
          
          // Rare Finds: Records with price > $100
          setRareFinds(records.filter(record => record.price > 100).slice(0, 3));
          
          // Featured Artists: Random selection of remaining records
          const remaining = records.slice(3);
          setFeaturedArtists(remaining.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching vinyl records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVinylRecords();
  }, []);

  if (loading) {
    return (
      <div className="bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading vinyl records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-12 space-y-16">
      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((record) => (
            <RecordCard 
              key={record.id}
              albumName={record.album_name}
              artist={record.artist}
              condition={record.condition}
              price={record.price}
              imageUrl={record.images[0] || '/placeholder.svg'}
              recordId={record.id}
              sellerId={record.seller_id}
            />
          ))}
        </div>
        {newArrivals.length === 0 && (
          <p className="text-center text-muted-foreground">No new arrivals yet.</p>
        )}
      </section>

      {/* Rare Finds */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">Rare Finds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rareFinds.map((record) => (
            <RecordCard 
              key={record.id}
              albumName={record.album_name}
              artist={record.artist}
              condition={record.condition}
              price={record.price}
              imageUrl={record.images[0] || '/placeholder.svg'}
              recordId={record.id}
              sellerId={record.seller_id}
              isRare={true}
            />
          ))}
        </div>
        {rareFinds.length === 0 && (
          <p className="text-center text-muted-foreground">No rare finds available.</p>
        )}
      </section>

      {/* Featured Artists */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">Featured Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArtists.map((record) => (
            <RecordCard 
              key={record.id}
              albumName={record.album_name}
              artist={record.artist}
              condition={record.condition}
              price={record.price}
              imageUrl={record.images[0] || '/placeholder.svg'}
              recordId={record.id}
              sellerId={record.seller_id}
            />
          ))}
        </div>
        {featuredArtists.length === 0 && (
          <p className="text-center text-muted-foreground">No featured artists available.</p>
        )}
      </section>

      {/* Marketplace Info */}
      <section className="container mx-auto px-4">
        <div className="bg-rock-card rounded-xl p-8 border border-rock-border">
          <h3 className="text-2xl font-bold text-rock-primary mb-4">Start Selling Your Collection</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of vinyl enthusiasts buying and selling rare records. 
            Easy listing process with just a 4% seller fee.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-rock-darker rounded-lg">
              <h4 className="font-bold text-rock-primary mb-2">For Sellers</h4>
              <p className="text-muted-foreground">4% listing fee • Easy photo upload • Global reach</p>
            </div>
            <div className="text-center p-4 bg-rock-darker rounded-lg">
              <h4 className="font-bold text-rock-primary mb-2">For Buyers</h4>
              <p className="text-muted-foreground">4% buyer fee • Make offers • Secure payments</p>
            </div>
            <div className="text-center p-4 bg-rock-darker rounded-lg">
              <h4 className="font-bold text-rock-primary mb-2">Quality Assured</h4>
              <p className="text-muted-foreground">Condition grading • Multiple photos • Authenticity guaranteed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceSections;