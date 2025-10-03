import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers } from "lucide-react";
import { toast } from "sonner";

export const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;
        toast.success("Account created! Welcome to Ascend 🚀");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        {!isLogin ? (
          // Sign In / Sign Up Form
          <div className="glass p-8 rounded-3xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Welcome Back" : "Start Your Journey"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-input border-border h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-input border-border h-12"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-12 text-base font-semibold rounded-full"
              >
                {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <button
              onClick={() => setIsLogin(false)}
              className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors w-full text-center"
            >
              ← Back
            </button>
          </div>
        ) : (
          // Landing Screen
          <div className="text-center space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl">
                  <Layers className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                The only<br />productivity<br />app you need
              </h1>
            </div>

            {/* Sign In Button */}
            <div className="pt-8">
              <Button
                onClick={() => setIsLogin(false)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-14 text-base font-semibold rounded-full shadow-lg"
              >
                Sign in with Email
              </Button>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 bg-card hover:bg-card/80 border-border h-12 rounded-full"
                disabled
              >
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-card hover:bg-card/80 border-border h-12 rounded-full"
                disabled
              >
                Apple ID
              </Button>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground pt-6 px-4">
              By Continuing you agree to the Terms and Conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
