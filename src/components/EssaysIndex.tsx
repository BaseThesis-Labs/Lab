import { Footer } from './Footer';
import { Nav } from './Nav';

type EssayCard = {
  slug: string;
  index: string;
  title: string;
  italicized?: string[];
  description: string;
  authors: string;
  date: string;
  reading: string;
  card: string;
  status?: string;
};

const essays: EssayCard[] = [
  {
    slug: 'non-compositionality-of-intelligence',
    index: '001',
    title: 'On the Non-Compositionality of Intelligence',
    italicized: ['Non-Compositionality', 'Intelligence'],
    description:
      'A frontier-research note arguing that intelligence is non-compositional under externalization — that what we call “intelligent” stops being preserved when its constitutive operations are distributed across a model, an interpreter, a retriever, a filesystem, and an orchestration loop.',
    authors: 'Siddhant Saxena · Claude Opus 4.7',
    date: 'May 2026',
    reading: '38 min read',
    card: '/essays/non_compositionality_of_ii/essay1_card.png',
    status: 'New',
  },
];

export function EssaysIndex() {
  return (
    <div className="relative">
      <Nav />
      <main className="relative z-10 pt-32 pb-24">
        <div className="container-x">
          <div className="micro-label">BaseThesis · Essays</div>
          <h1 className="mt-6 font-sans text-5xl font-medium leading-[1.02] tracking-tight text-ink-text md:text-[80px]">
            Essays
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink-dim md:text-xl">
            Long-form arguments from BaseThesis Labs. Each essay is a
            frontier-research note on how the next computing paradigm is being
            built — drafted as artifacts and refined by debate.
          </p>

          <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
            {essays.map((essay) => (
              <EssayLink key={essay.slug} essay={essay} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EssayLink({ essay }: { essay: EssayCard }) {
  const titleParts = essay.italicized
    ? essay.title.split(new RegExp(`(${essay.italicized.join('|')})`, 'gi'))
    : [essay.title];

  return (
    <a
      href={`/essays/${essay.slug}`}
      className="group block focus-visible:outline-none"
    >
      {/* card image */}
      <div className="relative overflow-hidden rounded-sm border border-ink-border bg-ink-surface/40 transition-colors duration-300 group-hover:border-accent/60">
        <div className="aspect-[4/5] w-full overflow-hidden">
          <img
            src={essay.card}
            alt=""
            className="block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        {/* index + status corner */}
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-sm bg-ink-bg/70 px-2 py-1 backdrop-blur">
          <span className="font-mono text-[10px] uppercase tracking-micro text-ink-dim">
            E.{essay.index}
          </span>
          {essay.status && (
            <>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="font-mono text-[10px] uppercase tracking-micro text-accent">
                {essay.status}
              </span>
            </>
          )}
        </div>
      </div>

      {/* meta */}
      <div className="mt-6">
        <div className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
          {essay.date} · {essay.reading}
        </div>
        <h2 className="mt-3 font-sans text-[26px] font-medium leading-[1.12] tracking-tight text-ink-text transition-colors duration-300 group-hover:text-accent">
          {titleParts.map((chunk, i) =>
            essay.italicized?.some(
              (w) => w.toLowerCase() === chunk.toLowerCase(),
            ) ? (
              <em key={i} className="font-serif italic font-normal text-accent">
                {chunk}
              </em>
            ) : (
              <span key={i}>{chunk}</span>
            ),
          )}
        </h2>
        <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-dim">
          {essay.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-ink-border pt-4">
          <span className="font-mono text-[11px] uppercase tracking-micro text-ink-muted">
            {essay.authors}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-micro text-ink-text transition-colors duration-300 group-hover:text-accent">
            Read →
          </span>
        </div>
      </div>
    </a>
  );
}
