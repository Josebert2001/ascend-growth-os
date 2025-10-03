import { useState } from "react";
import { Plus, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateHabitDialog } from "./habits/CreateHabitDialog";

interface Habit {
  id: string;
  name: string;
  linkedVision: string;
  frequency: string;
  timeOfDay: string;
  streak: number;
  longestStreak: number;
  completionRate: number;
}

export const Habits = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Morning Meditation",
      linkedVision: "Peak Physical Health",
      frequency: "Daily",
      timeOfDay: "Morning",
      streak: 7,
      longestStreak: 12,
      completionRate: 85
    },
    {
      id: "2",
      name: "Read 20 Pages",
      linkedVision: "Master Spanish",
      frequency: "Daily",
      timeOfDay: "Morning",
      streak: 12,
      longestStreak: 15,
      completionRate: 92
    },
    {
      id: "3",
      name: "Learn Spanish",
      linkedVision: "Master Spanish",
      frequency: "Daily",
      timeOfDay: "Evening",
      streak: 3,
      longestStreak: 8,
      completionRate: 70
    },
  ]);

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

      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="glass p-5 rounded-xl hover:scale-[1.01] transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold mb-1">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">{habit.linkedVision}</p>
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
                <p className="font-semibold">{habit.timeOfDay}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">30-day Rate</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <p className="font-semibold">{habit.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreateHabitDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onCreateHabit={(habit) => {
          setHabits([...habits, habit]);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
};
