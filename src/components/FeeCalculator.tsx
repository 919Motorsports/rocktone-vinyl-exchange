import { Card, CardContent } from "@/components/ui/card";

interface FeeCalculatorProps {
  amount: number;
  className?: string;
}

const FeeCalculator = ({ amount, className = "" }: FeeCalculatorProps) => {
  const FEE_RATE = 0.04; // 4%
  const buyerFee = Math.round(amount * FEE_RATE * 100) / 100;
  const sellerFee = Math.round(amount * FEE_RATE * 100) / 100;
  const totalAmount = amount + buyerFee;

  return (
    <Card className={`border-rock-border ${className}`}>
      <CardContent className="p-4 space-y-3">
        <h4 className="font-semibold text-foreground">Transaction Summary</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Offer Amount:</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buyer Fee (4%):</span>
            <span className="font-medium text-rock-primary">${buyerFee.toFixed(2)}</span>
          </div>
          
          <div className="border-t border-rock-border pt-2">
            <div className="flex justify-between">
              <span className="font-semibold">Total to Pay:</span>
              <span className="font-bold text-rock-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              Seller receives: <span className="font-medium">${(amount - sellerFee).toFixed(2)}</span> (after 4% seller fee)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeCalculator;