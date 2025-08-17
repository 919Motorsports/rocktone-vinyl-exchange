-- Create orders table for transaction lifecycle
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  offer_amount NUMERIC NOT NULL,
  buyer_fee NUMERIC NOT NULL DEFAULT 0,
  seller_fee NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'shipped', 'completed', 'cancelled')),
  payment_session_id TEXT,
  payment_intent_id TEXT,
  shipping_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders
CREATE POLICY "Buyers can view their orders" ON public.orders
FOR SELECT
USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view their orders" ON public.orders
FOR SELECT  
USING (seller_id = auth.uid());

CREATE POLICY "Users can create orders" ON public.orders
FOR INSERT
WITH CHECK (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can update their orders" ON public.orders
FOR UPDATE
USING (buyer_id = auth.uid() OR seller_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add fee calculation function
CREATE OR REPLACE FUNCTION public.calculate_transaction_fees(offer_amount NUMERIC)
RETURNS TABLE(
  buyer_fee NUMERIC,
  seller_fee NUMERIC,
  total_amount NUMERIC
) 
LANGUAGE plpgsql
AS $$
DECLARE
  fee_rate NUMERIC := 0.04; -- 4% fee rate
BEGIN
  buyer_fee := ROUND(offer_amount * fee_rate, 2);
  seller_fee := ROUND(offer_amount * fee_rate, 2);
  total_amount := offer_amount + buyer_fee;
  
  RETURN QUERY SELECT 
    calculate_transaction_fees.buyer_fee,
    calculate_transaction_fees.seller_fee, 
    calculate_transaction_fees.total_amount;
END;
$$;