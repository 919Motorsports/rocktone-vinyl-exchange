import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReviewFormProps {
  orderId: string;
  revieweeId: string;
  reviewerType: "buyer" | "seller";
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const ReviewForm = ({ orderId, revieweeId, reviewerType, onReviewSubmitted, onCancel }: ReviewFormProps) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    itemAccuracy: 0,
    shipping: 0,
  });
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const renderStars = (category: keyof typeof ratings, label: string) => {
    const currentRating = ratings[category];
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(category, star)}
              className="focus:outline-none transition-colors"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= currentRating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ratings.overall || !ratings.communication || !ratings.itemAccuracy || !ratings.shipping) {
      toast.error("Please provide ratings for all categories");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        order_id: orderId,
        reviewer_id: (await supabase.auth.getUser()).data.user?.id,
        reviewee_id: revieweeId,
        reviewer_type: reviewerType,
        overall_rating: ratings.overall,
        communication_rating: ratings.communication,
        item_accuracy_rating: ratings.itemAccuracy,
        shipping_rating: ratings.shipping,
        review_text: reviewText.trim() || null,
      });

      if (error) throw error;

      toast.success("Review submitted successfully");
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">
          Rate Your {reviewerType === "buyer" ? "Seller" : "Buyer"} Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderStars("overall", "Overall Experience")}
            {renderStars("communication", "Communication")}
            {renderStars("itemAccuracy", reviewerType === "buyer" ? "Item as Described" : "Payment Promptness")}
            {renderStars("shipping", reviewerType === "buyer" ? "Shipping & Packaging" : "Responsiveness")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-text" className="text-sm font-medium text-foreground">
              Write a Review (Optional)
            </Label>
            <Textarea
              id="review-text"
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;