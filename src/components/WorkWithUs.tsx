import { site } from '../content/site';
import { TorusShader } from '../visuals/TorusShader';
import { Button } from './Button';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

export function WorkWithUs() {
  const s = site.workWithUs;

  return (
    <section id="join" className="relative overflow-hidden py-28 md:py-36">
      {/* Shader as section background — same pattern as Hero */}
      <div className="absolute inset-0">
        <TorusShader />
        {/* Fade left so text column sits on clean bg — same as Hero */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-bg via-ink-bg/80 to-transparent" />
        {/* Fade bottom only — same as Hero */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-bg" />
        {/* Grain texture — same as Hero */}
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.35]" />
      </div>

      <div className="container-x relative">
        <SectionLabel index={s.label} title={s.headline} />

        {/* ── Text content (left-aligned, shader visible behind on right) ── */}
        <RevealOnScroll>
          <div className="mt-14 max-w-xl">
            <p className="font-sans text-lg leading-[1.6] text-ink-dim md:text-xl">
              {s.intro}
            </p>
            <p className="mt-6 font-sans text-lg font-medium leading-[1.6] text-ink-text md:text-xl">
              {s.pitch}
            </p>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink-dim">
              {s.cta}
            </p>
            <div className="mt-8">
              <Button href={s.applyHref} variant="primary">
                {s.applyLabel}
              </Button>
            </div>
          </div>
        </RevealOnScroll>

        {/* ── Focus pillars ── */}
        <RevealOnScroll>
          <div className="mt-20 grid grid-cols-1 gap-px border border-ink-border bg-ink-border sm:grid-cols-2 md:grid-cols-4">
            {s.pillars.map((pillar, i) => (
              <div key={i} className="bg-ink-bg p-6 md:p-8">
                <span className="micro-label text-accent">0{i + 1}</span>
                <h4 className="mt-4 font-sans text-base font-medium tracking-tight text-ink-text md:text-lg">
                  {pillar.title}
                </h4>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink-dim">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </RevealOnScroll>


        {/* ── Hiring CTA band ── */}
        <RevealOnScroll>
          <div className="mt-20 border-t border-ink-border pt-10 md:flex md:items-start md:justify-between md:gap-12">
            <p className="max-w-xl font-sans text-xl leading-[1.55] text-ink-text md:text-2xl">
              {s.hiring.statement}
            </p>
            <div className="mt-6 shrink-0 md:mt-0">
              <Button href={s.applyHref} variant="primary">
                Apply now
              </Button>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                {s.hiring.note}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
