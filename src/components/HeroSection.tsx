import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-rock overflow-hidden">
      {/* Grunge texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-black text-rock-primary mb-6 tracking-tight">
          THE<br />
          ROCKTONE<br />
          MARKET
        </h1>
        
        <Link to="/auth">
          <Button 
            size="lg" 
            className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark font-bold px-8 py-4 text-lg rounded-full shadow-glow transition-all duration-300 hover:scale-105"
          >
            JOIN FOR FREE
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;