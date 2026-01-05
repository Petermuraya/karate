import { Button } from "@/components/ui/button";
import { SectionIndicator } from "@/components/SectionIndicator";
import { ArrowRight, Layers, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24">
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      <div className="container relative z-10 max-w-6xl">
        <SectionIndicator 
          number="01" 
          title="Hero Section" 
          className="mb-8 opacity-0 animate-fade-up" 
        />
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight opacity-0 animate-fade-up delay-100">
              Design with
              <span className="block text-gradient">Precision</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-md opacity-0 animate-fade-up delay-200">
              A wireframe system built for clarity. Every element positioned with intent, every animation crafted for impact.
            </p>
            
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-up delay-300">
              <Button variant="hero" size="xl">
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="outline" size="xl">
                View Docs
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border opacity-0 animate-fade-up delay-400">
              <div>
                <div className="text-3xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground font-mono">Sections</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground font-mono">Animations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground font-mono">Possibilities</div>
              </div>
            </div>
          </div>
          
          {/* Right - Visual wireframe preview */}
          <div className="relative opacity-0 animate-slide-right delay-300">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Floating elements */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-2xl bg-card border border-border card-shadow animate-float delay-100 flex items-center justify-center">
                <Layers className="w-8 h-8 text-primary" />
              </div>
              
              <div className="absolute bottom-0 left-0 w-40 h-24 rounded-2xl bg-primary/10 border border-primary/30 animate-float delay-300 flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 text-primary" />
                <span className="font-mono text-sm text-primary">Animate</span>
              </div>
              
              {/* Central wireframe */}
              <div className="absolute inset-12 rounded-3xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-secondary flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 mx-auto bg-muted rounded" />
                    <div className="h-2 w-16 mx-auto bg-muted/50 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary rounded-tl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary rounded-br-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
