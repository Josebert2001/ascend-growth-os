import { useState } from "react";
import { GrowthMatrix } from "@/components/GrowthMatrix";
import { Visions } from "@/components/Visions";
import { Habits } from "@/components/Habits";
import { Mindfulness } from "@/components/Mindfulness";
import { AICoach } from "@/components/AICoach";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";

type Tab = "matrix" | "visions" | "habits" | "mindfulness" | "ai";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("matrix");

  return (
    <div className="min-h-screen pb-24">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {activeTab === "matrix" && <GrowthMatrix />}
        {activeTab === "visions" && <Visions />}
        {activeTab === "habits" && <Habits />}
        {activeTab === "mindfulness" && <Mindfulness />}
        {activeTab === "ai" && <AICoach />}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
