import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-karate.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Karate martial artist in powerful stance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>
      
      <div className="container relative z-10 max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 opacity-0 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">New Classes Starting January 2026</span>
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-wide mb-6 opacity-0 animate-fade-up delay-100">
            MASTER THE
            <span className="block text-primary">ART OF</span>
            <span className="block">KARATE</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 opacity-0 animate-fade-up delay-200">
            Transform your body and mind through traditional martial arts training. 
            Build discipline, strength, and confidence at Iron Fist Dojo.
          </p>
          
          <div className="flex flex-wrap gap-4 opacity-0 animate-fade-up delay-300">
            <Button variant="hero" size="xl">
              Start Your Journey
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
              Watch Video
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 mt-12 border-t border-border opacity-0 animate-fade-up delay-400">
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Students Trained</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Black Belts</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up delay-500">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};
