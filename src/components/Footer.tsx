import { site } from '../content/site';

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-ink-border pt-20 pb-12">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-mono text-[14px] font-semibold tracking-tight">
              <span className="text-ink-text">{site.brand.wordmark}</span>
              <span className="text-ink-muted">/ {site.brand.suffix}</span>
            </div>
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-ink-dim">
              Research, products, and founders at the frontier. {site.brand.location}.
            </p>
            <a
              href={`mailto:${site.brand.email}`}
              className="mt-6 inline-block font-mono text-[13px] text-ink-text underline decoration-ink-border decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {site.brand.email}
            </a>
          </div>

          {site.footer.columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <div className="micro-label">{col.title}</div>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-sans text-[15px] text-ink-dim transition-colors hover:text-ink-text"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* oversized wordmark */}
        <div className="mt-24 overflow-hidden">
          <div className="select-none whitespace-nowrap font-sans text-[18vw] font-medium leading-[0.85] tracking-tighter text-ink-text/[0.06] md:text-[14vw]">
            BASETHESIS
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-ink-border pt-6 font-mono text-[11px] uppercase tracking-micro text-ink-muted md:flex-row md:items-center">
          <span>© {site.brand.year} BaseThesis Labs · All rights reserved</span>
          <span>{site.brand.coords}</span>
        </div>
      </div>
    </footer>
  );
}
