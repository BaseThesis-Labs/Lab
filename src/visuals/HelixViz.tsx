import { useMemo } from 'react';

interface Props {
  className?: string;
}

// Phase-space / flow-field trails — "executable world model" feel.
export function HelixViz({ className }: Props) {
  const W = 560;
  const H = 320;

  const trails = useMemo(() => {
    const N_TRAILS = 28;
    const N_STEPS = 46;
    const out: string[] = [];

    for (let k = 0; k < N_TRAILS; k++) {
      const seed = k * 1.71;
      let x = (W * 0.5) + Math.cos(seed) * 160;
      let y = (H * 0.5) + Math.sin(seed * 1.3) * 100;
      const parts: string[] = [`M${x.toFixed(1)},${y.toFixed(1)}`];
      for (let s = 0; s < N_STEPS; s++) {
        const nx = x / W - 0.5;
        const ny = y / H - 0.5;
        // simple vector field — swirling double-gyre-ish
        const vx = Math.sin(ny * 4 + seed * 0.2) * 2 + Math.cos(nx * 3) * 0.6;
        const vy = Math.cos(nx * 4 + seed * 0.3) * 1.6 + Math.sin(ny * 3) * 0.8;
        x += vx * 3.2;
        y += vy * 2.6;
        if (x < 0 || x > W || y < 0 || y > H) break;
        parts.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
      }
      out.push(parts.join(' '));
    }
    return out;
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={className} aria-hidden>
      <defs>
        <linearGradient id="helix-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#E8D9BE" stopOpacity="0" />
          <stop offset="0.5" stopColor="#E8D9BE" stopOpacity="0.6" />
          <stop offset="1" stopColor="#EDEDED" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* backdrop grid */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={(i / 7) * W}
          x2={(i / 7) * W}
          y1="0"
          y2={H}
          stroke="#EDEDED"
          strokeOpacity="0.04"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`h${i}`}
          y1={(i / 4) * H}
          y2={(i / 4) * H}
          x1="0"
          x2={W}
          stroke="#EDEDED"
          strokeOpacity="0.04"
        />
      ))}

      {trails.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={i % 4 === 0 ? '#E8D9BE' : 'url(#helix-fade)'}
          strokeOpacity={i % 4 === 0 ? 0.8 : 0.45}
          strokeWidth={i % 4 === 0 ? 0.9 : 0.6}
          fill="none"
        />
      ))}

      {/* attractor nodes */}
      {[
        [0.3, 0.4],
        [0.75, 0.55],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x * W} ${y * H})`}>
          <circle r="3" fill="#E8D9BE" />
          <circle r="10" fill="none" stroke="#E8D9BE" strokeOpacity="0.3" />
          <circle r="20" fill="none" stroke="#E8D9BE" strokeOpacity="0.15" />
        </g>
      ))}

      {/* frame ticks */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#737373">
        <text x="10" y="18">./helix · runtime</text>
        <text x={W - 86} y="18">step=00240</text>
        <text x="10" y={H - 10}>∂t=0.016 · dim=256</text>
      </g>
    </svg>
  );
}
