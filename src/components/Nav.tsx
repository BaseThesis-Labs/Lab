import { useEffect, useState } from 'react';
import { site } from '../content/site';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-ink-bg/70 border-b border-ink-border' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-14 items-center justify-between">
        <a href="#top" className="group flex items-center gap-2 font-mono text-[13px] font-semibold tracking-tight">
          <span className="text-ink-text">{site.brand.wordmark}</span>
          <span className="text-ink-muted">/ {site.brand.suffix}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[12px] uppercase tracking-micro text-ink-dim transition-colors hover:text-ink-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#fund"
          className="group relative hidden items-stretch overflow-hidden rounded-sm border border-ink-text/70 font-mono text-[11px] uppercase tracking-micro text-ink-text transition-colors duration-300 hover:text-ink-bg md:inline-flex"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-left scale-x-0 bg-ink-text transition-transform duration-500 ease-out group-hover:scale-x-100"
          />
          <span className="relative flex items-center px-3 py-1.5">Apply</span>
          <span className="relative flex items-center border-l border-ink-text/70 px-2 py-1.5">
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </a>
      </div>
    </header>
  );
}
