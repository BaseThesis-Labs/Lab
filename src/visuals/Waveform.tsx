import { useMemo } from 'react';

interface Props {
  className?: string;
  lanes?: number;
  seed?: number;
}

// Multi-lane neural signal — EEG-style stacked traces.
export function Waveform({ className, lanes = 4, seed = 3.2 }: Props) {
  const W = 320;
  const H = 180;
  const paths = useMemo(() => {
    const samples = 180;
    return Array.from({ length: lanes }, (_, k) => {
      const y0 = ((k + 0.5) / lanes) * H;
      const amp = 10 + k * 2;
      const parts: string[] = [];
      for (let i = 0; i <= samples; i++) {
        const x = (i / samples) * W;
        const t = i / samples;
        const n =
          Math.sin(t * 18 + seed * (k + 1)) * 0.5 +
          Math.sin(t * 47 + k * 1.7 + seed) * 0.28 +
          Math.sin(t * 93 + k * 2.3) * 0.14 +
          Math.sin(t * 7 + k) * 0.3;
        const y = y0 + n * amp;
        parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return parts.join(' ');
    });
  }, [lanes, seed]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={className} aria-hidden>
      {/* lane dividers */}
      {Array.from({ length: lanes + 1 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          x2={W}
          y1={(i / lanes) * H}
          y2={(i / lanes) * H}
          stroke="#EDEDED"
          strokeOpacity="0.04"
        />
      ))}
      {/* scroll tick column */}
      <line x1={W * 0.78} x2={W * 0.78} y1="0" y2={H} stroke="#E8D9BE" strokeOpacity="0.5" strokeDasharray="2 4" />

      {/* traces */}
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i === 1 ? '#E8D9BE' : '#EDEDED'}
          strokeOpacity={i === 1 ? 0.9 : 0.5}
          strokeWidth={i === 1 ? 1 : 0.75}
        />
      ))}

      {/* lane labels */}
      {['α', 'β', 'γ', 'θ'].slice(0, lanes).map((l, i) => (
        <text
          key={l}
          x="6"
          y={((i + 0.5) / lanes) * H + 3}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          fill="#737373"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}
