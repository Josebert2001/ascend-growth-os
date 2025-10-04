import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Target,
  ListTodo,
  BookOpen,
  Brain,
  Heart,
  TrendingUp,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Vision Board",
      description: "Set and track long-term life goals with visual progress tracking"
    },
    {
      icon: ListTodo,
      title: "Smart Habits",
      description: "Build lasting habits with customizable tracking and streaks"
    },
    {
      icon: Brain,
      title: "AI Coach",
      description: "Get personalized insights and guidance powered by AI"
    },
    {
      icon: Heart,
      title: "Mindfulness",
      description: "Daily check-ins to track mood, energy, and emotional wellbeing"
    },
    {
      icon: BookOpen,
      title: "Learning Library",
      description: "Curated content and lessons for continuous personal growth"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Visualize your progress with detailed charts and insights"
    }
  ];

  const benefits = [
    "Track multiple life visions simultaneously",
    "Build sustainable habits with science-backed methods",
    "Get AI-powered personalized recommendations",
    "Monitor your emotional and mental wellbeing",
    "Access curated growth content",
    "Visualize your progress over time"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center space-y-8 mb-16">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <img
              src="/Untitled design (2).png"
              alt="Ascend - Your Compass for Personal Growth"
              className="h-48 w-auto object-contain"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Your Personal Growth<br />Companion
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your life with Ascend - the all-in-one platform for setting visions,
              building habits, and achieving sustainable personal growth
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-14 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-semibold rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-lg text-muted-foreground">
              Six powerful tools integrated into one seamless experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-card p-8 md:p-12 rounded-3xl border border-border mb-16">
          <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Ascend?
            </h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive approach to personal development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center space-y-6 py-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of people using Ascend to achieve their goals and live their best life
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-16 px-12 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Today
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-sm text-muted-foreground border-t border-border mt-12">
          <p>Ascend - Your Compass for Personal Growth</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
