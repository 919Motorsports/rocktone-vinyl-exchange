import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  minImages?: number;
}

export const ImageUpload = ({ 
  onImagesChange, 
  maxImages = 5, 
  minImages = 2 
}: ImageUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length + selectedFiles.length > maxImages) {
      return;
    }

    const newFiles = [...selectedFiles, ...validFiles];
    const newPreviews = [...previews];

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(newFiles);
    onImagesChange(newFiles);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
    onImagesChange(newFiles);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="images" className="text-sm font-medium">
        Record Images (minimum {minImages}, maximum {maxImages})
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {selectedFiles.length < maxImages && (
          <div
            onClick={triggerFileInput}
            className={cn(
              "h-32 border-2 border-dashed border-border rounded-lg",
              "flex flex-col items-center justify-center cursor-pointer",
              "hover:border-primary transition-colors",
              "bg-muted/30"
            )}
          >
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Add Image</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Image className="h-4 w-4" />
        <span>
          {selectedFiles.length}/{maxImages} images selected
          {selectedFiles.length < minImages && (
            <span className="text-destructive ml-1">
              (Need at least {minImages - selectedFiles.length} more)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};