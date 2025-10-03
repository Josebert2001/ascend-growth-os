import { useState } from "react";
import { Plus, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateVisionDialog } from "./visions/CreateVisionDialog";
import { VisionCard } from "./visions/VisionCard";

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
  const [visions, setVisions] = useState<Vision[]>([
    {
      id: "1",
      title: "Master Spanish",
      description: "Become conversationally fluent in Spanish",
      category: "Learning",
      progress: 45,
      pathsCompleted: 2,
      totalPaths: 5,
      linkedHabits: 2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "2",
      title: "Peak Physical Health",
      description: "Achieve optimal fitness and wellness",
      category: "Health",
      progress: 70,
      pathsCompleted: 3,
      totalPaths: 4,
      linkedHabits: 3,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "3",
      title: "Launch Side Project",
      description: "Build and ship my SaaS idea",
      category: "Career",
      progress: 30,
      pathsCompleted: 1,
      totalPaths: 6,
      linkedHabits: 2,
      color: "from-purple-500 to-pink-500"
    },
  ]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visions.map((vision) => (
          <VisionCard key={vision.id} vision={vision} />
        ))}
      </div>

      <CreateVisionDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onCreateVision={(vision) => {
          setVisions([...visions, vision]);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
};
