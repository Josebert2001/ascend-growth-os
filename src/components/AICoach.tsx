import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hey there! I'm your AI growth coach. I'm here to help you build better habits, achieve your visions, and support you along the way. What's on your mind today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("help") || lowerMessage.includes("stuck")) {
      return "I hear you. Getting stuck is totally normal - it's part of the growth process. Let's break this down together. What specific habit or vision are you struggling with? Understanding the root cause is the first step.";
    }
    
    if (lowerMessage.includes("motivation") || lowerMessage.includes("motivated")) {
      return "Motivation comes and goes - that's why we build systems! Your streak on gratitude journaling shows you can be consistent. What if we linked this new habit to something you already do? Habit stacking works wonders.";
    }
    
    if (lowerMessage.includes("habit") && (lowerMessage.includes("skip") || lowerMessage.includes("miss"))) {
      return "Missing a habit doesn't erase your progress! You've built something real here. What got in the way today? Was it time, energy, or something else? Let's adjust your approach so it's easier tomorrow.";
    }
    
    if (lowerMessage.includes("streak")) {
      return "Streaks are powerful motivators! I see you're crushing it on meditation with a 7-day streak. That consistency is building real neural pathways. Keep it up, and remember: the goal isn't perfection, it's showing up.";
    }

    if (lowerMessage.includes("vision") || lowerMessage.includes("goal")) {
      return "Your visions are looking strong! I especially love your progress on 'Peak Physical Health' - 70% complete is amazing. Want to break down your next path into smaller, more manageable steps?";
    }
    
    return "That's a great question! Based on your data, I notice you're most consistent with morning habits. Your meditation and reading habits have excellent completion rates. Have you considered moving some evening habits to mornings where you tend to perform better?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 glass rounded-xl">
          <Bot className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <div>
          <h2 className="text-3xl font-bold gradient-text">AI Growth Coach</h2>
          <p className="text-muted-foreground">Your personal companion for growth</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="glass p-6 rounded-2xl min-h-[500px] max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "gradient-primary text-white"
                    : "glass"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="glass p-4 rounded-2xl flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about your growth journey..."
          className="flex-1 glass border-border"
        />
        <Button onClick={handleSend} disabled={!input.trim()} className="gradient-primary border-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2">
        {[
          "How can I stay motivated?",
          "Help me with my habits",
          "Review my progress",
          "I'm feeling stuck"
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            className="glass px-4 py-2 rounded-full text-sm hover:scale-105 transition-transform"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
