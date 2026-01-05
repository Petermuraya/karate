export const GridOverlay = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
};
