import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Disc, DollarSign } from "lucide-react";

const conditions = [
  'Mint',
  'Near Mint', 
  'Very Good Plus',
  'Very Good',
  'Good Plus',
  'Good',
  'Fair',
  'Poor'
];

const genres = [
  'Rock',
  'Pop',
  'Jazz',
  'Blues',
  'Classical',
  'Electronic',
  'Hip Hop',
  'Country',
  'Folk',
  'R&B/Soul',
  'Reggae',
  'Metal',
  'Punk',
  'Alternative',
  'World Music',
  'Other'
];

export const CreateListing = () => {
  const { user, loading } = useAuth();
  const { uploadImages, uploading } = useImageUpload();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    albumName: '',
    artist: '',
    condition: '',
    price: '',
    description: '',
    genre: '',
    releaseYear: '',
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Disc className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length < 2) {
      toast({
        title: "Images Required",
        description: "Please upload at least 2 images of your vinyl record.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload images first
      const imageUrls = await uploadImages(selectedImages, user.id);
      
      if (imageUrls.length === 0) {
        setSubmitting(false);
        return;
      }

      // Create the listing
      const { error } = await supabase
        .from('vinyl_records')
        .insert({
          seller_id: user.id,
          album_name: formData.albumName,
          artist: formData.artist,
          condition: formData.condition,
          price: parseFloat(formData.price),
          description: formData.description,
          genre: formData.genre,
          release_year: formData.releaseYear ? parseInt(formData.releaseYear) : null,
          images: imageUrls,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Listing Created!",
        description: "Your vinyl record has been listed successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc className="h-6 w-6" />
                List Your Vinyl Record
              </CardTitle>
              <CardDescription>
                Create a listing for your vinyl record. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="albumName">Album Name *</Label>
                    <Input
                      id="albumName"
                      value={formData.albumName}
                      onChange={(e) => handleInputChange('albumName', e.target.value)}
                      placeholder="Enter album name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artist">Artist *</Label>
                    <Input
                      id="artist"
                      value={formData.artist}
                      onChange={(e) => handleInputChange('artist', e.target.value)}
                      placeholder="Enter artist name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => handleInputChange('condition', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="releaseYear">Release Year</Label>
                    <Input
                      id="releaseYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.releaseYear}
                      onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                      placeholder="e.g. 1975"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select
                    value={formData.genre}
                    onValueChange={(value) => handleInputChange('genre', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the condition, any special features, or additional details about your vinyl record..."
                    rows={4}
                  />
                </div>

                <ImageUpload
                  onImagesChange={setSelectedImages}
                  maxImages={5}
                  minImages={2}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || uploading || selectedImages.length < 2}
                    className="flex-1"
                  >
                    {submitting || uploading ? "Creating Listing..." : "Create Listing"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};