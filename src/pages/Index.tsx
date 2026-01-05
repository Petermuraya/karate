import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GridOverlay } from "@/components/GridOverlay";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { LayoutSection } from "@/components/sections/LayoutSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GridOverlay />
      <Header />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <LayoutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
