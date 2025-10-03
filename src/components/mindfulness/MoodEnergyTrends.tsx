import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CheckInData {
  date: string;
  mood: number;
  energy: number;
}

export const MoodEnergyTrends = () => {
  const [data, setData] = useState<CheckInData[]>([]);
  const [range, setRange] = useState<7 | 30>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendData();
  }, [range]);

  const fetchTrendData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - range);

      const { data: checkIns } = await supabase
        .from("check_ins")
        .select("date, mood, energy")
        .eq("user_id", user.id)
        .gte("date", daysAgo.toISOString().split('T')[0])
        .order("date", { ascending: true });

      const moodMap: { [key: string]: number } = {
        "Happy": 5,
        "Content": 4,
        "Neutral": 3,
        "Stressed": 2,
        "Sad": 1,
      };

      const formattedData = checkIns?.map(ci => ({
        date: new Date(ci.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: moodMap[ci.mood] || 3,
        energy: ci.energy,
      })) || [];

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching trend data:", error);
    } finally {
      setLoading(false);
    }
  };

  const avgMood = data.length > 0 
    ? (data.reduce((sum, d) => sum + d.mood, 0) / data.length).toFixed(1)
    : "0";
  
  const avgEnergy = data.length > 0
    ? (data.reduce((sum, d) => sum + d.energy, 0) / data.length).toFixed(1)
    : "0";

  if (loading) {
    return <Card className="p-6 animate-pulse h-64" />;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Mood & Energy Trends</h3>
          <p className="text-sm text-muted-foreground">
            Average mood: {avgMood}/5 • Average energy: {avgEnergy}/5
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={range === 7 ? "default" : "outline"}
            size="sm"
            onClick={() => setRange(7)}
          >
            7 Days
          </Button>
          <Button
            variant={range === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => setRange(30)}
          >
            30 Days
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No check-in data available for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 5]} 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ fill: "#ec4899", r: 4 }}
              name="Mood"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              name="Energy"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
