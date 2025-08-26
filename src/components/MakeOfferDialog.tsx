import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/components/ui/use-toast";

interface MakeOfferDialogProps {
  recordId: string;
  sellerId: string;
  askingPrice: number;
  albumName: string;
  artist: string;
}

const MakeOfferDialog = ({ recordId, sellerId, askingPrice, albumName, artist }: MakeOfferDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { isPro, createCheckout } = useSubscription();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make an offer",
        variant: "destructive",
      });
      return;
    }

    if (user.id === sellerId) {
      toast({
        title: "Cannot make offer",
        description: "You cannot make an offer on your own listing",
        variant: "destructive",
      });
      return;
    }

    const offerAmount = parseFloat(amount);
    if (isNaN(offerAmount) || offerAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid offer amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("offers")
        .insert({
          record_id: recordId,
          buyer_id: user.id,
          seller_id: sellerId,
          amount: offerAmount,
          message: message.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Offer submitted!",
        description: `Your offer of $${offerAmount} has been sent to the seller`,
      });

      setIsOpen(false);
      setAmount("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold">
          MAKE OFFER
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">{albumName}</h4>
            <p className="text-muted-foreground">by {artist}</p>
            <p className="text-sm text-muted-foreground">Asking price: <span className="font-semibold text-rock-primary">${askingPrice}</span></p>
          </div>
          
          {/* Pro member benefits notification */}
          {!isPro && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Pro members get instant notifications & featured placement.</span>
                  </p>
                  <Button
                    type="button"
                    onClick={createCheckout}
                    size="sm"
                    className="mt-2 bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Crown className="mr-1 h-3 w-3" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isPro && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-green-900">Pro Member Benefits Active</span>
              </div>
              <p className="text-xs text-green-800 mt-1">
                You'll get instant notifications and your offers get featured placement!
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Your Offer ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter your offer amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message to the seller..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-rock-primary hover:bg-rock-primary-glow text-rock-dark"
              >
                {isSubmitting ? "Submitting..." : "Submit Offer"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferDialog;