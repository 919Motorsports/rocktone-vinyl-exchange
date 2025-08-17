import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import FeeCalculator from "./FeeCalculator";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    id: string;
    amount: number;
    record: {
      album_name: string;
      artist: string;
    };
    seller: {
      full_name: string;
    };
  };
}

const PaymentDialog = ({ isOpen, onClose, offer }: PaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { offerId: offer.id }
      });

      if (error) throw error;

      if (data?.url) {
        // Open payment in new tab
        window.open(data.url, '_blank');
        onClose();
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create payment session",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-rock-primary" />
            Complete Your Purchase
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">{offer.record.album_name}</h4>
            <p className="text-muted-foreground">by {offer.record.artist}</p>
            <p className="text-sm text-muted-foreground">
              Sold by: {offer.seller.full_name || "Seller"}
            </p>
          </div>

          <FeeCalculator amount={offer.amount} />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Secure Payment Process</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Payments processed securely through Stripe</li>
              <li>• Your payment is protected until delivery</li>
              <li>• Seller will be notified to ship your item</li>
              <li>• You'll receive tracking information</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-rock-primary hover:bg-rock-primary-glow text-rock-dark"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${((offer.amount * 1.04).toFixed(2))}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;