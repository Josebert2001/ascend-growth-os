import { Lightbulb, TrendingUp, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { dismissInsight } from "@/lib/insightGenerator";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  id: string;
  type: "pattern" | "prediction" | "celebration" | "suggestion";
  title: string;
  description: string;
}

export const InsightCards = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("dismissed", false)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      
      const typedInsights: Insight[] = (data || []).map(item => ({
        id: item.id,
        type: item.type as Insight['type'],
        title: item.title,
        description: item.description
      }));
      
      setInsights(typedInsights);
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (insightId: string) => {
    await dismissInsight(insightId);
    setInsights(insights.filter(i => i.id !== insightId));
    toast({ title: "Insight dismissed" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "pattern": return Lightbulb;
      case "prediction": return TrendingUp;
      case "celebration": return Sparkles;
      default: return Lightbulb;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "pattern": return "text-blue-400";
      case "prediction": return "text-purple-400";
      case "celebration": return "text-pink-400";
      default: return "text-primary";
    }
  };

  if (loading || insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">AI Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type);
          const colorClass = getColor(insight.type);
          
          return (
            <div key={insight.id} className="glass p-4 rounded-xl hover:scale-[1.02] transition-transform relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => handleDismiss(insight.id)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Icon className={`w-6 h-6 ${colorClass} mb-3`} />
              <h4 className="font-semibold mb-2">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
