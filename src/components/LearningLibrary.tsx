import { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LessonDetail } from "./learning/LessonDetail";

interface Lesson {
  id: string;
  title: string;
  category: string;
  content: string;
  read_time: number;
  key_takeaways: string[];
  completed: boolean;
}

export const LearningLibrary = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("created_at", { ascending: false });

      if (lessonsError) throw lessonsError;

      const { data: completedData, error: completedError } = await supabase
        .from("user_lessons")
        .select("lesson_id")
        .eq("user_id", user.id);

      if (completedError) throw completedError;

      const completedIds = new Set(completedData?.map(c => c.lesson_id) || []);

      setLessons(lessonsData?.map(lesson => ({
        ...lesson,
        completed: completedIds.has(lesson.id)
      })) || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async (lessonId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_lessons")
        .insert({ user_id: user.id, lesson_id: lessonId });

      if (error) throw error;

      setLessons(prev => prev.map(l => 
        l.id === lessonId ? { ...l, completed: true } : l
      ));
      toast.success("Lesson completed! 🎉");
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  const categories = ["all", ...new Set(lessons.map(l => l.category))];
  const filteredLessons = filter === "all" 
    ? lessons 
    : lessons.filter(l => l.category === filter);

  const stats = {
    total: lessons.length,
    completed: lessons.filter(l => l.completed).length
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 glass border-border">
            <div className="h-20 bg-muted/20 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <LessonDetail 
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onComplete={markAsComplete}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 gradient-text">Learning Library</h1>
        <p className="text-muted-foreground">
          {stats.completed}/{stats.total} lessons completed
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Badge
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            className={`cursor-pointer capitalize whitespace-nowrap ${
              filter === cat ? "gradient-primary border-0" : "border-border"
            }`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="space-y-3">
        {filteredLessons.map(lesson => (
          <Card 
            key={lesson.id}
            className="p-5 glass border-border hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => setSelectedLesson(lesson)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{lesson.title}</h3>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="border-border">
                    {lesson.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.read_time} min
                  </span>
                </div>
              </div>
              {lesson.completed && (
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
