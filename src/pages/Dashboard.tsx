import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SellerDashboard from "@/components/SellerDashboard";
import BuyerOffers from "@/components/BuyerOffers";
import UserListings from "@/components/UserListings";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <Tabs defaultValue="offers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="offers">Incoming Offers</TabsTrigger>
          <TabsTrigger value="my-offers">My Offers</TabsTrigger>
          <TabsTrigger value="listings">My Listings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="offers">
          <SellerDashboard />
        </TabsContent>
        
        <TabsContent value="my-offers">
          <BuyerOffers />
        </TabsContent>
        
        <TabsContent value="listings">
          <UserListings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;