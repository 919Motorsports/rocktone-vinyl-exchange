import { Search, Menu, Crown, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const Header = () => {
  const { user, signOut } = useAuth();
  const { subscriptionStatus, createCheckout, openCustomerPortal, isPro } = useSubscription();

  const MembershipButton = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={isPro ? openCustomerPortal : createCheckout}
            className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold px-4 py-2 rounded-full shadow-lg border border-amber-300"
          >
            <Crown className="h-4 w-4 mr-2" />
            MEMBERSHIP
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Skip 4% fees • Feature listings • Seller badge</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <header className="sticky top-0 z-50 bg-rock-dark/95 backdrop-blur-sm border-b border-rock-border">
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
          
          {/* Membership button - desktop */}
          <div className="hidden md:block">
            <MembershipButton />
          </div>
          
          {user ? (
            <>
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
              
              {/* Account dropdown with subscription info */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-rock-primary hover:text-rock-primary-glow">
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-rock-card border-rock-border">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">Account</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-rock-border" />
                  
                  <DropdownMenuItem 
                    onClick={isPro ? openCustomerPortal : createCheckout}
                    className="flex items-center space-x-2 hover:bg-rock-border cursor-pointer"
                  >
                    <Crown className="h-4 w-4 text-amber-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {isPro ? "Manage membership" : "Upgrade membership"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Current: {subscriptionStatus.subscription_tier}
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-rock-border" />
                  <Link to="/profile">
                    <DropdownMenuItem className="hover:bg-rock-border cursor-pointer text-foreground">
                      Profile Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="hover:bg-rock-border cursor-pointer text-foreground"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
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
            </>
          )}
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="ghost" className="md:hidden text-rock-primary">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-rock-dark border-rock-border">
              <SheetHeader>
                <SheetTitle className="text-rock-primary">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Membership button - mobile (near top) */}
                <MembershipButton />
                
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
                
                {user && (
                  <>
                    <div className="border-t border-rock-border pt-4">
                      <div className="text-sm text-muted-foreground mb-2">
                        Status: {subscriptionStatus.subscription_tier}
                      </div>
                      <Link to="/dashboard" className="block">
                        <Button variant="outline" className="w-full border-rock-primary text-rock-primary hover:bg-rock-primary hover:text-rock-dark mb-2">
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/create-listing" className="block">
                        <Button className="w-full bg-rock-primary hover:bg-rock-primary-glow text-rock-dark font-bold mb-2">
                          Sell Record
                        </Button>
                      </Link>
                      <Button 
                        onClick={signOut} 
                        variant="ghost" 
                        className="w-full text-rock-primary hover:text-rock-primary-glow"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;