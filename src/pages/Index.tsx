import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProgramsSection />
        <AboutSection />
        <ScheduleSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
