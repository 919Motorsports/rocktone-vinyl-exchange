import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
const SearchSection = () => {
  return <section className="bg-rock-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-rock-primary">
            
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-4xl">
            
            <Button variant="outline" className="border-rock-border text-foreground hover:text-rock-primary">
              SORT BY GENRE
            </Button>
            
            <div className="flex-1 relative">
              <Input placeholder="Search vinyl records..." className="bg-rock-card border-rock-border text-foreground placeholder:text-muted-foreground pr-12" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <Button className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark font-bold px-8">
              SEARCH
            </Button>
          </div>
        </div>
        
        {/* Quick filter tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-rock-primary text-rock-primary cursor-pointer hover:bg-rock-primary hover:text-rock-dark">
            Classic Rock
          </Badge>
          <Badge variant="outline" className="border-rock-border text-muted-foreground cursor-pointer hover:border-rock-primary hover:text-rock-primary">
            Jazz
          </Badge>
          <Badge variant="outline" className="border-rock-border text-muted-foreground cursor-pointer hover:border-rock-primary hover:text-rock-primary">
            Blues
          </Badge>
          <Badge variant="outline" className="border-rock-border text-muted-foreground cursor-pointer hover:border-rock-primary hover:text-rock-primary">
            Rare Finds
          </Badge>
          <Badge variant="outline" className="border-rock-border text-muted-foreground cursor-pointer hover:border-rock-primary hover:text-rock-primary">
            New Arrivals
          </Badge>
        </div>
      </div>
    </section>;
};
export default SearchSection;