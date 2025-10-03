import { useState, useEffect } from "react";
import { User, LogOut, Bell, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || "");
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const getUserName = () => {
    if (userEmail) {
      return userEmail.split('@')[0];
    }
    return "User Name";
  };

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <div className="bg-card p-6 rounded-3xl border border-border text-center">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-1">{getUserName()}</h2>
        <p className="text-sm text-muted-foreground mb-4">{userEmail}</p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
          Edit Profile
        </Button>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        {/* Notifications */}
        <div className="bg-card p-5 rounded-3xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Turn on Notifications</span>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        {/* Invite People */}
        <div className="bg-card p-5 rounded-3xl border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Invite People</span>
            </div>
            <Button variant="outline" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-full px-6">
              Invite
            </Button>
          </div>
        </div>

        {/* Log Out */}
        <div className="bg-card p-5 rounded-3xl border border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left text-destructive hover:text-destructive/80 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
