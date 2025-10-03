import { Target, TrendingUp, Calendar, Link2 } from "lucide-react";

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
  const visions: Vision[] = [
    {
      id: "1",
      title: "Master Spanish",
      category: "Learning",
      progress: 45,
      pathsCompleted: 2,
      totalPaths: 5,
      linkedHabits: 2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "2",
      title: "Peak Physical Health",
      category: "Health",
      progress: 70,
      pathsCompleted: 3,
      totalPaths: 4,
      linkedHabits: 3,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "3",
      title: "Launch Side Project",
      category: "Career",
      progress: 30,
      pathsCompleted: 1,
      totalPaths: 6,
      linkedHabits: 2,
      color: "from-purple-500 to-pink-500"
    },
  ];

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Vision Progress</h3>
        <Target className="w-5 h-5 text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visions.map((vision) => (
          <div key={vision.id} className="glass p-4 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer">
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
