import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseImageUploadReturn {
  uploading: boolean;
  uploadImages: (files: File[], userId: string) => Promise<string[]>;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (files: File[], userId: string): Promise<string[]> => {
    if (files.length < 2) {
      toast({
        title: "Minimum Images Required",
        description: "Please upload at least 2 images of your vinyl record.",
        variant: "destructive",
      });
      return [];
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('record-images')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('record-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(data.publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImages,
  };
};