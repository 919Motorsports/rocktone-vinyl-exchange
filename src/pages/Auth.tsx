import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Hero section with rock aesthetic */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-black text-rock-primary mb-4 tracking-tight">
            ROCKTONE<br />MARKETPLACE
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the ultimate vinyl marketplace. Buy, sell, and discover rare records 
            with fellow collectors who share your passion for rock music.
          </p>
        </div>

        {/* Auth form */}
        <div className="flex justify-center">
          <AuthForm mode={mode} onModeChange={setMode} />
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-rock-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-rock-dark">4%</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Low Fees</h3>
            <p className="text-muted-foreground">
              Only 4% listing fee for sellers and 4% buyer fee. 
              More money in your pocket.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rock-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-rock-dark">🎵</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Rock Focus</h3>
            <p className="text-muted-foreground">
              Specialized marketplace for rock, metal, and alternative vinyl records.
            </p>
          </div>
          
            <div className="text-center">
              <div className="w-16 h-16 bg-rock-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-rock-dark">💬</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Make Offers</h3>
              <p className="text-muted-foreground">
                Negotiate prices with our built-in offer system.
                Accept, counter, or decline offers.
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
