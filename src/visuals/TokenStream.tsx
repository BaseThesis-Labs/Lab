import { useMemo } from 'react';

interface Props {
  className?: string;
}

// Token stream with attention arcs — Meridian long-context feel.
export function TokenStream({ className }: Props) {
  const W = 560;
  const H = 320;

  const { tokens, arcs } = useMemo(() => {
    const N = 64;
    const baseY = H * 0.7;
    const tokens = Array.from({ length: N }, (_, i) => {
      const x = 20 + (i / (N - 1)) * (W - 40);
      const h = 10 + (Math.sin(i * 1.3) * 0.5 + 0.5) * 34 + (i % 7 === 0 ? 12 : 0);
      return { x, y: baseY, h, i };
    });
    const pick = (n: number) => {
      // deterministic attention pairs
      const pairs: [number, number][] = [];
      for (let k = 0; k < n; k++) {
        const a = Math.floor(((k * 7.1) % 1) * N);
        const b = Math.floor(((k * 3.7 + 0.37) % 1) * N);
        if (Math.abs(a - b) > 4) pairs.push([Math.min(a, b), Math.max(a, b)]);
      }
      return pairs;
    };
    const arcs = pick(14);
    return { tokens, arcs };
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={className} aria-hidden>
      {/* horizon rule */}
      <line x1="20" x2={W - 20} y1={H * 0.7} y2={H * 0.7} stroke="#2A2A2A" />

      {/* attention arcs */}
      {arcs.map(([a, b], i) => {
        const ax = tokens[a].x;
        const bx = tokens[b].x;
        const rx = (bx - ax) / 2;
        const accent = i % 3 === 0;
        return (
          <path
            key={i}
            d={`M${ax},${H * 0.7} A${rx},${rx * 0.8} 0 0 1 ${bx},${H * 0.7}`}
            fill="none"
            stroke={accent ? '#E8D9BE' : '#EDEDED'}
            strokeOpacity={accent ? 0.6 : 0.18 + (i % 5) * 0.04}
            strokeWidth={accent ? 0.8 : 0.6}
          />
        );
      })}

      {/* tokens */}
      {tokens.map((t) => (
        <g key={t.i}>
          <rect
            x={t.x - 2}
            y={t.y - t.h}
            width="4"
            height={t.h}
            fill={t.i % 11 === 0 ? '#E8D9BE' : '#EDEDED'}
            opacity={t.i % 11 === 0 ? 0.9 : 0.55}
          />
        </g>
      ))}

      {/* cursor */}
      <g>
        <line
          x1={tokens[48].x}
          x2={tokens[48].x}
          y1="20"
          y2={H - 24}
          stroke="#E8D9BE"
          strokeOpacity="0.55"
          strokeDasharray="2 4"
        />
        <text
          x={tokens[48].x + 6}
          y="24"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fill="#E8D9BE"
        >
          t=2048
        </text>
      </g>

      {/* meta */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#737373">
        <text x="20" y="20">./meridian-7b · eval</text>
        <text x={W - 110} y="20">ctx=1M · heads=32</text>
        <text x="20" y={H - 10}>attn_sparsity=0.94</text>
      </g>
    </svg>
  );
}
