import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
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
  const [showProComparison, setShowProComparison] = useState(false);
  const { toast } = useToast();
  const { isPro, createCheckout } = useSubscription();

  const buyerFee = isPro ? 0 : offer.amount * 0.04;
  const totalAmount = offer.amount + buyerFee;
  const proMonthlyCost = 9.99;

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

          {/* Pro Membership Savings Banner */}
          {!isPro && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-amber-900 mb-1">
                    Save the 4% buyer fee with Pro—pay ${proMonthlyCost}/mo and this order's fee is $0
                  </h5>
                  <div className="text-sm text-amber-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Current total: ${totalAmount.toFixed(2)}</span>
                      <span>With Pro: ${offer.amount.toFixed(2)}</span>
                    </div>
                    <div className="font-medium text-amber-900">
                      You save: ${buyerFee.toFixed(2)} on this order
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProComparison(!showProComparison)}
                    className="text-sm text-amber-700 underline mt-2"
                  >
                    {showProComparison ? "Hide" : "Show"} price comparison
                  </button>
                  
                  {showProComparison && (
                    <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">Without Pro</div>
                          <div>Record: ${offer.amount.toFixed(2)}</div>
                          <div>4% Fee: ${buyerFee.toFixed(2)}</div>
                          <div className="font-bold border-t pt-1">Total: ${totalAmount.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-amber-900">With Pro</div>
                          <div>Record: ${offer.amount.toFixed(2)}</div>
                          <div>4% Fee: $0.00</div>
                          <div className="font-bold border-t pt-1">Total: ${offer.amount.toFixed(2)}</div>
                        </div>
                      </div>
                      <Button
                        onClick={createCheckout}
                        size="sm"
                        className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Pro (${proMonthlyCost}/mo)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isPro && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-green-900">Pro Member - No buyer fees!</span>
              </div>
              <p className="text-sm text-green-800 mt-1">
                You're saving ${buyerFee.toFixed(2)} on this purchase with your Pro membership.
              </p>
            </div>
          )}

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
                  Pay ${totalAmount.toFixed(2)}
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