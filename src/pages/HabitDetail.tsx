import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2, Pause, Play, Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Habit {
  id: string;
  name: string;
  frequency: string;
  time_of_day: string;
  streak: number;
  longest_streak: number;
  paused: boolean;
  pause_reason: string | null;
  created_at: string;
  linked_vision_id: string | null;
}

interface CompletionData {
  date: string;
  completed: boolean;
}

export default function HabitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [completions, setCompletions] = useState<CompletionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stats, setStats] = useState({
    sevenDay: 0,
    thirtyDay: 0,
    ninetyDay: 0,
  });

  useEffect(() => {
    fetchHabitData();
  }, [id]);

  const fetchHabitData = async () => {
    try {
      const { data: habitData, error: habitError } = await supabase
        .from("habits")
        .select("*")
        .eq("id", id)
        .single();

      if (habitError) throw habitError;
      setHabit(habitData);

      const { data: completionsData } = await supabase
        .from("habit_completions")
        .select("date, completed")
        .eq("habit_id", id)
        .order("date", { ascending: false })
        .limit(90);

      const formattedCompletions = completionsData || [];
      setCompletions(formattedCompletions);

      // Calculate completion rates
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      const sevenDayCompletions = formattedCompletions.filter(
        c => new Date(c.date) >= sevenDaysAgo && c.completed
      );
      const thirtyDayCompletions = formattedCompletions.filter(
        c => new Date(c.date) >= thirtyDaysAgo && c.completed
      );
      const ninetyDayCompletions = formattedCompletions.filter(
        c => new Date(c.date) >= ninetyDaysAgo && c.completed
      );

      setStats({
        sevenDay: Math.round((sevenDayCompletions.length / 7) * 100),
        thirtyDay: Math.round((thirtyDayCompletions.length / 30) * 100),
        ninetyDay: Math.round((ninetyDayCompletions.length / 90) * 100),
      });
    } catch (error) {
      console.error("Error fetching habit:", error);
      toast({ title: "Error loading habit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePause = async () => {
    if (!habit) return;
    
    try {
      const { error } = await supabase
        .from("habits")
        .update({ paused: !habit.paused })
        .eq("id", id);

      if (error) throw error;
      
      setHabit({ ...habit, paused: !habit.paused });
      toast({ 
        title: habit.paused ? "Habit resumed" : "Habit paused",
        description: habit.paused ? "Welcome back! Keep building that streak." : "Take the time you need."
      });
    } catch (error) {
      console.error("Error toggling pause:", error);
      toast({ title: "Error updating habit", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Habit deleted successfully" });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({ title: "Error deleting habit", variant: "destructive" });
    }
  };

  const renderCalendarHeatmap = () => {
    const today = new Date();
    const daysToShow = 84; // 12 weeks
    const weeks = [];
    
    for (let i = 0; i < 12; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        const dayOffset = i * 7 + j;
        const date = new Date(today.getTime() - (daysToShow - dayOffset) * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const completion = completions.find(c => c.date === dateStr);
        
        week.push({
          date: dateStr,
          completed: completion?.completed || false,
        });
      }
      weeks.push(week);
    }

    return (
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((day, dayIdx) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${
                  day.completed
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
                title={day.date}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen p-6">
        <p>Habit not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="glass p-6 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{habit.name}</h1>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">{habit.frequency}</Badge>
              <Badge variant="secondary">{habit.time_of_day}</Badge>
              {habit.paused && (
                <Badge className="bg-yellow-500/20 text-yellow-400">Paused</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleTogglePause}>
              {habit.paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold">{habit.streak}</p>
                <p className="text-xs text-muted-foreground">Current Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">{habit.longest_streak}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{stats.sevenDay}%</p>
                <p className="text-xs text-muted-foreground">7-Day Rate</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{stats.thirtyDay}%</p>
                <p className="text-xs text-muted-foreground">30-Day Rate</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Completion History</h2>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Last 12 weeks</p>
          {renderCalendarHeatmap()}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.sevenDay}%</p>
            <p className="text-xs text-muted-foreground">7 days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.thirtyDay}%</p>
            <p className="text-xs text-muted-foreground">30 days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.ninetyDay}%</p>
            <p className="text-xs text-muted-foreground">90 days</p>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{habit.name}" and all completion history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
