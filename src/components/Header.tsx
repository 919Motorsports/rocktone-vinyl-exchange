import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
const Header = () => {
  const {
    user,
    signOut
  } = useAuth();
  return <header className="sticky top-0 z-50 bg-rock-dark/95 backdrop-blur-sm border-b border-rock-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-rock-primary">
            ROCKTONE<span className="text-foreground"> MARKET</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-rock-primary transition-colors font-medium">
              HOME
            </a>
            <a href="#" className="text-foreground hover:text-rock-primary transition-colors font-medium">
              SELL
            </a>
            
            <a href="#" className="text-foreground hover:text-rock-primary transition-colors font-medium">
              DEALS
            </a>
            <a href="#" className="text-foreground hover:text-rock-primary transition-colors font-medium">
              FAQ
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex relative">
            <Input placeholder="Search records..." className="w-64 bg-rock-card border-rock-border text-foreground placeholder:text-muted-foreground" />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          {user ? <>
              <Link to="/dashboard">
                <Button variant="outline" className="border-rock-primary text-rock-primary hover:bg-rock-primary hover:text-rock-dark">
                  Dashboard
                </Button>
              </Link>
              <Link to="/create-listing">
                <Button className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark font-bold">
                  Sell Record
                </Button>
              </Link>
              <span className="text-rock-primary font-medium hidden md:block">
                Welcome back!
              </span>
              <Button onClick={signOut} variant="ghost" className="text-rock-primary hover:text-rock-primary-glow">
                Sign Out
              </Button>
            </> : <>
              <Link to="/auth">
                <Button variant="ghost" className="text-rock-primary hover:text-rock-primary-glow">
                  Login
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark font-bold">
                  Sign Up
                </Button>
              </Link>
            </>}
          
          <Button size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>;
};
export default Header;