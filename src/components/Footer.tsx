import { Facebook, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-12 bg-secondary/30">
      <div className="container max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
                <span className="font-display text-xl text-primary-foreground">空</span>
              </div>
              <div>
                <span className="font-display text-xl tracking-wider">IRON FIST</span>
                <span className="text-muted-foreground text-xs ml-2">DOJO</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Traditional Shotokan karate training for all ages and skill levels. Building warriors since 1999.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg">PROGRAMS</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Kids Karate
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Adult Classes
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Private Lessons
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Competition Team
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-display text-lg">DOJO</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Instructors
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Schedule
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
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
