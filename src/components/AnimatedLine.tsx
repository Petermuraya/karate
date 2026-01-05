import { cn } from "@/lib/utils";

interface AnimatedLineProps {
  direction?: "horizontal" | "vertical";
  className?: string;
  delay?: string;
}

export const AnimatedLine = ({ 
  direction = "horizontal", 
  className,
  delay = "0ms"
}: AnimatedLineProps) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-r from-primary via-primary to-transparent",
        direction === "horizontal" ? "h-px animate-draw-line" : "w-px h-full",
        className
      )}
      style={{ animationDelay: delay }}
    />
  );
};
