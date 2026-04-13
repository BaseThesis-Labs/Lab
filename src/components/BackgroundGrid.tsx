export function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.5]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(237,237,237,0.045) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        maskImage:
          'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)',
        WebkitMaskImage:
          'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)',
      }}
    />
  );
}
