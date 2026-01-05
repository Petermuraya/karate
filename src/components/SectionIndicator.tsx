import { cn } from "@/lib/utils";

interface SectionIndicatorProps {
  number: string;
  title: string;
  className?: string;
}

export const SectionIndicator = ({ number, title, className }: SectionIndicatorProps) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="font-mono text-sm text-primary">{number}</span>
      <div className="h-px w-12 bg-primary/50" />
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </span>
    </div>
  );
};
