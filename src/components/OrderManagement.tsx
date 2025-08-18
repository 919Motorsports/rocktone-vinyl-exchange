import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Package, Truck, CheckCircle, Clock, AlertCircle, Star } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import ReviewForm from "./ReviewForm";
import ReviewDisplay from "./ReviewDisplay";

interface Order {
  id: string;
  status: string;
  offer_amount: number;
  buyer_fee: number;
  seller_fee: number;
  total_amount: number;
  buyer_id: string;
  seller_id: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  record: {
    album_name: string;
    artist: string;
    images: string[];
  };
  buyer: {
    full_name: string;
  };
  seller: {
    full_name: string;
  };
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [existingReviews, setExistingReviews] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
      checkExistingReviews();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          record:vinyl_records(album_name, artist, images),
          buyer:profiles!orders_buyer_id_fkey(full_name),
          seller:profiles!orders_seller_id_fkey(full_name)
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders((data as any) || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkExistingReviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("order_id")
        .eq("reviewer_id", user.id);

      if (error) throw error;

      const reviewMap: Record<string, boolean> = {};
      data?.forEach((review) => {
        reviewMap[review.order_id] = true;
      });
      setExistingReviews(reviewMap);
    } catch (error) {
      console.error("Error checking existing reviews:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          tracking_number: trackingNumber || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      setEditingOrder(null);
      setTrackingNumber("");
      setNotes("");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(null);
    checkExistingReviews();
    sonnerToast.success("Thank you for your review!");
  };

  const canLeaveReview = (order: Order) => {
    return order.status === "completed" && !existingReviews[order.id];
  };

  const getRevieweeId = (order: Order) => {
    return user?.id === order.buyer_id ? order.seller_id : order.buyer_id;
  };

  const getReviewerType = (order: Order): "buyer" | "seller" => {
    return user?.id === order.buyer_id ? "buyer" : "seller";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_payment": return <Clock className="h-4 w-4" />;
      case "paid": return <Package className="h-4 w-4" />;
      case "shipped": return <Truck className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "cancelled": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_payment": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "paid": return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-300";
      case "completed": return "bg-green-100 text-green-800 border-green-300";
      case "cancelled": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const canManageOrder = (order: Order) => {
    return order.seller_id === user?.id && order.status !== "completed" && order.status !== "cancelled";
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card className="border-rock-border">
        <CardContent className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">Your orders will appear here once you make or receive purchases.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>
      
      <div className="grid gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="border-rock-border">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.record.album_name}</CardTitle>
                  <p className="text-muted-foreground">by {order.record.artist}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.buyer_id === user?.id ? `Sold by: ${order.seller.full_name}` : `Bought by: ${order.buyer.full_name}`}
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Offer Amount</p>
                  <p className="font-medium">${order.offer_amount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {order.buyer_id === user?.id ? "Buyer Fee" : "Seller Fee"}
                  </p>
                  <p className="font-medium">
                    ${order.buyer_id === user?.id ? order.buyer_fee : order.seller_fee}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    {order.buyer_id === user?.id ? "Total Paid" : "You Receive"}
                  </p>
                  <p className="font-medium text-rock-primary">
                    ${order.buyer_id === user?.id ? order.total_amount : (order.offer_amount - order.seller_fee).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {order.tracking_number && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Tracking Number:</strong> {order.tracking_number}
                  </p>
                </div>
              )}

              {order.notes && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <strong>Notes:</strong> {order.notes}
                  </p>
                </div>
              )}

              {canManageOrder(order) && (
                <div className="border-t pt-4">
                  {editingOrder === order.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Tracking Number</label>
                        <Input
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes for the buyer"
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark"
                        >
                          Mark as Shipped
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOrder(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {order.status === "paid" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingOrder(order.id);
                            setTrackingNumber(order.tracking_number || "");
                            setNotes(order.notes || "");
                          }}
                          className="bg-rock-primary hover:bg-rock-primary-glow text-rock-dark"
                        >
                          Ship Order
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, "completed")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Review Section */}
              {order.status === "completed" && (
                <div className="mt-4 pt-4 border-t border-border">
                  {showReviewForm === order.id ? (
                    <ReviewForm
                      orderId={order.id}
                      revieweeId={getRevieweeId(order)}
                      reviewerType={getReviewerType(order)}
                      onReviewSubmitted={handleReviewSubmitted}
                      onCancel={() => setShowReviewForm(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">
                          {existingReviews[order.id] 
                            ? "You have reviewed this transaction" 
                            : "Rate your experience"}
                        </span>
                      </div>
                      {canLeaveReview(order) && (
                        <Button
                          size="sm"
                          onClick={() => setShowReviewForm(order.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Leave Review
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;