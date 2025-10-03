import { supabase } from "@/integrations/supabase/client";

interface Habit {
  id: string;
  name: string;
  streak: number;
  time_of_day: string;
}

interface HabitCompletion {
  habit_id: string;
  date: string;
  completed: boolean;
}

export const generateInsights = async (userId: string) => {
  try {
    // Fetch user's habits and completions
    const { data: habits } = await supabase
      .from("habits")
      .select("id, name, streak, time_of_day")
      .eq("user_id", userId);

    if (!habits || habits.length === 0) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: completions } = await supabase
      .from("habit_completions")
      .select("habit_id, date, completed")
      .in("habit_id", habits.map(h => h.id))
      .gte("date", thirtyDaysAgo.toISOString().split('T')[0]);

    const insights = [];

    // Pattern Detection: Time of day analysis
    for (const habit of habits) {
      const habitCompletions = completions?.filter(c => c.habit_id === habit.id && c.completed) || [];
      
      if (habitCompletions.length >= 10) {
        const morningCount = habitCompletions.filter(c => {
          const hour = new Date(c.date).getHours();
          return hour >= 5 && hour < 12;
        }).length;

        const completionRate = (habitCompletions.length / 30) * 100;

        if (completionRate > 80 && habit.time_of_day === "Morning") {
          insights.push({
            type: "pattern",
            title: `${habit.name} thriving in mornings!`,
            description: `You complete "${habit.name}" ${completionRate.toFixed(0)}% of the time in the morning. Your consistency is impressive!`,
            user_id: userId,
          });
        }
      }
    }

    // Celebration: Streak milestones
    for (const habit of habits) {
      if (habit.streak === 7 || habit.streak === 21 || habit.streak === 30 || habit.streak === 100) {
        insights.push({
          type: "celebration",
          title: `🎉 ${habit.streak}-day streak!`,
          description: `You've maintained "${habit.name}" for ${habit.streak} days straight. You're building real momentum!`,
          user_id: userId,
        });
      }
    }

    // Predictions: Success likelihood
    const totalCompletions = completions?.filter(c => c.completed).length || 0;
    const avgCompletionRate = (totalCompletions / (habits.length * 30)) * 100;

    if (avgCompletionRate > 70) {
      insights.push({
        type: "prediction",
        title: "High success probability today",
        description: `Based on your ${avgCompletionRate.toFixed(0)}% completion rate, you're likely to complete most of your habits today. Keep it up!`,
        user_id: userId,
      });
    }

    // Suggestions: Optimization opportunities
    for (const habit of habits) {
      const habitCompletions = completions?.filter(c => c.habit_id === habit.id && c.completed) || [];
      const completionRate = (habitCompletions.length / 30) * 100;

      if (completionRate < 50 && habit.time_of_day === "Evening") {
        insights.push({
          type: "suggestion",
          title: `Try moving "${habit.name}" to mornings`,
          description: `Your evening completion rate is ${completionRate.toFixed(0)}%. Morning habits often have higher success rates.`,
          user_id: userId,
        });
      }
    }

    // Insert new insights (limit to 3 most relevant)
    if (insights.length > 0) {
      const topInsights = insights.slice(0, 3);
      
      for (const insight of topInsights) {
        await supabase.from("insights").insert(insight);
      }
    }
  } catch (error) {
    console.error("Error generating insights:", error);
  }
};

export const dismissInsight = async (insightId: string) => {
  try {
    await supabase
      .from("insights")
      .update({ dismissed: true })
      .eq("id", insightId);
  } catch (error) {
    console.error("Error dismissing insight:", error);
  }
};
