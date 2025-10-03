import { CheckCircle2, Circle, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  time_of_day: string;
  streak: number;
}

interface HabitWithCompletion extends Habit {
  completed: boolean;
}

export const TodayHabits = () => {
  const [habits, setHabits] = useState<HabitWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("id, name, time_of_day, streak")
        .order("time_of_day");

      if (habitsError) throw habitsError;

      const today = new Date().toISOString().split('T')[0];
      
      const { data: completionsData, error: completionsError } = await supabase
        .from("habit_completions")
        .select("habit_id, completed")
        .eq("date", today);

      if (completionsError) throw completionsError;

      const completionsMap = new Map(
        completionsData?.map(c => [c.habit_id, c.completed]) || []
      );

      const habitsWithCompletion: HabitWithCompletion[] = habitsData?.map(h => ({
        ...h,
        completed: completionsMap.get(h.id) || false
      })) || [];

      setHabits(habitsWithCompletion);
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const newCompleted = !habit.completed;
    const today = new Date().toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from("habit_completions")
        .upsert({
          habit_id: id,
          date: today,
          completed: newCompleted
        }, {
          onConflict: 'habit_id,date'
        });

      if (error) throw error;

      // Update streak if completing
      if (newCompleted) {
        const { error: updateError } = await supabase
          .from("habits")
          .update({ streak: habit.streak + 1 })
          .eq("id", id);

        if (updateError) throw updateError;

        toast.success(`${habit.name} completed! 🎉`, {
          description: `${habit.streak + 1} day streak!`
        });
      }

      fetchHabits();
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit");
    }
  };

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const groupedHabits = habits.reduce((acc, habit) => {
    if (!acc[habit.time_of_day]) acc[habit.time_of_day] = [];
    acc[habit.time_of_day].push(habit);
    return acc;
  }, {} as Record<string, HabitWithCompletion[]>);

  if (habits.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl text-center">
        <h3 className="text-xl font-semibold mb-2">No Habits Yet</h3>
        <p className="text-muted-foreground">Create your first habit to get started!</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Today's Habits</h3>
        <span className="text-sm text-muted-foreground">{completedCount}/{totalCount} complete</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full gradient-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4">
        {Object.entries(groupedHabits).map(([timeOfDay, timeHabits]) => (
          <div key={timeOfDay} className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {timeOfDay}
            </p>
            {timeHabits.map(habit => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] ${
                  habit.completed 
                    ? "bg-success/10 border border-success/20" 
                    : "bg-muted/50 border border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                  <span className={habit.completed ? "line-through text-muted-foreground" : ""}>
                    {habit.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold">{habit.streak}</span>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
