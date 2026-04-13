import type { ComponentType } from 'react';
import { site } from '../content/site';
import { HelixViz } from '../visuals/HelixViz';
import { Lattice } from '../visuals/Lattice';
import { TokenStream } from '../visuals/TokenStream';
import { VizFrame } from '../visuals/VizFrame';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

const statusColor: Record<string, string> = {
  'Research Preview': 'text-accent border-accent/40',
  'Private Beta': 'text-ink-text border-ink-border',
  'In Development': 'text-ink-muted border-ink-border',
};

const VIZ: Record<string, { C: ComponentType<{ className?: string }>; tag: string; meta: string }> = {
  Synth: { C: HelixViz, tag: 'synth · engine', meta: 'flow-field' },
  KoeCode: { C: TokenStream, tag: 'koecode · voice', meta: 'intent → code' },
  MoltCode: { C: Lattice, tag: 'moltcode · xform', meta: 'repo-scale' },
};

export function Products() {
  return (
    <section id="products" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel index={site.products.label} title="Products from the lab floor." intro={site.products.intro} />

        <div className="space-y-px border-t border-ink-border bg-ink-border">
          {site.products.items.map((p, i) => {
            const viz = VIZ[p.name];
            const Viz = viz?.C;
            const reverse = i % 2 === 1;
            return (
              <RevealOnScroll key={p.codename} delay={i * 0.06}>
                <article
                  className={`group grid grid-cols-1 items-stretch gap-px bg-ink-border md:grid-cols-12`}
                >
                  <div
                    className={`bg-ink-bg p-8 md:col-span-7 md:p-12 ${reverse ? 'md:order-2' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="micro-label text-accent">{p.codename}</span>
                      <span className="h-px w-8 bg-ink-border" />
                      <span
                        className={`inline-flex items-center rounded-sm border bg-ink-surface/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-micro ${statusColor[p.status] ?? ''}`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h3 className="mt-6 font-sans text-4xl tracking-tight text-ink-text md:text-[56px] md:leading-[1.02]">
                      {p.name}
                    </h3>
                    <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-ink-dim md:text-lg">
                      {p.body}
                    </p>

                    <div className="mt-8 flex items-center gap-6">
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group/cta inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-micro text-ink-text transition-colors hover:text-accent"
                      >
                        <span>Visit {p.url.replace(/^https?:\/\//, '')}</span>
                        <span className="transition-transform group-hover/cta:translate-x-0.5">↗</span>
                      </a>
                      <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                        v{i + 1}.0 · {2026 - i}
                      </span>
                    </div>
                  </div>

                  {Viz && (
                    <div className={`bg-ink-bg p-4 md:col-span-5 md:p-6 ${reverse ? 'md:order-1' : ''}`}>
                      <VizFrame label={viz.tag} meta={viz.meta} className="h-full">
                        <div className="h-[220px] md:h-[280px]">
                          <Viz className="block h-full w-full" />
                        </div>
                      </VizFrame>
                    </div>
                  )}
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
