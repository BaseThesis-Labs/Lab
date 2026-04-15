import type { ReactNode } from 'react';

interface Item {
  glyph: string;
  text: ReactNode;
  accent?: boolean;
}

const items: Item[] = [
  { glyph: '◆', text: 'Now Hiring — Researchers & Engineers · Bangalore, India', accent: true },
  { glyph: '⚡', text: 'Synth · Private Beta — AI employee for small businesses' },
  { glyph: '→', text: 'Investing in & transforming businesses with frontier AI' },
  { glyph: '◇', text: 'Active deal · Financial services (accounting & legal)' },
  { glyph: '✦', text: 'AI Research & Labs · Deploying intelligence end to end' },
  { glyph: '∮', text: 'Model · Identify → Invest → Transform → Scale' },
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
