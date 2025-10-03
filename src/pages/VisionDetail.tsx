import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Archive, Trash2, Plus, Target, TrendingUp } from "lucide-react";
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

interface Vision {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  icon: string;
  timeline: string;
  why_it_matters: string;
  health_score: number;
  created_at: string;
}

interface Path {
  id: string;
  name: string;
  description: string;
  status: string;
  order_index: number;
  completed_at: string | null;
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  frequency: string;
}

export default function VisionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vision, setVision] = useState<Vision | null>(null);
  const [paths, setPaths] = useState<Path[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchVisionData();
  }, [id]);

  const fetchVisionData = async () => {
    try {
      const { data: visionData, error: visionError } = await supabase
        .from("visions")
        .select("*")
        .eq("id", id)
        .single();

      if (visionError) throw visionError;
      setVision(visionData);

      const { data: pathsData } = await supabase
        .from("paths")
        .select("*")
        .eq("vision_id", id)
        .order("order_index");
      setPaths(pathsData || []);

      const { data: habitsData } = await supabase
        .from("habits")
        .select("id, name, streak, frequency")
        .eq("linked_vision_id", id);
      setHabits(habitsData || []);
    } catch (error) {
      console.error("Error fetching vision:", error);
      toast({ title: "Error loading vision", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      const { error } = await supabase
        .from("visions")
        .update({ archived: true })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Vision archived successfully" });
      navigate("/");
    } catch (error) {
      console.error("Error archiving vision:", error);
      toast({ title: "Error archiving vision", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("visions").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Vision deleted successfully" });
      navigate("/");
    } catch (error) {
      console.error("Error deleting vision:", error);
      toast({ title: "Error deleting vision", variant: "destructive" });
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "in-progress": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!vision) {
    return (
      <div className="min-h-screen p-6">
        <p>Vision not found</p>
      </div>
    );
  }

  const completedPaths = paths.filter(p => p.status === "completed").length;
  const progress = paths.length > 0 ? (completedPaths / paths.length) * 100 : 0;

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className={`glass p-6 rounded-xl bg-gradient-to-br ${vision.color}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{vision.title}</h1>
            <Badge variant="secondary">{vision.category}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleArchive}>
              <Archive className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <p className="text-foreground/90 mb-4">{vision.description}</p>
        
        {vision.why_it_matters && (
          <div className="bg-background/10 backdrop-blur-sm p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Why This Matters
            </h3>
            <p className="text-sm text-foreground/80">{vision.why_it_matters}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-foreground/70 mb-1">Timeline</p>
            <p className="font-semibold">{vision.timeline}</p>
          </div>
          <div>
            <p className="text-sm text-foreground/70 mb-1">Health Score</p>
            <p className={`font-semibold text-2xl ${getHealthScoreColor(vision.health_score)}`}>
              {vision.health_score}%
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Progress</h2>
            <p className="text-sm text-muted-foreground">
              {completedPaths} of {paths.length} paths completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{Math.round(progress)}%</p>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Paths</h2>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Path
          </Button>
        </div>

        <div className="space-y-3">
          {paths.map((path) => (
            <div key={path.id} className="glass p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{path.name}</h3>
                  {path.description && (
                    <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                  )}
                  <Badge className={getStatusColor(path.status)}>
                    {path.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          {paths.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No paths yet. Add your first one!</p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Linked Habits ({habits.length})
        </h2>
        
        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="glass p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-accent/50"
              onClick={() => navigate(`/habit/${habit.id}`)}
            >
              <div>
                <p className="font-medium">{habit.name}</p>
                <p className="text-xs text-muted-foreground">{habit.frequency}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{habit.streak} day streak</p>
              </div>
            </div>
          ))}
          {habits.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No habits linked yet</p>
          )}
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vision?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{vision.title}" and all associated paths. This action cannot be undone.
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
