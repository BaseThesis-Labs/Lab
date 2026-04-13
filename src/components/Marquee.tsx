import type { ReactNode } from 'react';

interface Item {
  glyph: string;
  text: ReactNode;
  accent?: boolean;
}

const items: Item[] = [
  { glyph: '◆', text: 'COHORT 02 — Applications open · Deadline 15 June 2026', accent: true },
  { glyph: '∮', text: 'Preprint · Meridian-7B: Post-Transformer Reasoning at Scale' },
  { glyph: '→', text: 'Hiring · Research Engineer (Systems) · Wet-Lab Lead · Fellow, Neural Interfaces' },
  { glyph: '⚡', text: 'Helix · Research Preview — request access' },
  { glyph: '◇', text: 'Residency 02 · 12 weeks · San Francisco' },
  { glyph: '✦', text: 'New paper · World Models as an Economic Training Substrate' },
];

function Row({ ariaHide }: { ariaHide?: boolean }) {
  return (
    <div
      aria-hidden={ariaHide}
      className="flex shrink-0 items-center gap-10 pr-10 font-mono text-[11px] uppercase tracking-micro text-ink-dim"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-3">
          <span className={item.accent ? 'text-accent' : 'text-ink-muted'}>{item.glyph}</span>
          <span className={item.accent ? 'text-ink-text' : 'text-ink-dim'}>{item.text}</span>
          <span className="mx-6 text-ink-border">/</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="Lab signal"
      className="relative z-10 overflow-hidden border-y border-ink-border bg-ink-bg/60 py-3 backdrop-blur"
    >
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex animate-marquee whitespace-nowrap will-change-transform">
          <Row />
          <Row ariaHide />
          <Row ariaHide />
        </div>
      </div>
    </section>
  );
}
