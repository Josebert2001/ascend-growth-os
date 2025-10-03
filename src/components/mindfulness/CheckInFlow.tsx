import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckInFlowProps {
  onComplete: () => void;
}

export const CheckInFlow = ({ onComplete }: CheckInFlowProps) => {
  const [step, setStep] = useState(1);
  const [energy, setEnergy] = useState(3);
  const [mood, setMood] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [loading, setLoading] = useState(false);

  const moods = [
    { emoji: "😔", label: "Sad" },
    { emoji: "😰", label: "Anxious" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😊", label: "Happy" },
    { emoji: "😄", label: "Joyful" },
    { emoji: "🤩", label: "Excited" },
  ];

  const handleComplete = async () => {
    if (!gratitude.trim()) {
      toast.error("Please write something you're grateful for");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from("check_ins")
        .upsert({
          user_id: user.id,
          date: today,
          energy,
          mood,
          gratitude,
          challenge: null
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;

      toast.success("Check-in completed! 🎉", {
        description: "See you tomorrow for your next check-in"
      });
      onComplete();
    } catch (error) {
      console.error("Error saving check-in:", error);
      toast.error("Failed to save check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass p-8 rounded-2xl max-w-2xl w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= step ? "bg-gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Energy */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">How's your energy today?</h2>
              <p className="text-muted-foreground">Move the slider to reflect how you feel</p>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">
                {energy === 1 && "😴"}
                {energy === 2 && "😑"}
                {energy === 3 && "😊"}
                {energy === 4 && "😄"}
                {energy === 5 && "⚡"}
              </div>
              <p className="text-lg font-semibold">
                {energy === 1 && "Exhausted"}
                {energy === 2 && "Low"}
                {energy === 3 && "Moderate"}
                {energy === 4 && "Good"}
                {energy === 5 && "Energized"}
              </p>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, hsl(271 91% 65%), hsl(328 86% 70%))`
              }}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>
        )}

        {/* Step 2: Mood */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">What's your mood?</h2>
              <p className="text-muted-foreground">Choose the one that fits best</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`p-6 rounded-xl transition-all ${
                    mood === m.label
                      ? "glass scale-110 border-2 border-primary"
                      : "bg-muted/50 hover:scale-105"
                  }`}
                >
                  <div className="text-5xl mb-2">{m.emoji}</div>
                  <p className="text-sm font-medium">{m.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Gratitude */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-float" />
              <h2 className="text-3xl font-bold mb-2">What are you grateful for?</h2>
              <p className="text-muted-foreground">Even small things count</p>
            </div>

            <Textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="I'm grateful for..."
              className="glass border-border min-h-[150px] text-lg"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 2 && !mood}
              className="flex-1 gradient-primary border-0"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!gratitude.trim() || loading}
              className="flex-1 gradient-primary border-0"
            >
              {loading ? "Saving..." : "Complete Check-in"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
