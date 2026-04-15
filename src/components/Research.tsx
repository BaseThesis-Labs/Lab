import { site } from '../content/site';
import { AsciiCanvas } from '../visuals/AsciiCanvas';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

export function Research() {
  return (
    <section id="research" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel
          index={site.research.label}
          title="Four programs. Long horizons."
          intro={site.research.intro}
        />

        <div className="mt-14 grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* ASCII art — left column */}
          <div className="relative min-h-[400px]">
            <div className="absolute inset-0 overflow-hidden">
              <AsciiCanvas />
            </div>
          </div>

          {/* Research cards — right column, 2x2 grid */}
          <div className="grid grid-cols-2 gap-px bg-ink-border">
            {site.research.areas.map((area, i) => (
              <RevealOnScroll key={area.id} delay={i * 0.05} className="bg-ink-bg">
                <article className="group relative h-full p-6 md:p-8">
                  <header className="flex items-center justify-between">
                    <span className="micro-label text-accent">{area.id}</span>
                    <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Active
                    </span>
                  </header>

                  <h3 className="mt-5 font-sans text-lg tracking-tight text-ink-text md:text-xl">
                    {area.title}
                  </h3>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink-dim">
                    {area.body}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-ink-border pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-micro text-ink-muted">
                      Program lead · TBA
                    </span>
                    <span className="text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                      →
                    </span>
                  </div>

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
