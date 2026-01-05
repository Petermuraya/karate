import { SectionIndicator } from "@/components/SectionIndicator";
import { AnimatedLine } from "@/components/AnimatedLine";

export const LayoutSection = () => {
  return (
    <section className="relative px-6 py-32">
      <div className="container max-w-6xl">
        <SectionIndicator 
          number="03" 
          title="Layout Showcase" 
          className="mb-8" 
        />
        
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Large card */}
            <div className="relative rounded-2xl bg-card border border-border p-8 card-shadow overflow-hidden group">
              <div className="absolute top-0 left-0 w-full">
                <AnimatedLine delay="500ms" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-24 bg-muted/50 rounded" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-3 w-full bg-muted/30 rounded" />
                  <div className="h-3 w-4/5 bg-muted/30 rounded" />
                  <div className="h-3 w-3/4 bg-muted/30 rounded" />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <div className="h-10 w-28 rounded-lg bg-primary/20 border border-primary/30" />
                  <div className="h-10 w-28 rounded-lg bg-muted/50" />
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Two column cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-secondary/50 border border-border p-6 space-y-4">
                <div className="w-full h-32 rounded-lg bg-muted/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted/30 rounded" />
                </div>
              </div>
              
              <div className="rounded-xl bg-secondary/50 border border-border p-6 space-y-4">
                <div className="w-full h-32 rounded-lg bg-muted/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted/30 rounded" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats card */}
            <div className="rounded-xl bg-card border border-border p-6 space-y-6">
              <div className="h-4 w-20 bg-muted rounded" />
              
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10" />
                    <div className="h-3 w-16 bg-muted/50 rounded" />
                  </div>
                  <div className="h-3 w-8 bg-primary/30 rounded" />
                </div>
              ))}
            </div>
            
            {/* Quick links */}
            <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-6 space-y-4">
              <div className="h-3 w-16 bg-muted rounded" />
              
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-muted/20 border border-border" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
