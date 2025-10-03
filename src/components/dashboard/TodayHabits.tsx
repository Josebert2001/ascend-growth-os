import { CheckCircle2, Circle, Flame } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
  timeOfDay: string;
}

export const TodayHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", name: "Morning Meditation", completed: true, streak: 7, timeOfDay: "Morning" },
    { id: "2", name: "Read 20 Pages", completed: true, streak: 12, timeOfDay: "Morning" },
    { id: "3", name: "Workout", completed: false, streak: 5, timeOfDay: "Afternoon" },
    { id: "4", name: "Learn Spanish", completed: false, streak: 3, timeOfDay: "Evening" },
    { id: "5", name: "Gratitude Journal", completed: false, streak: 15, timeOfDay: "Evening" },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
    
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      toast.success(`${habit.name} completed! 🎉`, {
        description: `${habit.streak + 1} day streak!`
      });
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progress = (completedCount / totalCount) * 100;

  const groupedHabits = habits.reduce((acc, habit) => {
    if (!acc[habit.timeOfDay]) acc[habit.timeOfDay] = [];
    acc[habit.timeOfDay].push(habit);
    return acc;
  }, {} as Record<string, Habit[]>);

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Today's Habits</h3>
        <span className="text-sm text-muted-foreground">{completedCount}/{totalCount} complete</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full gradient-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grouped Habits */}
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
