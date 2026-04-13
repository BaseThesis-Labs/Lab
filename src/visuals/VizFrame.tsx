import type { ReactNode } from 'react';

interface Props {
  label: string;
  meta?: string;
  children: ReactNode;
  className?: string;
}

export function VizFrame({ label, meta, children, className }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-ink-border bg-ink-surface/40 ${className ?? ''}`}
    >
      <div className="flex items-center justify-between border-b border-ink-border px-3 py-2 font-mono text-[10px] uppercase tracking-micro text-ink-muted">
        <span className="flex items-center gap-3">
          <span className="text-ink-dim">[</span>
          <span>{label}</span>
        </span>
        {meta && <span className="text-ink-muted">{meta}</span>}
      </div>
      {children}
    </div>
  );
}
