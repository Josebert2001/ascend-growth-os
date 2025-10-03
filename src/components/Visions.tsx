import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateVisionDialog } from "./visions/CreateVisionDialog";
import { VisionCard } from "./visions/VisionCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Vision {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  pathsCompleted: number;
  totalPaths: number;
  linkedHabits: number;
  color: string;
}

export const Visions = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisions();
  }, []);

  const fetchVisions = async () => {
    try {
      const { data: visionsData, error } = await supabase
        .from("visions")
        .select(`
          id,
          title,
          description,
          category,
          color,
          paths (id, status),
          habits (id)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const transformedVisions: Vision[] = visionsData?.map((v: any) => {
        const totalPaths = v.paths?.length || 0;
        const pathsCompleted = v.paths?.filter((p: any) => p.status === 'completed').length || 0;
        const progress = totalPaths > 0 ? Math.round((pathsCompleted / totalPaths) * 100) : 0;

        return {
          id: v.id,
          title: v.title,
          description: v.description || '',
          category: v.category,
          progress,
          pathsCompleted,
          totalPaths,
          linkedHabits: v.habits?.length || 0,
          color: v.color
        };
      }) || [];

      setVisions(transformedVisions);
    } catch (error) {
      console.error("Error fetching visions:", error);
      toast.error("Failed to load visions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-muted rounded-xl"></div>
            <div className="h-48 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Your Visions</h2>
          <p className="text-muted-foreground mt-1">Long-term aspirations & goals</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gradient-primary border-0">
          <Plus className="w-4 h-4 mr-2" />
          New Vision
        </Button>
      </div>

      {visions.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-2">No Visions Yet</h3>
          <p className="text-muted-foreground mb-6">Create your first vision to define your goals</p>
          <Button onClick={() => setShowCreateDialog(true)} className="gradient-primary border-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Vision
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visions.map((vision) => (
            <VisionCard key={vision.id} vision={vision} onUpdate={fetchVisions} />
          ))}
        </div>
      )}

      <CreateVisionDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onCreateVision={fetchVisions}
      />
    </div>
  );
};
