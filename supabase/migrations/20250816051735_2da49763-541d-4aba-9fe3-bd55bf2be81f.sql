-- Create vinyl_records table
CREATE TABLE public.vinyl_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  album_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('Mint', 'Near Mint', 'Very Good Plus', 'Very Good', 'Good Plus', 'Good', 'Fair', 'Poor')),
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  images TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  genre TEXT,
  release_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vinyl_records ENABLE ROW LEVEL SECURITY;

-- Create policies for vinyl_records
CREATE POLICY "Anyone can view vinyl records" 
ON public.vinyl_records 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own vinyl records" 
ON public.vinyl_records 
FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own vinyl records" 
ON public.vinyl_records 
FOR UPDATE 
USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own vinyl records" 
ON public.vinyl_records 
FOR DELETE 
USING (auth.uid() = seller_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vinyl_records_updated_at
BEFORE UPDATE ON public.vinyl_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for record images
INSERT INTO storage.buckets (id, name, public) VALUES ('record-images', 'record-images', true);

-- Create policies for record image uploads
CREATE POLICY "Users can view all record images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'record-images');

CREATE POLICY "Users can upload their own record images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'record-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own record images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'record-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own record images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'record-images' AND auth.uid()::text = (storage.foldername(name))[1]);