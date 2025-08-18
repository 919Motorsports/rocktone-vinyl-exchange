import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface UserRatingProps {
  userId: string;
  showDetailedStats?: boolean;
  className?: string;
}

interface RatingStats {
  overall_avg: number;
  communication_avg: number;
  item_accuracy_avg: number;
  shipping_avg: number;
  total_reviews: number;
}

const UserRating = ({ userId, showDetailedStats = false, className = "" }: UserRatingProps) => {
  const [stats, setStats] = useState<RatingStats>({
    overall_avg: 0,
    communication_avg: 0,
    item_accuracy_avg: 0,
    shipping_avg: 0,
    total_reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userId]);

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
      console.error("Error fetching user rating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
    
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating) 
                ? "fill-primary text-primary" 
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (stats.total_reviews === 0) {
    return (
      <div className={`flex items-center space-x-2 text-muted-foreground ${className}`}>
        <span className="text-sm">No reviews</span>
      </div>
    );
  }

  if (showDetailedStats) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center space-x-3">
          {renderStars(stats.overall_avg, "md")}
          <span className="font-medium text-foreground">
            {stats.overall_avg.toFixed(1)}
          </span>
          <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
            {stats.total_reviews} review{stats.total_reviews !== 1 ? "s" : ""}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Communication:</span>
            <div className="flex items-center space-x-2">
              {renderStars(stats.communication_avg)}
              <span className="text-foreground">{stats.communication_avg.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Accuracy:</span>
            <div className="flex items-center space-x-2">
              {renderStars(stats.item_accuracy_avg)}
              <span className="text-foreground">{stats.item_accuracy_avg.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between col-span-2">
            <span className="text-muted-foreground">Shipping:</span>
            <div className="flex items-center space-x-2">
              {renderStars(stats.shipping_avg)}
              <span className="text-foreground">{stats.shipping_avg.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {renderStars(stats.overall_avg)}
      <span className="text-sm font-medium text-foreground">
        {stats.overall_avg.toFixed(1)}
      </span>
      <span className="text-xs text-muted-foreground">
        ({stats.total_reviews})
      </span>
    </div>
  );
};

export default UserRating;