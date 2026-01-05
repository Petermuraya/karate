import { WireframeBlock } from "@/components/WireframeBlock";
import { SectionIndicator } from "@/components/SectionIndicator";
import { Grid, Box, Sparkles, MousePointer2 } from "lucide-react";

const features = [
  {
    icon: Grid,
    title: "Grid System",
    description: "12-column responsive grid with custom breakpoints",
    variant: "accent" as const,
  },
  {
    icon: Box,
    title: "Component Library",
    description: "Pre-built blocks for rapid prototyping",
    variant: "default" as const,
  },
  {
    icon: Sparkles,
    title: "Animation Presets",
    description: "Smooth transitions and micro-interactions",
    variant: "card" as const,
  },
  {
    icon: MousePointer2,
    title: "Interactive States",
    description: "Hover, focus, and active state previews",
    variant: "muted" as const,
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative px-6 py-32 overflow-hidden">
      <div className="container max-w-6xl">
        <SectionIndicator 
          number="02" 
          title="Features Grid" 
          className="mb-8" 
        />
        
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for <span className="text-gradient">Builders</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every component designed with scalability in mind. From wireframe to production-ready.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <WireframeBlock
              key={feature.title}
              label={`Feature ${index + 1}`}
              variant={feature.variant}
              className="group cursor-pointer opacity-0 animate-fade-up"
              style={{ animationDelay: `${index * 100 + 200}ms`, animationFillMode: 'forwards' } as React.CSSProperties}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                  <feature.icon className="w-6 h-6 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </WireframeBlock>
          ))}
        </div>
      </div>
    </section>
  );
};
