interface Props {
  className?: string;
}

function Corner({ className = '' }: Props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={`absolute text-ink-border ${className}`}
    >
      <path d="M0 5V0h5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function CornerMarks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-2 hidden md:block">
      <Corner className="left-0 top-0" />
      <Corner className="right-0 top-0 rotate-90" />
      <Corner className="bottom-0 left-0 -rotate-90" />
      <Corner className="bottom-0 right-0 rotate-180" />
    </div>
  );
}
