import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, BookOpen, Target, Heart, Zap, Sparkles } from "lucide-react";

interface HabitTemplate {
  id: string;
  name: string;
  category: "health" | "learning" | "productivity" | "wellness";
  frequency: string;
  timeOfDay: string;
  difficulty: "easy" | "medium" | "hard";
  icon: string;
  duration?: string;
}

const templates: HabitTemplate[] = [
  // Health & Fitness
  { id: "1", name: "Morning Workout", category: "health", frequency: "Daily", timeOfDay: "Morning", difficulty: "medium", icon: "dumbbell", duration: "20 min" },
  { id: "2", name: "Evening Walk", category: "health", frequency: "Daily", timeOfDay: "Evening", difficulty: "easy", icon: "footprints", duration: "15 min" },
  { id: "3", name: "Drink Water", category: "health", frequency: "Daily", timeOfDay: "Morning", difficulty: "easy", icon: "droplet", duration: "8 glasses" },
  { id: "4", name: "8 Hours Sleep", category: "health", frequency: "Daily", timeOfDay: "Night", difficulty: "medium", icon: "moon" },
  { id: "5", name: "Stretch Routine", category: "health", frequency: "Daily", timeOfDay: "Morning", difficulty: "easy", icon: "move", duration: "10 min" },
  
  // Learning
  { id: "6", name: "Read 20 Pages", category: "learning", frequency: "Daily", timeOfDay: "Evening", difficulty: "easy", icon: "book-open" },
  { id: "7", name: "Study Language", category: "learning", frequency: "Daily", timeOfDay: "Morning", difficulty: "medium", icon: "languages", duration: "15 min" },
  { id: "8", name: "Watch Educational Video", category: "learning", frequency: "Daily", timeOfDay: "Afternoon", difficulty: "easy", icon: "video" },
  { id: "9", name: "Listen to Podcast", category: "learning", frequency: "3x/week", timeOfDay: "Afternoon", difficulty: "easy", icon: "headphones" },
  { id: "10", name: "Take Online Course", category: "learning", frequency: "3x/week", timeOfDay: "Evening", difficulty: "hard", icon: "graduation-cap", duration: "30 min" },
  
  // Productivity
  { id: "11", name: "Morning Journal", category: "productivity", frequency: "Daily", timeOfDay: "Morning", difficulty: "easy", icon: "pen-tool", duration: "10 min" },
  { id: "12", name: "Plan Tomorrow", category: "productivity", frequency: "Daily", timeOfDay: "Evening", difficulty: "easy", icon: "calendar", duration: "5 min" },
  { id: "13", name: "Deep Work Block", category: "productivity", frequency: "Daily", timeOfDay: "Morning", difficulty: "hard", icon: "focus", duration: "90 min" },
  { id: "14", name: "Review Goals Weekly", category: "productivity", frequency: "Weekly", timeOfDay: "Afternoon", difficulty: "medium", icon: "target" },
  { id: "15", name: "Inbox Zero", category: "productivity", frequency: "Daily", timeOfDay: "Morning", difficulty: "medium", icon: "inbox" },
  
  // Wellness
  { id: "16", name: "Gratitude Practice", category: "wellness", frequency: "Daily", timeOfDay: "Evening", difficulty: "easy", icon: "heart", duration: "5 min" },
  { id: "17", name: "Meditation", category: "wellness", frequency: "Daily", timeOfDay: "Morning", difficulty: "medium", icon: "brain", duration: "10 min" },
  { id: "18", name: "Call a Friend", category: "wellness", frequency: "Weekly", timeOfDay: "Afternoon", difficulty: "easy", icon: "phone" },
  { id: "19", name: "Nature Time", category: "wellness", frequency: "3x/week", timeOfDay: "Afternoon", difficulty: "easy", icon: "tree-pine", duration: "20 min" },
  { id: "20", name: "Digital Detox Hour", category: "wellness", frequency: "Daily", timeOfDay: "Evening", difficulty: "medium", icon: "smartphone-off" },
];

const categoryConfig = {
  health: { icon: Dumbbell, color: "text-green-400", label: "Health & Fitness" },
  learning: { icon: BookOpen, color: "text-blue-400", label: "Learning" },
  productivity: { icon: Target, color: "text-purple-400", label: "Productivity" },
  wellness: { icon: Heart, color: "text-pink-400", label: "Wellness" },
};

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-green-500/20 text-green-400" },
  medium: { label: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
  hard: { label: "Hard", color: "bg-red-500/20 text-red-400" },
};

interface HabitTemplatesLibraryProps {
  onSelectTemplate: (template: HabitTemplate) => void;
}

export const HabitTemplatesLibrary = ({ onSelectTemplate }: HabitTemplatesLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose from Templates</h3>
        <p className="text-sm text-muted-foreground">Start with a proven habit and customize it to your needs</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          All Templates
        </Button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {config.label}
            </Button>
          );
        })}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTemplates.map((template) => {
            const categoryInfo = categoryConfig[template.category];
            const CategoryIcon = categoryInfo.icon;
            const difficultyInfo = difficultyConfig[template.difficulty];

            return (
              <Card
                key={template.id}
                className="p-4 hover:bg-accent/50 cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-accent ${categoryInfo.color}`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      {template.duration && (
                        <p className="text-xs text-muted-foreground">{template.duration}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {template.frequency}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.timeOfDay}
                  </Badge>
                  <Badge className={`text-xs ${difficultyInfo.color}`}>
                    {difficultyInfo.label}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
