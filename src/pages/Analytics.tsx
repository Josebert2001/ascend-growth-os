import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Target, Zap, TrendingUp, Award, Calendar, Brain } from "lucide-react";

export default function Analytics() {
  const [stats, setStats] = useState({
    totalVisions: 0,
    totalHabits: 0,
    overallCompletionRate: 0,
    longestStreak: 0,
    totalCheckIns: 0,
    daysOnAscend: 0,
    growthScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: visions } = await supabase
        .from("visions")
        .select("*")
        .eq("user_id", user.id)
        .eq("archived", false);

      const { data: habits } = await supabase
        .from("habits")
        .select("streak, longest_streak")
        .eq("user_id", user.id);

      const { data: checkIns } = await supabase
        .from("check_ins")
        .select("id")
        .eq("user_id", user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", user.id)
        .single();

      const longestStreak = habits?.reduce((max, h) => Math.max(max, h.longest_streak), 0) || 0;
      const avgStreak = habits?.reduce((sum, h) => sum + h.streak, 0) / (habits?.length || 1) || 0;
      
      const daysOnAscend = profile?.created_at 
        ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Calculate growth score (0-100 composite metric)
      const growthScore = Math.min(100, Math.round(
        (visions?.length || 0) * 10 +
        (habits?.length || 0) * 5 +
        avgStreak * 2 +
        (checkIns?.length || 0) * 1
      ));

      setStats({
        totalVisions: visions?.length || 0,
        totalHabits: habits?.length || 0,
        overallCompletionRate: avgStreak > 0 ? Math.round(avgStreak * 10) : 0,
        longestStreak,
        totalCheckIns: checkIns?.length || 0,
        daysOnAscend,
        growthScore,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your personal growth journey</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="mood">Mood & Energy</TabsTrigger>
          <TabsTrigger value="visions">Visions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold">Growth Score</h2>
                <span className="text-4xl font-bold text-primary">{stats.growthScore}</span>
              </div>
              <Progress value={stats.growthScore} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Your overall growth metric based on visions, habits, and consistency
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              icon={Target}
              label="Active Visions"
              value={stats.totalVisions}
              color="bg-purple-500/20 text-purple-400"
            />
            <StatCard
              icon={Zap}
              label="Habits Tracked"
              value={stats.totalHabits}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              icon={TrendingUp}
              label="Completion Rate"
              value={`${stats.overallCompletionRate}%`}
              color="bg-green-500/20 text-green-400"
            />
            <StatCard
              icon={Award}
              label="Longest Streak"
              value={stats.longestStreak}
              color="bg-yellow-500/20 text-yellow-400"
            />
            <StatCard
              icon={Brain}
              label="Total Check-ins"
              value={stats.totalCheckIns}
              color="bg-pink-500/20 text-pink-400"
            />
            <StatCard
              icon={Calendar}
              label="Days on Ascend"
              value={stats.daysOnAscend}
              color="bg-cyan-500/20 text-cyan-400"
            />
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Habits Performance</h2>
            <p className="text-muted-foreground">
              Detailed habit analytics coming soon...
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mood & Energy Trends</h2>
            <p className="text-muted-foreground">
              Mood and energy analytics coming soon...
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="visions" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Vision Progress</h2>
            <p className="text-muted-foreground">
              Vision analytics coming soon...
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
