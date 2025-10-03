import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateHabit: (habit: Habit) => void;
}

export const CreateHabitDialog = ({ open, onOpenChange, onCreateHabit }: CreateHabitDialogProps) => {
  const [name, setName] = useState("");
  const [linkedVision, setLinkedVision] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");

  const handleCreate = () => {
    if (!name || !linkedVision || !frequency || !timeOfDay) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      linkedVision,
      frequency,
      timeOfDay,
      streak: 0,
      longestStreak: 0,
      completionRate: 0
    };

    onCreateHabit(newHabit);
    toast.success("Habit created! Start your journey 🚀");
    
    // Reset form
    setName("");
    setLinkedVision("");
    setFrequency("");
    setTimeOfDay("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Create New Habit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning meditation"
              className="glass border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Link to Vision *</Label>
            <Select value={linkedVision} onValueChange={setLinkedVision}>
              <SelectTrigger className="glass border-border">
                <SelectValue placeholder="Select a vision" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                <SelectItem value="Master Spanish">Master Spanish</SelectItem>
                <SelectItem value="Peak Physical Health">Peak Physical Health</SelectItem>
                <SelectItem value="Launch Side Project">Launch Side Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency *</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="glass border-border">
                <SelectValue placeholder="How often?" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekdays">Weekdays</SelectItem>
                <SelectItem value="Weekends">Weekends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time of Day *</Label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger className="glass border-border">
                <SelectValue placeholder="When will you do this?" />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="flex-1 gradient-primary border-0">
            Create Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
