import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'signal';

interface Props {
  href: string;
  children: ReactNode;
  variant?: Variant;
  glyph?: string;
  className?: string;
  external?: boolean;
}

const styles: Record<Variant, { shell: string; label: string; divider: string; glyph: string; fill: string }> = {
  primary: {
    shell:
      'border-ink-text/80 text-ink-text hover:text-ink-bg',
    label: 'text-ink-text group-hover:text-ink-bg',
    divider: 'border-ink-text/80',
    glyph: 'text-ink-text group-hover:text-ink-bg',
    fill: 'bg-ink-text',
  },
  ghost: {
    shell:
      'border-ink-border text-ink-dim hover:text-ink-text hover:border-ink-dim',
    label: 'text-ink-dim group-hover:text-ink-text',
    divider: 'border-ink-border group-hover:border-ink-dim',
    glyph: 'text-ink-muted group-hover:text-ink-text',
    fill: 'bg-ink-surface',
  },
  signal: {
    shell:
      'border-accent/60 text-accent hover:text-ink-bg',
    label: 'text-accent group-hover:text-ink-bg',
    divider: 'border-accent/60',
    glyph: 'text-accent group-hover:text-ink-bg',
    fill: 'bg-accent',
  },
};

export function Button({
  href,
  children,
  variant = 'primary',
  glyph = '→',
  className = '',
  external,
}: Props) {
  const s = styles[variant];
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group relative inline-flex items-stretch overflow-hidden rounded-sm border ${s.shell} font-mono text-[12px] uppercase tracking-micro transition-colors duration-300 ${className}`}
    >
      {/* sliding fill */}
      <span
        aria-hidden
        className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-x-100 ${s.fill}`}
      />
      <span className={`relative px-5 py-3 transition-colors duration-300 ${s.label}`}>
        {children}
      </span>
      <span
        className={`relative flex items-center border-l px-3.5 py-3 transition-all duration-300 ${s.divider} ${s.glyph}`}
      >
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
          {glyph}
        </span>
      </span>
    </a>
  );
}
