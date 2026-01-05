import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container max-w-6xl px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-4 h-4 rounded border-2 border-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Wireframe</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Components
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Layouts
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Animations
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="default" size="sm">
              Get Started
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
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              Components
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              Layouts
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              Animations
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
              Docs
            </a>
            <div className="pt-4 border-t border-border space-y-3">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
