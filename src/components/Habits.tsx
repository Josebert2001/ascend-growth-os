import { useState, useEffect } from "react";
import { Plus, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateHabitDialog } from "./habits/CreateHabitDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  linked_vision_id: string | null;
  frequency: string;
  time_of_day: string;
  streak: number;
  longest_streak: number;
  visions?: { title: string } | null;
}

export const Habits = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const { data, error } = await supabase
        .from("habits")
        .select(`
          id,
          name,
          linked_vision_id,
          frequency,
          time_of_day,
          streak,
          longest_streak,
          visions (title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error("Error fetching habits:", error);
      toast.error("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionRate = () => {
    // Placeholder - would need to calculate from completions
    return 85;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-24 bg-muted rounded-xl"></div>
          <div className="h-24 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Your Habits</h2>
          <p className="text-muted-foreground mt-1">Daily actions that build your visions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gradient-primary border-0">
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-2">No Habits Yet</h3>
          <p className="text-muted-foreground mb-6">Create your first habit to start building momentum</p>
          <Button onClick={() => setShowCreateDialog(true)} className="gradient-primary border-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Habit
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="glass p-5 rounded-xl hover:scale-[1.01] transition-transform">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{habit.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {habit.visions?.title || "No vision linked"}
                  </p>
                </div>
                <div className="flex items-center gap-2 glass px-3 py-1 rounded-full">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold">{habit.streak}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Frequency</p>
                  <p className="font-semibold">{habit.frequency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Time</p>
                  <p className="font-semibold">{habit.time_of_day}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Best Streak</p>
                  <p className="font-semibold">{habit.longest_streak} days</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateHabitDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onCreateHabit={fetchHabits}
      />
    </div>
  );
};
