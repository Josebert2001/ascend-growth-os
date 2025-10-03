import { Target, TrendingUp, Link2 } from "lucide-react";
import { Vision } from "../Visions";

interface VisionCardProps {
  vision: Vision;
}

export const VisionCard = ({ vision }: VisionCardProps) => {
  return (
    <div className="glass p-6 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase">{vision.category}</span>
          </div>
          <h3 className="text-xl font-bold mb-2">{vision.title}</h3>
          <p className="text-sm text-muted-foreground">{vision.description}</p>
        </div>
        
        <div className="relative w-20 h-20 ml-4">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="url(#gradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 35}`}
              strokeDashoffset={`${2 * Math.PI * 35 * (1 - vision.progress / 100)}`}
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
            <span className="text-lg font-bold">{vision.progress}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>{vision.pathsCompleted}/{vision.totalPaths} paths</span>
        </div>
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          <span>{vision.linkedHabits} habits</span>
        </div>
      </div>
    </div>
  );
};
