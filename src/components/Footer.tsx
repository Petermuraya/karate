export const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="container max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <div className="w-4 h-4 rounded border-2 border-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Wireframe</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Design systems built for modern web applications. From concept to code.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Product
            </h4>
            <nav className="space-y-3">
              <a href="#" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                Components
              </a>
              <a href="#" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                Templates
              </a>
              <a href="#" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Resources
            </h4>
            <nav className="space-y-3">
              <a href="#" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                Documentation
              </a>
              <a href="#" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                Changelog
              </a>
              <a href="#" className="block text-sm text-foreground/80 hover:text-primary transition-colors">
                Support
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Wireframe. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
