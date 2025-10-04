import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, ListTodo, BookOpen, Brain, Heart, TrendingUp, CircleCheck as CheckCircle2, Sparkles } from "lucide-react";

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
      <div className="container mx-auto px-4 py-6 sm:py-10 md:py-16 max-w-7xl">
        <div className="text-center space-y-6 sm:space-y-8 md:space-y-12 mb-12 md:mb-16">
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-10 animate-fade-in">
            <img
              src="/Untitled design (2).png"
              alt="Ascend - Your Compass for Personal Growth"
              className="h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 15px 40px rgba(59, 130, 246, 0.4)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3)) contrast(1.1) saturate(1.1)',
                imageRendering: 'crisp-edges'
              }}
            />
          </div>

          {/* Tagline */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in px-2 sm:px-4" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight px-2">
              Your Personal Growth<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Companion
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-2">
              Transform your life with Ascend - the all-in-one platform for setting visions,
              building habits, and achieving sustainable personal growth
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 md:pt-8 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 text-base sm:text-lg md:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 text-base sm:text-lg md:text-xl font-semibold rounded-full hover:bg-muted"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-12 md:mb-16 scroll-mt-20">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Six powerful tools integrated into one seamless experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 px-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card p-5 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-card p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl border border-border mb-12 md:mb-16 mx-2">
          <div className="text-center mb-6 sm:mb-8">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary mx-auto mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
              Why Choose Ascend?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              A comprehensive approach to personal development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="flex items-start gap-3 sm:gap-4 animate-fade-in p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                <p className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center space-y-4 sm:space-y-6 py-8 sm:py-12 md:py-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Join thousands of people using Ascend to achieve their goals and live their best life
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-12 sm:h-14 md:h-16 lg:h-20 px-8 sm:px-10 md:px-12 lg:px-16 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Started Today
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground border-t border-border mt-8 sm:mt-12">
          <p>Ascend - Your Compass for Personal Growth</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
