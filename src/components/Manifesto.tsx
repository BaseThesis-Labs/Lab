import { site } from '../content/site';
import { RevealOnScroll } from './RevealOnScroll';

export function Manifesto() {
  return (
    <section id="manifesto" className="relative py-28 md:py-40">
      <div className="container-x">
        <RevealOnScroll>
          <div className="micro-label">00 / Thesis</div>
        </RevealOnScroll>

        <div className="mt-10 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            {site.manifesto.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <p className="mb-8 font-sans text-xl leading-[1.55] text-ink-text md:text-2xl">
                  {p}
                </p>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.2} className="md:col-span-4 md:col-start-9">
            <div className="relative border-l border-accent pl-6 md:mt-6">
              <span className="micro-label text-accent">Pullquote</span>
              <p className="mt-3 font-serif text-2xl italic leading-snug text-ink-text md:text-[28px]">
                “{site.manifesto.pullquote}”
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
