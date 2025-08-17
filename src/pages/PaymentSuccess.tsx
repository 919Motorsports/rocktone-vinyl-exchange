import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { sessionId }
      });

      if (error) throw error;

      if (data?.success) {
        setPaymentVerified(true);
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed and the seller has been notified.",
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: data?.message || "Unable to verify payment status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast({
        title: "Verification Error",
        description: "There was an issue verifying your payment. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto border-rock-border">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rock-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto border-rock-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {paymentVerified ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <Package className="h-16 w-16 text-rock-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {paymentVerified ? "Payment Successful!" : "Payment Status"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {paymentVerified ? (
            <>
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Thank you for your purchase! Your payment has been processed successfully.
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-green-800 space-y-1 text-left">
                    <li>• The seller has been notified of your purchase</li>
                    <li>• You'll receive an email confirmation shortly</li>
                    <li>• The seller will prepare and ship your vinyl record</li>
                    <li>• You'll receive tracking information once shipped</li>
                    <li>• Check your dashboard for order updates</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                We're having trouble verifying your payment status.
              </p>
              <p className="text-sm text-muted-foreground">
                If you completed the payment, please check your dashboard or contact support.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              variant="outline"
              className="border-rock-border hover:border-rock-primary"
            >
              <Link to="/dashboard">
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </Link>
            </Button>
            
            <Button
              asChild
              className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;