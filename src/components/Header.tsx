import { Sparkles, Flame, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  session: Session;
}

export const Header = ({ session }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <div className="absolute inset-0 blur-lg bg-primary/30 animate-glow" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Ascend</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-semibold">7 Day Streak</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              className="glass"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
