import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HabitTemplatesLibrary } from "./HabitTemplatesLibrary";

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateHabit: () => void;
}

export const CreateHabitDialog = ({ open, onOpenChange, onCreateHabit }: CreateHabitDialogProps) => {
  const [name, setName] = useState("");
  const [linkedVisionId, setLinkedVisionId] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [visions, setVisions] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    if (open) {
      fetchVisions();
    }
  }, [open]);

  const fetchVisions = async () => {
    try {
      const { data, error } = await supabase
        .from("visions")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVisions(data || []);
    } catch (error) {
      console.error("Error fetching visions:", error);
    }
  };

  const handleCreate = async () => {
    if (!name || !frequency || !timeOfDay) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("habits")
        .insert({
          user_id: user.id,
          name,
          linked_vision_id: linkedVisionId || null,
          frequency,
          time_of_day: timeOfDay,
          streak: 0,
          longest_streak: 0
        });

      if (error) throw error;

      toast.success("Habit created! Start your journey 🚀");
      onCreateHabit();
      onOpenChange(false);
      
      // Reset form
      setName("");
      setLinkedVisionId("");
      setFrequency("");
      setTimeOfDay("");
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: any) => {
    setName(template.name);
    setFrequency(template.frequency);
    setTimeOfDay(template.timeOfDay);
    // Auto-switch to custom tab after selection for editing
    setTimeout(() => {
      const customTab = document.querySelector('[value="custom"]') as HTMLElement;
      customTab?.click();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Create New Habit</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <HabitTemplatesLibrary onSelectTemplate={handleTemplateSelect} />
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 py-4">
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
              <Label htmlFor="vision">Link to Vision (optional)</Label>
              <Select value={linkedVisionId} onValueChange={setLinkedVisionId}>
                <SelectTrigger className="glass border-border">
                  <SelectValue placeholder="Select a vision" />
                </SelectTrigger>
                <SelectContent className="glass border-border">
                  {visions.map((vision) => (
                    <SelectItem key={vision.id} value={vision.id}>
                      {vision.title}
                    </SelectItem>
                  ))}
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

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="flex-1 gradient-primary border-0" disabled={loading}>
                {loading ? "Creating..." : "Create Habit"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
