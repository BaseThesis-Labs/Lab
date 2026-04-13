import { site } from '../content/site';
import { Button } from './Button';
import { CornerMarks } from './CornerMarks';
import { CountUp } from './CountUp';
import { RevealOnScroll } from './RevealOnScroll';
import { SectionLabel } from './SectionLabel';

export function Fund() {
  return (
    <section id="fund" className="relative py-28 md:py-36">
      <div className="container-x">
        <SectionLabel index={site.fund.label} title="Founder-in-Residence cohort." />

        <div className="grid gap-12 md:grid-cols-12">
          <RevealOnScroll className="md:col-span-6">
            <p className="font-sans text-xl leading-[1.55] text-ink-text md:text-2xl">
              {site.fund.pitch}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={site.fund.cta.href} variant="primary">
                {site.fund.cta.label}
              </Button>
              <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                {site.fund.deadline}
              </span>
            </div>

            {/* timeline */}
            <div className="mt-14">
              <div className="micro-label">Program · 12 weeks</div>
              <div className="relative mt-5 h-px bg-ink-border">
                <div className="absolute inset-y-0 left-0 w-[25%] bg-ink-text" />
                <div className="absolute left-[25%] top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-ink-text" />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-micro text-ink-muted">
                <span className="text-ink-text">wk 01 · form</span>
                <span>wk 04 · build</span>
                <span>wk 08 · ship</span>
                <span>wk 12 · raise</span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1} className="md:col-span-6">
            <div className="relative grid grid-cols-2 gap-px border border-ink-border bg-ink-border">
              <CornerMarks />
              {site.fund.stats.map((s) => (
                <div key={s.v} className="relative bg-ink-bg p-8 md:p-10">
                  <div className="font-sans text-4xl tracking-tight text-ink-text md:text-5xl">
                    <CountUp to={s.n} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} duration={1.7} />
                  </div>
                  <div className="mt-3 font-mono text-[11px] uppercase tracking-micro text-ink-muted">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
