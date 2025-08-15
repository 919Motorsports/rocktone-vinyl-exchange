import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import MarketplaceSections from "@/components/MarketplaceSections";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SearchSection />
      <MarketplaceSections />
    </div>
  );
};

export default Index;
