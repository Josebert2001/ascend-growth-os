import { Heart, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckInFlow } from "./mindfulness/CheckInFlow";
import { MoodEnergyTrends } from "./mindfulness/MoodEnergyTrends";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Mindfulness = () => {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckInData();
  }, []);

  const fetchCheckInData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's check-in
      const { data: checkIn, error: checkInError } = await supabase
        .from("check_ins")
        .select("*")
        .eq("date", today)
        .maybeSingle();

      if (checkInError) throw checkInError;
      setTodayCheckIn(checkIn);

      // Get total check-ins
      const { count, error: countError } = await supabase
        .from("check_ins")
        .select("*", { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCheckIns(count || 0);

      // Calculate streak (simplified - would need more complex logic for actual streaks)
      const { data: recentCheckIns, error: streakError } = await supabase
        .from("check_ins")
        .select("date")
        .order("date", { ascending: false })
        .limit(30);

      if (streakError) throw streakError;
      
      let currentStreak = 0;
      if (recentCheckIns && recentCheckIns.length > 0) {
        const dates = recentCheckIns.map(c => c.date);
        const today = new Date().toISOString().split('T')[0];
        
        for (let i = 0; i < dates.length; i++) {
          const expected = new Date();
          expected.setDate(expected.getDate() - i);
          const expectedDate = expected.toISOString().split('T')[0];
          
          if (dates[i] === expectedDate) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      
      setStreak(currentStreak);
    } catch (error) {
      console.error("Error fetching check-in data:", error);
      toast.error("Failed to load check-in data");
    } finally {
      setLoading(false);
    }
  };

  if (showCheckIn) {
    return <CheckInFlow onComplete={() => {
      setShowCheckIn(false);
      fetchCheckInData();
    }} />;
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-48 bg-muted rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      "Sad": "😔",
      "Anxious": "😰",
      "Neutral": "😐",
      "Happy": "😊",
      "Joyful": "😄",
      "Excited": "🤩"
    };
    return moodMap[mood] || "😊";
  };

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
            {todayCheckIn ? "You've checked in today ✨" : "How are you feeling today?"}
          </p>
          
          {!todayCheckIn && (
            <Button 
              onClick={() => setShowCheckIn(true)} 
              className="gradient-primary border-0 px-8 py-6 text-lg"
            >
              Start Check-in
            </Button>
          )}
          
          {todayCheckIn && (
            <div className="glass p-4 rounded-xl inline-block">
              <p className="text-sm text-muted-foreground mb-2">Today's Summary</p>
              <p className="text-2xl mb-1">{getMoodEmoji(todayCheckIn.mood)}</p>
              <p className="text-sm">Energy: {todayCheckIn.energy}/5 • Feeling: {todayCheckIn.mood}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-xl text-center">
          <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">{totalCheckIns}</p>
          <p className="text-sm text-muted-foreground">Total Check-ins</p>
        </div>
        <div className="glass p-5 rounded-xl text-center">
          <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">{streak}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </div>
      </div>

      {/* Mood & Energy Trends */}
      <MoodEnergyTrends />
    </div>
  );
};
