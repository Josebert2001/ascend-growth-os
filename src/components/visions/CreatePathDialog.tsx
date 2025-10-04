import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreatePathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visionId: string;
  onPathCreated: () => void;
  existingPaths: Array<{ id: string; name: string }>;
}

export const CreatePathDialog = ({ 
  open, 
  onOpenChange, 
  visionId, 
  onPathCreated,
  existingPaths 
}: CreatePathDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a path name");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("paths")
        .insert({
          vision_id: visionId,
          name,
          description: description || null,
          deadline: deadline || null,
          status: "not-started",
          order_index: existingPaths.length
        });

      if (error) throw error;

      toast.success("Path created successfully! 🎯");
      onPathCreated();
      onOpenChange(false);
      
      // Reset form
      setName("");
      setDescription("");
      setDeadline("");
    } catch (error) {
      console.error("Error creating path:", error);
      toast.error("Failed to create path");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Create New Path</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Path Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Learn React fundamentals"
              className="glass border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this path involve?"
              className="glass border-border"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="glass border-border"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1" 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              className="flex-1 gradient-primary border-0" 
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Path"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
