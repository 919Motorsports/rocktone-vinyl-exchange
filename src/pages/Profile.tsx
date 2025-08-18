import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReviewDisplay from "@/components/ReviewDisplay";
import UserRating from "@/components/UserRating";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  seller_rating: number;
  total_sales: number;
  total_purchases: number;
  created_at: string;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Profile not found</h1>
        <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const displayName = profile.full_name || profile.username || "Anonymous User";
  const joinDate = new Date(profile.created_at).toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">{displayName}</h1>
                  {profile.username && profile.full_name && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{profile.total_sales} sales</span>
                  </div>
                </div>

                <UserRating userId={userId!} showDetailedStats className="mt-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Tabs */}
        <Tabs defaultValue="all-reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="as-seller">As Seller</TabsTrigger>
            <TabsTrigger value="as-buyer">As Buyer</TabsTrigger>
          </TabsList>

          <TabsContent value="all-reviews" className="mt-6">
            <ReviewDisplay userId={userId!} showReviewerType={true} />
          </TabsContent>

          <TabsContent value="as-seller" className="mt-6">
            <ReviewDisplay userId={userId!} userType="seller" showReviewerType={false} />
          </TabsContent>

          <TabsContent value="as-buyer" className="mt-6">
            <ReviewDisplay userId={userId!} userType="buyer" showReviewerType={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;