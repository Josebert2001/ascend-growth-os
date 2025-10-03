import { Home, ListTodo, User, Plus } from "lucide-react";

type Tab = "matrix" | "visions" | "habits" | "mindfulness" | "ai";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const sideTabs = [
    { id: "matrix" as Tab, icon: Home },
    { id: "habits" as Tab, icon: ListTodo },
  ];

  const rightTabs = [
    { id: "visions" as Tab, icon: ListTodo },
    { id: "ai" as Tab, icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
      <div className="bg-card/80 backdrop-blur-xl rounded-full border border-border/50 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left Tabs */}
          <div className="flex items-center gap-4">
            {sideTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`p-3 rounded-full transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })}
          </div>

          {/* Center FAB */}
          <button
            onClick={() => onTabChange("mindfulness")}
            className={`p-4 rounded-full transition-all shadow-lg ${
              activeTab === "mindfulness"
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-primary text-primary-foreground hover:scale-105"
            }`}
          >
            <Plus className="w-7 h-7" />
          </button>

          {/* Right Tabs */}
          <div className="flex items-center gap-4">
            {rightTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`p-3 rounded-full transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
