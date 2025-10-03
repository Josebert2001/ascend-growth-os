import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { GrowthMatrix } from "@/components/GrowthMatrix";
import { Visions } from "@/components/Visions";
import { Habits } from "@/components/Habits";
import { Mindfulness } from "@/components/Mindfulness";
import { AICoach } from "@/components/AICoach";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";

type Tab = "matrix" | "visions" | "habits" | "mindfulness" | "ai";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("matrix");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen pb-32">
      <Header session={session} />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {activeTab === "matrix" && <GrowthMatrix />}
        {activeTab === "visions" && <Visions />}
        {activeTab === "habits" && <Habits />}
        {activeTab === "mindfulness" && <Mindfulness />}
        {activeTab === "ai" && <AICoach />}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
