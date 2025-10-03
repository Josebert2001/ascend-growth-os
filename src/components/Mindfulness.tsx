import { Heart, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckInFlow } from "./mindfulness/CheckInFlow";

export const Mindfulness = () => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);

  if (showCheckIn) {
    return <CheckInFlow onComplete={() => {
      setCompletedToday(true);
      setShowCheckIn(false);
    }} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold gradient-text">Mindfulness</h2>
        <p className="text-muted-foreground mt-1">Reflect, track your mood, and stay present</p>
      </div>

      {/* Daily Check-in Section */}
      <div className="glass p-8 rounded-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-3xl" />
        
        <div className="relative">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-float" />
          <h3 className="text-2xl font-bold mb-2">Daily Check-in</h3>
          <p className="text-muted-foreground mb-6">
            {completedToday ? "You've checked in today ✨" : "How are you feeling today?"}
          </p>
          
          {!completedToday && (
            <Button 
              onClick={() => setShowCheckIn(true)} 
              className="gradient-primary border-0 px-8 py-6 text-lg"
            >
              Start Check-in
            </Button>
          )}
          
          {completedToday && (
            <div className="glass p-4 rounded-xl inline-block">
              <p className="text-sm text-muted-foreground mb-2">Today's Summary</p>
              <p className="text-2xl mb-1">😊</p>
              <p className="text-sm">Energy: 4/5 • Feeling: Happy</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-xl text-center">
          <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">42</p>
          <p className="text-sm text-muted-foreground">Total Check-ins</p>
        </div>
        <div className="glass p-5 rounded-xl text-center">
          <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">7</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>
      </div>

      {/* Mood Trends Placeholder */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Mood & Energy Trends</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          Complete more check-ins to see your patterns
        </p>
      </div>
    </div>
  );
};
