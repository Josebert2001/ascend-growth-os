import { TodayHabits } from "./dashboard/TodayHabits";
import { VisionProgress } from "./dashboard/VisionProgress";
import { DailyCheckInCard } from "./dashboard/DailyCheckInCard";
import { InsightCards } from "./dashboard/InsightCards";
import { QuickStats } from "./dashboard/QuickStats";
import { Sunrise } from "lucide-react";

export const GrowthMatrix = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="glass p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div className="relative flex items-center gap-4">
          <Sunrise className="w-12 h-12 text-primary animate-float" />
          <div>
            <h2 className="text-3xl font-bold">{getGreeting()}</h2>
            <p className="text-muted-foreground">Ready to grow today?</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Today's Habits */}
      <TodayHabits />

      {/* Daily Check-in */}
      <DailyCheckInCard />

      {/* AI Insights */}
      <InsightCards />

      {/* Vision Progress */}
      <VisionProgress />
    </div>
  );
};
