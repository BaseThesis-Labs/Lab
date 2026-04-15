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

        <div className="mt-14 grid gap-0 md:grid-cols-12">
          {/* ASCII art — left column */}
          <RevealOnScroll className="md:col-span-6">
            <div className="aspect-[16/10] w-full md:aspect-auto md:h-full md:min-h-[540px]">
              <AsciiCanvas />
            </div>
          </RevealOnScroll>

          {/* Research cards — right column */}
          <div className="md:col-span-6">
            {site.research.areas.map((area, i) => (
              <RevealOnScroll key={area.id} delay={i * 0.05}>
                <article
                  className={`group relative px-0 py-8 md:px-10 md:py-10 ${
                    i < site.research.areas.length - 1 ? 'border-b border-ink-border' : ''
                  }`}
                >
                  <header className="flex items-center justify-between">
                    <span className="micro-label text-accent">{area.id}</span>
                    <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                      Active
                    </span>
                  </header>

                  <h3 className="mt-6 font-sans text-2xl tracking-tight text-ink-text md:text-3xl">
                    {area.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-ink-dim">
                    {area.body}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-ink-border pt-4">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
