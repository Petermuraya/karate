import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border section-padding bg-background pb-32 md:pb-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary flex items-center justify-center">
                <span className="font-display text-2xl text-primary-foreground font-bold">鉄</span>
              </div>
              <div>
                <span className="font-display text-xl tracking-widest">IRON FIST</span>
                <span className="block text-xs text-muted-foreground tracking-[0.3em]">DOJO</span>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-sm">
              Traditional Shotokan karate training for all ages. Forging discipline and building champions since 1999.
            </p>
            
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-wider">PROGRAMS</h4>
            <nav className="space-y-3">
              {["Kids Karate", "Teen Training", "Adult Classes", "Competition Team", "Private Lessons"].map((link) => (
                <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-wider">DOJO</h4>
            <nav className="space-y-3">
              {["About Us", "Instructors", "Schedule", "Gallery", "Contact", "FAQs"].map((link) => (
                <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Iron Fist Dojo. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};