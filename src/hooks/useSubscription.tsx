import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
}

export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: "Free",
    subscription_end: null,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user) {
      setSubscriptionStatus({
        subscribed: false,
        subscription_tier: "Free", 
        subscription_end: null,
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier || "Free",
        subscription_end: data.subscription_end || null,
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscriptionStatus({
        subscribed: false,
        subscription_tier: "Free",
        subscription_end: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade to Pro",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast({
        title: "Authentication required", 
        description: "Please sign in to manage your subscription",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      // Open customer portal in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  return {
    subscriptionStatus,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    isPro: subscriptionStatus.subscribed && subscriptionStatus.subscription_tier === "Pro",
  };
};