import { Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DailyCheckInCard = () => {
  const completed = false;

  return (
    <div className="glass p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 glass rounded-xl">
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Daily Check-in</h3>
            <p className="text-sm text-muted-foreground">
              {completed ? "Completed today ✨" : "How are you feeling today?"}
            </p>
          </div>
        </div>

        {completed ? (
          <CheckCircle className="w-8 h-8 text-success" />
        ) : (
          <Button className="gradient-primary border-0">
            Start Check-in
          </Button>
        )}
      </div>
    </div>
  );
};
