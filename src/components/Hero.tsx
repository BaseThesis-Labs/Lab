import { motion } from 'framer-motion';
import { site } from '../content/site';
import { Button } from './Button';
import { ShaderBackground } from './ShaderBackground';

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <ShaderBackground />
        {/* fade right → left so the headline column sits on pure black */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-bg via-ink-bg/80 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-bg" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.35]" />
      </div>

      {/* frame marks */}
      <div className="pointer-events-none absolute inset-4 hidden md:block">
        <Corner className="left-0 top-0" />
        <Corner className="right-0 top-0 rotate-90" />
        <Corner className="bottom-0 left-0 -rotate-90" />
        <Corner className="bottom-0 right-0 rotate-180" />
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-between pb-14 pt-28 md:pt-36">
        <div className="max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
            className="text-balance font-sans text-display font-medium text-ink-text"
          >
            {site.hero.headline.split(/(frontier|intelligence)/g).map((chunk, i) =>
              chunk === 'frontier' || chunk === 'intelligence' ? (
                <em key={i} className="font-serif italic text-accent">{chunk}</em>
              ) : (
                <span key={i}>{chunk}</span>
              ),
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-8 max-w-2xl text-balance font-sans text-lg leading-relaxed text-ink-dim md:text-xl"
          >
            {site.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href={site.hero.cta.href} variant="primary">
              {site.hero.cta.label}
            </Button>
            <Button href={site.hero.secondary.href} variant="ghost" glyph="↓">
              {site.hero.secondary.label}
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-14 grid grid-cols-2 gap-4 border-t border-ink-border pt-6 font-mono text-[11px] uppercase tracking-micro text-ink-muted md:grid-cols-4"
        >
          <HeroMeta k="Index" v="β.001" />
          <HeroMeta k="Status" v={<span className="text-accent">Hiring</span>} />
          <HeroMeta k="Node" v={site.brand.coords} />
          <HeroMeta k="Epoch" v={site.brand.year} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroMeta({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-ink-muted">{k}</span>
      <span className="text-ink-text">{v}</span>
    </div>
  );
}

function Corner({ className = '' }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={`absolute text-ink-border ${className}`}
    >
      <path d="M0 6V0h6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
