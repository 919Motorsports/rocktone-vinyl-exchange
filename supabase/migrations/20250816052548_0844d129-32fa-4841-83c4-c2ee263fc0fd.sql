-- Create offers table
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES public.vinyl_records(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'countered', 'denied')),
  counter_amount NUMERIC(10,2),
  counter_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Create policies for offers
CREATE POLICY "Buyers can view their own offers"
ON public.offers
FOR SELECT
USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view offers on their records"
ON public.offers
FOR SELECT
USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create offers"
ON public.offers
FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update offers on their records"
ON public.offers
FOR UPDATE
USING (auth.uid() = seller_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_offers_record_id ON public.offers(record_id);
CREATE INDEX idx_offers_buyer_id ON public.offers(buyer_id);
CREATE INDEX idx_offers_seller_id ON public.offers(seller_id);

-- Enable real-time for offers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;