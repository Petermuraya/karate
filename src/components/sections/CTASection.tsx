import { Button } from "@/components/ui/button";
import { SectionIndicator } from "@/components/SectionIndicator";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="relative px-6 py-32">
      <div className="container max-w-4xl">
        <SectionIndicator 
          number="04" 
          title="Call to Action" 
          className="mb-8" 
        />
        
        <div className="relative rounded-3xl bg-card border border-border p-12 md:p-16 text-center overflow-hidden">
          {/* Background glow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-40"
            style={{ background: "var(--gradient-glow)" }}
          />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to <span className="text-gradient">Start Building?</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Transform your ideas into structured layouts. Every wireframe is a foundation for something greater.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="glow" size="xl">
                Begin Now
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="wireframe" size="xl">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/30 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/30 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-xl" />
        </div>
      </div>
    </section>
  );
};
