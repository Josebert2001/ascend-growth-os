import { Target, TrendingUp, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Vision {
  id: string;
  title: string;
  category: string;
  progress: number;
  pathsCompleted: number;
  totalPaths: number;
  linkedHabits: number;
  color: string;
}

export const VisionProgress = () => {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisions();
  }, []);

  const fetchVisions = async () => {
    try {
      const { data, error } = await supabase
        .from("visions")
        .select(`
          id,
          title,
          category,
          color,
          paths (id, status),
          habits (id)
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      const transformedVisions: Vision[] = data?.map((v: any) => {
        const totalPaths = v.paths?.length || 0;
        const pathsCompleted = v.paths?.filter((p: any) => p.status === 'completed').length || 0;
        const progress = totalPaths > 0 ? Math.round((pathsCompleted / totalPaths) * 100) : 0;

        return {
          id: v.id,
          title: v.title,
          category: v.category,
          progress,
          pathsCompleted,
          totalPaths,
          linkedHabits: v.habits?.length || 0,
          color: v.color
        };
      }) || [];

      setVisions(transformedVisions);
    } catch (error) {
      console.error("Error fetching visions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (visions.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl text-center">
        <h3 className="text-xl font-semibold mb-2">No Visions Yet</h3>
        <p className="text-sm text-muted-foreground">Create your first vision to see progress here</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Vision Progress</h3>
        <Target className="w-5 h-5 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visions.map((vision) => (
          <div key={vision.id} className="glass p-4 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate(`/vision/${vision.id}`)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{vision.title}</h4>
                <p className="text-xs text-muted-foreground">{vision.category}</p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - vision.progress / 100)}`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className="text-primary" stopColor="currentColor" />
                      <stop offset="100%" className="text-accent" stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{vision.progress}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{vision.pathsCompleted}/{vision.totalPaths} paths</span>
              </div>
              <div className="flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                <span>{vision.linkedHabits} habits</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
