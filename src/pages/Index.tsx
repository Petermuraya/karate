import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { InstructorSection } from "@/components/sections/InstructorSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { BeltProgressionSection } from "@/components/sections/BeltProgressionSection";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <InstructorSection />
        <PhilosophySection />
        <BeltProgressionSection />
        <ProgramsSection />
        <GallerySection />
        <ScheduleSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;