import type { ComponentType } from 'react';
import { site } from '../content/site';
import { ArchitectureBlocks } from '../visuals/ArchitectureBlocks';
import { ContourMap } from '../visuals/ContourMap';
import { MoleculeGraph } from '../visuals/MoleculeGraph';
import { VizFrame } from '../visuals/VizFrame';
import { Waveform } from '../visuals/Waveform';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

const VIZ: Record<string, { C: ComponentType<{ className?: string }>; tag: string }> = {
  'R.01': { C: ContourMap, tag: 'topo.field' },
  'R.02': { C: ArchitectureBlocks, tag: 'arch.ssm+attn' },
  'R.03': { C: Waveform, tag: 'eeg.α-θ' },
  'R.04': { C: MoleculeGraph, tag: 'seq.lattice' },
};

export function Research() {
  return (
    <section id="research" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel index={site.research.label} title="Four programs. Long horizons." intro={site.research.intro} />

        <div className="grid gap-px border border-ink-border bg-ink-border md:grid-cols-2">
          {site.research.areas.map((area, i) => {
            const viz = VIZ[area.id];
            const Viz = viz?.C;
            return (
              <RevealOnScroll key={area.id} delay={i * 0.05} className="bg-ink-bg">
                <article className="group relative h-full p-8 md:p-10">
                  <header className="flex items-center justify-between">
                    <span className="micro-label text-accent">{area.id}</span>
                    <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Active
                    </span>
                  </header>

                  {Viz && (
                    <div className="mt-8 aspect-[16/9] w-full">
                      <VizFrame label={viz.tag} meta="live">
                        <div className="h-full w-full">
                          <Viz className="block h-full w-full" />
                        </div>
                      </VizFrame>
                    </div>
                  )}

                  <h3 className="mt-8 font-sans text-2xl tracking-tight text-ink-text md:text-3xl">
                    {area.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-ink-dim">
                    {area.body}
                  </p>
                  <div className="mt-10 flex items-center justify-between border-t border-ink-border pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Program lead · TBA
                    </span>
                    <span className="text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                      →
                    </span>
                  </div>
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
