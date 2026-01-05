import { cn } from "@/lib/utils";

interface WireframeBlockProps {
  label: string;
  className?: string;
  variant?: "default" | "accent" | "muted" | "card";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const WireframeBlock = ({ 
  label, 
  className, 
  variant = "default",
  children,
  style
}: WireframeBlockProps) => {
  const variants = {
    default: "border-border bg-secondary/30",
    accent: "border-primary/50 bg-primary/5",
    muted: "border-muted-foreground/20 bg-muted/20",
    card: "border-border bg-card card-shadow",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed p-6 transition-all duration-300 hover:border-primary/50",
        variants[variant],
        className
      )}
      style={style}
    >
      <span className="absolute -top-3 left-4 bg-background px-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
};
