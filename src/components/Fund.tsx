import { site } from '../content/site';
import { Button } from './Button';
import { CornerMarks } from './CornerMarks';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

export function Fund() {
  const s = site.fund;

  return (
    <section id="fund" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel index={s.label} title={s.headline} />

        {/* ── Pitch ── */}
        <div className="mt-10 grid gap-12 md:grid-cols-12">
          <RevealOnScroll className="md:col-span-7">
            <p className="font-sans text-xl leading-[1.55] text-ink-text md:text-2xl">
              {s.pitch}
            </p>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink-dim md:text-lg">
              {s.sub}
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="md:col-span-4 md:col-start-9">
            <div className="relative border-l border-accent pl-6">
              <span className="micro-label text-accent">{s.lab.title}</span>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink-dim">
                {s.lab.body}
              </p>
              <p className="mt-4 font-serif text-base italic leading-snug text-ink-text">
                "{s.lab.purpose}"
              </p>
            </div>
          </RevealOnScroll>
        </div>

        {/* ── Model: Identify → Invest → Transform → Scale ── */}
        <RevealOnScroll>
          <div className="mt-20">
            <div className="micro-label mb-8">{s.model.title}</div>
            <div className="relative grid grid-cols-1 gap-px border border-ink-border bg-ink-border sm:grid-cols-2 md:grid-cols-4">
              <CornerMarks />
              {s.model.steps.map((step, i) => (
                <div key={step.label} className="bg-ink-bg p-6 md:p-8">
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-3xl font-medium tracking-tight text-ink-text md:text-4xl">
                      0{i + 1}
                    </span>
                    <span className="micro-label text-accent">{step.label}</span>
                  </div>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-ink-dim">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 flex items-center gap-2">
              <div className="relative h-px flex-1 bg-ink-border">
                <div className="absolute inset-y-0 left-0 w-[25%] bg-accent" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-micro text-accent">
                identify → invest → transform → scale
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* ── Traction ── */}
        <RevealOnScroll>
          <div className="mt-20 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="micro-label mb-4">{s.traction.title}</div>
              <div className="space-y-4">
                {s.traction.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="mt-1 shrink-0 font-mono text-[11px] text-accent">→</span>
                    <p className="font-sans text-sm leading-relaxed text-ink-dim">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <div className="micro-label mb-4">Long-Term Vision</div>
              <p className="font-sans text-lg leading-[1.55] text-ink-text md:text-xl">
                {s.vision}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href={s.cta.href} variant="primary">
                  {s.cta.label}
                </Button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
