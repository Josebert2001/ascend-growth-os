import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LessonDetailProps {
  lesson: {
    id: string;
    title: string;
    category: string;
    content: string;
    read_time: number;
    key_takeaways: string[];
    completed: boolean;
  };
  onBack: () => void;
  onComplete: (lessonId: string) => void;
}

export const LessonDetail = ({ lesson, onBack, onComplete }: LessonDetailProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-card"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="border-border">
              {lesson.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {lesson.read_time} min read
            </span>
          </div>
          <h1 className="text-2xl font-bold gradient-text">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <Card className="p-6 glass border-border">
        <div className="prose prose-invert max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
            {lesson.content}
          </div>
        </div>
      </Card>

      {/* Key Takeaways */}
      {lesson.key_takeaways && lesson.key_takeaways.length > 0 && (
        <Card className="p-6 glass border-border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="gradient-text">Key Takeaways</span>
          </h2>
          <ul className="space-y-3">
            {lesson.key_takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-foreground/80">{takeaway}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Complete Button */}
      {!lesson.completed && (
        <Button 
          onClick={() => onComplete(lesson.id)}
          className="w-full gradient-primary border-0"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark as Complete
        </Button>
      )}
    </div>
  );
};
