import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MakeOfferDialog from "./MakeOfferDialog";

interface RecordCardProps {
  recordId?: string;
  sellerId?: string;
  albumName: string;
  artist: string;
  condition: string;
  price: number;
  imageUrl: string;
  isRare?: boolean;
}

const RecordCard = ({ recordId, sellerId, albumName, artist, condition, price, imageUrl, isRare }: RecordCardProps) => {
  return (
    <div className="bg-rock-card rounded-xl p-4 border border-rock-border hover:border-rock-primary/50 transition-all duration-300 hover:shadow-glow group">
      <div className="relative mb-4">
        <img 
          src={imageUrl} 
          alt={`${albumName} by ${artist}`}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-rock-dark/80 hover:bg-rock-primary">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          {isRare && (
            <Badge className="bg-rock-primary text-rock-dark font-bold">
              RARE FIND
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-foreground text-lg leading-tight">{albumName}</h3>
        <p className="text-muted-foreground">{artist}</p>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Condition</p>
            <Badge variant="outline" className="border-rock-border text-rock-primary">
              {condition}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-rock-primary">${price}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {recordId && sellerId ? (
            <MakeOfferDialog
              recordId={recordId}
              sellerId={sellerId}
              askingPrice={price}
              albumName={albumName}
              artist={artist}
            />
          ) : (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
              MAKE OFFER
            </Button>
          )}
          <Button className="flex-1 bg-white hover:bg-gray-50 text-black border border-gray-200 font-bold">
            BUY NOW
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;