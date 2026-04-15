import { site } from '../content/site';
import { TorusShader } from '../visuals/TorusShader';
import { Button } from './Button';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

export function WorkWithUs() {
  const s = site.workWithUs;

  return (
    <section id="join" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel index={s.label} title={s.headline} />

        {/* ── Top split: text left / shader right ── */}
        <div className="mt-14 grid grid-cols-1 gap-0 md:grid-cols-2">
          {/* Text column */}
          <RevealOnScroll>
            <div className="pr-0 md:pr-12">
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

          {/* Shader visual */}
          <RevealOnScroll delay={0.1}>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-sm md:mt-0">
              <TorusShader />
              {/* Gradient overlays matching hero pattern */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-bg/40 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-bg via-transparent to-ink-bg/30" />
            </div>
          </RevealOnScroll>
        </div>

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

        {/* ── Team + Backgrounds ── */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Team grid */}
          <RevealOnScroll>
            <div>
              <div className="micro-label mb-6">Team</div>
              <div className="space-y-0 border-t border-ink-border">
                {s.team.map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-4 border-b border-ink-border py-3 font-sans text-sm text-ink-text"
                  >
                    {row.map((name) => (
                      <span key={name}>{name}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Backgrounds */}
          <RevealOnScroll delay={0.05}>
            <div>
              <div className="micro-label mb-6">Background</div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {s.backgrounds.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-center rounded-sm border border-ink-border bg-ink-surface/30 px-3 py-3 font-mono text-[10px] uppercase tracking-micro text-ink-muted transition-colors hover:border-ink-muted hover:text-ink-dim"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

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
