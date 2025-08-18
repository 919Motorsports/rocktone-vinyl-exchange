-- Create reviews table for buyer and seller ratings
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  reviewer_id UUID NOT NULL,
  reviewee_id UUID NOT NULL,
  reviewer_type TEXT NOT NULL CHECK (reviewer_type IN ('buyer', 'seller')),
  
  -- Rating categories (1-5 scale)
  overall_rating DECIMAL(2,1) NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  communication_rating DECIMAL(2,1) NOT NULL CHECK (communication_rating >= 1 AND communication_rating <= 5),
  item_accuracy_rating DECIMAL(2,1) NOT NULL CHECK (item_accuracy_rating >= 1 AND item_accuracy_rating <= 5),
  shipping_rating DECIMAL(2,1) NOT NULL CHECK (shipping_rating >= 1 AND shipping_rating <= 5),
  
  -- Review content
  review_text TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  UNIQUE (order_id, reviewer_id), -- One review per user per order
  
  -- Foreign key relationships
  CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviewer FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reviewee FOREIGN KEY (reviewee_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Users can view all reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their completed orders" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = reviewer_id AND
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id 
    AND status = 'completed'
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = reviewer_id);

-- Create indexes for performance
CREATE INDEX idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- Add trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate user's average ratings
CREATE OR REPLACE FUNCTION public.get_user_rating_stats(user_id UUID)
RETURNS TABLE(
  overall_avg DECIMAL(2,1),
  communication_avg DECIMAL(2,1),
  item_accuracy_avg DECIMAL(2,1),
  shipping_avg DECIMAL(2,1),
  total_reviews INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    ROUND(AVG(overall_rating), 1)::DECIMAL(2,1) as overall_avg,
    ROUND(AVG(communication_rating), 1)::DECIMAL(2,1) as communication_avg,
    ROUND(AVG(item_accuracy_rating), 1)::DECIMAL(2,1) as item_accuracy_avg,
    ROUND(AVG(shipping_rating), 1)::DECIMAL(2,1) as shipping_avg,
    COUNT(*)::INTEGER as total_reviews
  FROM public.reviews 
  WHERE reviewee_id = user_id;
$$;