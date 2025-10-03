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
    <div className="space-y-5 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-card p-5 rounded-3xl border border-border">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold">Hello</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Sunrise className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-base font-semibold">User Name</p>
      </div>

      {/* Daily Progress */}
      <div className="bg-card p-5 rounded-3xl border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold">Daily progress</h3>
          <span className="text-sm text-muted-foreground">Here is your daily stats</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">75%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
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
