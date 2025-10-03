import { LayoutGrid, Target, CheckCircle2, Heart, Bot } from "lucide-react";

type Tab = "matrix" | "visions" | "habits" | "mindfulness" | "ai";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "matrix" as Tab, label: "Matrix", icon: LayoutGrid },
    { id: "visions" as Tab, label: "Visions", icon: Target },
    { id: "habits" as Tab, label: "Habits", icon: CheckCircle2 },
    { id: "mindfulness" as Tab, label: "Mindful", icon: Heart },
    { id: "ai" as Tab, label: "AI Coach", icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="container mx-auto px-2 max-w-7xl">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "animate-bounce" : ""}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
