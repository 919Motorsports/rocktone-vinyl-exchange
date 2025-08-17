-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.calculate_transaction_fees(offer_amount NUMERIC)
RETURNS TABLE(
  buyer_fee NUMERIC,
  seller_fee NUMERIC,
  total_amount NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
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