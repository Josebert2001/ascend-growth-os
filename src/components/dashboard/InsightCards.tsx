import { Lightbulb, TrendingUp, Sparkles } from "lucide-react";

interface Insight {
  id: string;
  type: "pattern" | "prediction" | "celebration";
  title: string;
  description: string;
}

export const InsightCards = () => {
  const insights: Insight[] = [
    {
      id: "1",
      type: "pattern",
      title: "Morning Momentum",
      description: "You complete meditation 90% of the time in mornings. This seems to be your optimal window!"
    },
    {
      id: "2",
      type: "prediction",
      title: "High Success Today",
      description: "Based on your energy patterns, you're likely to crush your workout today 💪"
    },
    {
      id: "3",
      type: "celebration",
      title: "Consistency King",
      description: "15-day streak on gratitude journaling! You're building something meaningful."
    }
  ];

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

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">AI Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type);
          const colorClass = getColor(insight.type);
          
          return (
            <div key={insight.id} className="glass p-4 rounded-xl hover:scale-[1.02] transition-transform">
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
