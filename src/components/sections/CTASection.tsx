import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export const CTASection = () => {
  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="container max-w-6xl">
        <div className="relative rounded-3xl bg-card border border-border overflow-hidden">
          {/* Background glow */}
          <div 
            className="absolute top-0 right-0 w-1/2 h-full opacity-30"
            style={{ background: "var(--gradient-glow)" }}
          />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-12 md:p-16">
            {/* Left - CTA */}
            <div className="space-y-6">
              <span className="text-primary font-medium text-sm uppercase tracking-widest">
                Begin Your Training
              </span>
              
              <h2 className="font-display text-5xl md:text-6xl">
                YOUR FIRST CLASS IS <span className="text-primary">FREE</span>
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Experience the Iron Fist difference. Join us for a free trial class and discover 
                why hundreds of students have chosen our dojo for their martial arts journey.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Button variant="glow" size="xl">
                  Claim Free Trial
                  <ArrowRight className="ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Call Us Now
                </Button>
              </div>
            </div>
            
            {/* Right - Contact Info */}
            <div className="space-y-6 lg:pl-12 lg:border-l border-border">
              <h3 className="font-display text-2xl">VISIT THE DOJO</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">
                      1234 Warrior Way, Suite 100<br />
                      Los Angeles, CA 90001
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-muted-foreground">(555) 123-4567</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-muted-foreground">info@ironfistdojo.com</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-2">Hours</div>
                <div className="text-sm">
                  <span className="text-foreground">Mon-Fri:</span> 4:00 PM - 9:00 PM<br />
                  <span className="text-foreground">Saturday:</span> 9:00 AM - 2:00 PM<br />
                  <span className="text-foreground">Sunday:</span> Closed
                </div>
              </div>
            </div>
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-xl" />
        </div>
      </div>
    </section>
  );
};
