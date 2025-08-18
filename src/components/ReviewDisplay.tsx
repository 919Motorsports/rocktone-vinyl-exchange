import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  overall_rating: number;
  communication_rating: number;
  item_accuracy_rating: number;
  shipping_rating: number;
  review_text: string | null;
  reviewer_type: string;
  created_at: string;
  reviewer_profile?: {
    full_name: string | null;
    username: string | null;
  };
}

interface ReviewDisplayProps {
  userId: string;
  userType?: "buyer" | "seller";
  showReviewerType?: boolean;
}

const ReviewDisplay = ({ userId, userType, showReviewerType = true }: ReviewDisplayProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overall_avg: 0,
    communication_avg: 0,
    item_accuracy_avg: 0,
    shipping_avg: 0,
    total_reviews: 0,
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          reviewer_profile:profiles(
            full_name,
            username
          )
        `)
        .eq("reviewee_id", userId)
        .order("created_at", { ascending: false });

      if (userType) {
        // Filter reviews based on the context (show reviews for this user as buyer or seller)
        query = query.eq("reviewer_type", userType === "buyer" ? "seller" : "buyer");
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews((data as any) || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc("get_user_rating_stats", {
        user_id: userId,
      });

      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getRatingCategoryLabel = (category: string, reviewerType: string) => {
    switch (category) {
      case "item_accuracy":
        return reviewerType === "buyer" ? "Item as Described" : "Payment Promptness";
      case "shipping":
        return reviewerType === "buyer" ? "Shipping & Packaging" : "Responsiveness";
      case "communication":
        return "Communication";
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      {stats.total_reviews > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span>Rating Overview</span>
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                {stats.total_reviews} review{stats.total_reviews !== 1 ? "s" : ""}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Overall</span>
                {renderStars(stats.overall_avg)}
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Communication</span>
                {renderStars(stats.communication_avg)}
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Accuracy</span>
                {renderStars(stats.item_accuracy_avg)}
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Shipping</span>
                {renderStars(stats.shipping_avg)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-center">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews yet</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {review.reviewer_profile?.full_name || 
                         review.reviewer_profile?.username || 
                         "Anonymous User"}
                      </p>
                      {showReviewerType && (
                        <Badge variant="outline" className="text-xs border-border">
                          {review.reviewer_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(review.overall_rating)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Communication</span>
                    {renderStars(review.communication_rating)}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      {getRatingCategoryLabel("item_accuracy", review.reviewer_type)}
                    </span>
                    {renderStars(review.item_accuracy_rating)}
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      {getRatingCategoryLabel("shipping", review.reviewer_type)}
                    </span>
                    {renderStars(review.shipping_rating)}
                  </div>
                </div>
                {review.review_text && (
                  <p className="text-card-foreground text-sm leading-relaxed">
                    {review.review_text}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewDisplay;