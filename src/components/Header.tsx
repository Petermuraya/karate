import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
              <span className="font-display text-xl text-primary-foreground">空</span>
            </div>
            <div>
              <span className="font-display text-xl tracking-wider">IRON FIST</span>
              <span className="hidden sm:inline text-muted-foreground text-xs ml-2">DOJO</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#programs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Programs
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#schedule" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Schedule
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Member Login
            </Button>
            <Button variant="default" size="sm">
              Free Trial
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container px-6 py-4 space-y-4">
            <a href="#programs" className="block text-sm text-muted-foreground hover:text-foreground">
              Programs
            </a>
            <a href="#about" className="block text-sm text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#schedule" className="block text-sm text-muted-foreground hover:text-foreground">
              Schedule
            </a>
            <a href="#contact" className="block text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
            <div className="pt-4 border-t border-border space-y-3">
              <Button variant="outline" className="w-full">Member Login</Button>
              <Button className="w-full">Free Trial</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
