import { Target, Flame, TrendingUp, Calendar } from "lucide-react";

export const QuickStats = () => {
  const stats = [
    { label: "Active Visions", value: "3", icon: Target, color: "text-purple-400" },
    { label: "Longest Streak", value: "15", icon: Flame, color: "text-orange-400" },
    { label: "Week Completion", value: "85%", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Check-ins", value: "42", icon: Calendar, color: "text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass p-4 rounded-xl text-center hover:scale-[1.05] transition-transform">
            <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};
