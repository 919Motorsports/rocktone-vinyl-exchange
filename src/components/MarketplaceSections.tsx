import RecordCard from "./RecordCard";
import record1 from "@/assets/record1.jpg";
import record2 from "@/assets/record2.jpg";
import record3 from "@/assets/record3.jpg";
import record4 from "@/assets/record4.jpg";
import record5 from "@/assets/record5.jpg";
import record6 from "@/assets/record6.jpg";

const MarketplaceSections = () => {
  const newArrivals = [
    { albumName: "Classic Thunder", artist: "The Rock Legends", condition: "VG+", price: 45, imageUrl: record1 },
    { albumName: "Midnight Jazz Sessions", artist: "Blue Note Collective", condition: "NM", price: 67, imageUrl: record2 },
    { albumName: "Electric Blues", artist: "Lightning Joe", condition: "VG", price: 38, imageUrl: record3 }
  ];

  const rareFinds = [
    { albumName: "Psychedelic Dreams", artist: "Cosmic Voyagers", condition: "NM", price: 185, imageUrl: record4, isRare: true },
    { albumName: "Dark Cathedral", artist: "Metal Souls", condition: "VG+", price: 125, imageUrl: record5, isRare: true },
    { albumName: "Rebellion Rising", artist: "Punk Revolution", condition: "VG", price: 95, imageUrl: record6, isRare: true }
  ];

  const featuredArtists = [
    { albumName: "Greatest Hits Vol. 1", artist: "Rock Icons", condition: "VG+", price: 55, imageUrl: record1 },
    { albumName: "Smooth Operator", artist: "Jazz Masters", condition: "NM", price: 72, imageUrl: record2 },
    { albumName: "Blues Highway", artist: "Delta Kings", condition: "VG+", price: 48, imageUrl: record3 }
  ];

  return (
    <div className="bg-background py-12 space-y-16">
      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.map((record, index) => (
            <RecordCard key={index} {...record} />
          ))}
        </div>
      </section>

      {/* Rare Finds */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">Rare Finds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rareFinds.map((record, index) => (
            <RecordCard key={index} {...record} />
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">Featured Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArtists.map((record, index) => (
            <RecordCard key={index} {...record} />
          ))}
        </div>
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