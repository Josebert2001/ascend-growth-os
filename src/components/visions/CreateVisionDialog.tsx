import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vision } from "../Visions";
import { toast } from "sonner";

interface CreateVisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVision: (vision: Vision) => void;
}

export const CreateVisionDialog = ({ open, onOpenChange, onCreateVision }: CreateVisionDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleCreate = () => {
    if (!title || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newVision: Vision = {
      id: Date.now().toString(),
      title,
      description,
      category,
      progress: 0,
      pathsCompleted: 0,
      totalPaths: 0,
      linkedHabits: 0,
      color: "from-purple-500 to-pink-500"
    };

    onCreateVision(newVision);
    toast.success("Vision created! 🎯");
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Create New Vision</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Vision Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master Spanish"
              className="glass border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="glass border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Career">Career</SelectItem>
                <SelectItem value="Relationships">Relationships</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this vision mean to you?"
              className="glass border-border min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="flex-1 gradient-primary border-0">
            Create Vision
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
