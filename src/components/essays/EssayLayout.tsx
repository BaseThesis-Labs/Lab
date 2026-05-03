import { ReactNode } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { Footer } from '../Footer';
import { Nav } from '../Nav';

type EssayMeta = {
  index: string;
  title: string;
  italicized?: string[];
  authors: string;
  date: string;
  reading: string;
  cover: string;
  coverAlt?: string;
  epigraph?: { quote: string; cite: string };
};

export function EssayLayout({
  meta,
  children,
}: {
  meta: EssayMeta;
  children: ReactNode;
}) {
  const titleParts = meta.italicized
    ? meta.title.split(new RegExp(`(${meta.italicized.join('|')})`, 'gi'))
    : [meta.title];

  return (
    <div className="relative">
      <Nav />
      <main className="relative z-10 pt-28 pb-24">
        <article className="container-x max-w-[760px]">
          <header>
            <div className="micro-label">
              Essay · {meta.index} · {meta.reading}
            </div>
            <h1 className="mt-6 font-sans text-[44px] font-medium leading-[1.05] tracking-tight text-ink-text md:text-[58px]">
              {titleParts.map((chunk, i) =>
                meta.italicized?.some(
                  (w) => w.toLowerCase() === chunk.toLowerCase(),
                ) ? (
                  <em
                    key={i}
                    className="font-serif italic font-normal text-accent"
                  >
                    {chunk}
                  </em>
                ) : (
                  <span key={i}>{chunk}</span>
                ),
              )}
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-micro text-ink-muted">
              <span className="text-ink-text">{meta.authors}</span>
              <span className="text-ink-border">/</span>
              <span>{meta.date}</span>
            </div>

            {meta.epigraph && (
              <blockquote className="mt-10 border-l border-accent/40 pl-5 font-serif text-[16px] italic leading-[1.65] text-ink-dim">
                {meta.epigraph.quote}
                <span className="ml-2 not-italic font-sans text-[13px] text-ink-muted">
                  — {meta.epigraph.cite}
                </span>
              </blockquote>
            )}

            <figure className="mt-12 overflow-hidden border border-ink-border">
              <img
                src={meta.cover}
                alt={meta.coverAlt ?? ''}
                className="block h-auto w-full"
                loading="eager"
              />
            </figure>
          </header>

          <div className="essay-prose mt-16 font-serif text-[17.5px] leading-[1.78] text-ink-dim">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────────── reusable primitives ─────────────────── */

export function P({
  children,
  dropCap,
}: {
  children: ReactNode;
  dropCap?: boolean;
}) {
  return <p className={dropCap ? 'drop-cap' : undefined}>{children}</p>;
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-16 mb-2 font-sans text-[22px] font-medium tracking-tight text-ink-text md:text-[24px]">
      {children}
      <span className="mt-3 block h-px w-10 bg-accent/60" />
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-10 font-sans text-[16.5px] font-medium text-ink-text">
      {children}
    </h3>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="not-italic text-ink-text">{children}</em>;
}

export function ItalicEm({ children }: { children: ReactNode }) {
  return (
    <em className="font-serif italic text-ink-text">{children}</em>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-ink-text">{children}</span>;
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <span className="font-serif italic text-ink-dim/95">{children}</span>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-sm border border-ink-border bg-ink-surface px-1.5 py-0.5 font-mono text-[12.5px] text-ink-text">
      {children}
    </code>
  );
}

export function Aside({ children }: { children: ReactNode }) {
  return (
    <p className="mt-8 border-l border-accent/40 pl-5 font-serif text-[15px] italic leading-[1.65] text-ink-muted">
      {children}
    </p>
  );
}

export function Equation({
  math,
  number,
}: {
  math: string;
  number?: string;
}) {
  return (
    <div className="my-8 flex items-center gap-6">
      <div className="flex-1 overflow-x-auto rounded-sm border border-ink-border bg-ink-surface/40 px-6 py-5">
        <BlockMath math={math} />
      </div>
      {number && (
        <span className="shrink-0 font-mono text-[12px] uppercase tracking-micro text-ink-muted">
          ({number})
        </span>
      )}
    </div>
  );
}

export function M({ children }: { children: string }) {
  return <InlineMath math={children} />;
}

export function Figure({
  src,
  alt,
  number,
  caption,
}: {
  src: string;
  alt?: string;
  number: string;
  caption: ReactNode;
}) {
  return (
    <figure className="my-12">
      <div className="overflow-hidden border border-ink-border bg-[#F4EFE6]">
        <img
          src={src}
          alt={alt ?? `Figure ${number}`}
          className="block h-auto w-full"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-4 font-mono text-[12px] leading-[1.6] text-ink-muted">
        <span className="text-accent">Fig. {number}.</span>{' '}
        <span className="font-sans text-[13px] text-ink-dim">{caption}</span>
      </figcaption>
    </figure>
  );
}

export function ChartFigure({
  number,
  caption,
  children,
  ariaLabel,
}: {
  number: string;
  caption: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <figure className="my-16">
      <div
        role="img"
        aria-label={ariaLabel}
        className="overflow-hidden rounded-sm border border-ink-border bg-ink-surface/40 px-4 py-8 md:-mx-6 md:px-10 md:py-10 lg:-mx-24 xl:-mx-40"
      >
        {children}
      </div>
      <figcaption className="mt-4 font-mono text-[12px] leading-[1.6] text-ink-muted">
        <span className="text-accent">Fig. {number}.</span>{' '}
        <span className="font-sans text-[13px] text-ink-dim">{caption}</span>
      </figcaption>
    </figure>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-10 rounded-sm border border-l-2 border-ink-border border-l-accent bg-ink-surface/60 p-6 font-serif text-[15.5px] leading-[1.7] text-ink-dim">
      {children}
    </div>
  );
}

export function ReferenceGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <div className="micro-label text-accent">{title}</div>
      <ul className="mt-4 space-y-2 font-sans text-[14px] leading-[1.65] text-ink-dim">
        {children}
      </ul>
    </div>
  );
}

export function Ref({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function EditorsNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-20 border-t border-ink-border pt-10">
      <div className="micro-label">Editor's Note</div>
      <p className="mt-4 font-serif text-[14.5px] italic leading-[1.7] text-ink-muted">
        {children}
      </p>
    </div>
  );
}
