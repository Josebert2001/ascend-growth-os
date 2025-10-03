import { Target, Flame, TrendingUp, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const QuickStats = () => {
  const [stats, setStats] = useState({
    activeVisions: 0,
    longestStreak: 0,
    weekCompletion: 0,
    totalCheckIns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get active visions count
      const { count: visionsCount } = await supabase
        .from("visions")
        .select("*", { count: 'exact', head: true });

      // Get longest streak from habits
      const { data: habits } = await supabase
        .from("habits")
        .select("longest_streak")
        .order("longest_streak", { ascending: false })
        .limit(1);

      // Get check-ins count
      const { count: checkInsCount } = await supabase
        .from("check_ins")
        .select("*", { count: 'exact', head: true });

      // Calculate week completion (simplified)
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: weekCompletions } = await supabase
        .from("habit_completions")
        .select("completed")
        .gte("date", weekAgo.toISOString().split('T')[0])
        .lte("date", today.toISOString().split('T')[0]);

      const completedCount = weekCompletions?.filter(c => c.completed).length || 0;
      const totalCount = weekCompletions?.length || 1;
      const weekCompletionRate = Math.round((completedCount / totalCount) * 100);

      setStats({
        activeVisions: visionsCount || 0,
        longestStreak: habits?.[0]?.longest_streak || 0,
        weekCompletion: weekCompletionRate,
        totalCheckIns: checkInsCount || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass p-4 rounded-xl">
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsList = [
    { label: "Active Visions", value: stats.activeVisions.toString(), icon: Target, color: "text-purple-400" },
    { label: "Longest Streak", value: stats.longestStreak.toString(), icon: Flame, color: "text-orange-400" },
    { label: "Week Completion", value: `${stats.weekCompletion}%`, icon: TrendingUp, color: "text-emerald-400" },
    { label: "Check-ins", value: stats.totalCheckIns.toString(), icon: Calendar, color: "text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsList.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass p-4 rounded-xl text-center hover:scale-[1.05] transition-transform">
            <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};
