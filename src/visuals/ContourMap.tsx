import { useMemo } from 'react';

interface Props {
  width?: number;
  height?: number;
  rings?: number;
  seed?: number;
  className?: string;
}

// Concentric noisy isolines — world-model / topographic look.
export function ContourMap({
  width = 320,
  height = 180,
  rings = 9,
  seed = 1.7,
  className,
}: Props) {
  const paths = useMemo(() => {
    const cx = width / 2;
    const cy = height / 2;
    const baseR = Math.min(width, height) * 0.06;
    const step = (Math.min(width, height) * 0.48 - baseR) / rings;
    const segments = 96;

    return Array.from({ length: rings }, (_, i) => {
      const r0 = baseR + i * step;
      const pts: [number, number][] = [];
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const n =
          Math.sin(theta * 3 + seed + i * 0.45) * 0.18 +
          Math.sin(theta * 5.1 + seed * 1.7 + i * 0.2) * 0.10 +
          Math.sin(theta * 7.3 + i * 0.9) * 0.06 +
          Math.sin(theta * 2 + i * 0.3) * 0.08;
        const r = r0 + r0 * n * (0.5 + i * 0.02);
        pts.push([cx + r * Math.cos(theta) * 1.25, cy + r * Math.sin(theta)]);
      }
      return pts.map((p) => p.join(',')).join(' ');
    });
  }, [width, height, rings, seed]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="cm-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#E8D9BE" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#E8D9BE" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={width} height={height} fill="url(#cm-fade)" />
      {paths.map((d, i) => (
        <polyline
          key={i}
          points={d}
          fill="none"
          stroke={i === Math.floor(paths.length / 2) ? '#E8D9BE' : '#EDEDED'}
          strokeOpacity={i === Math.floor(paths.length / 2) ? 0.55 : 0.22 - i * 0.012}
          strokeWidth={i === Math.floor(paths.length / 2) ? 0.9 : 0.7}
        />
      ))}
      {/* sample points */}
      {[
        [0.32, 0.42],
        [0.68, 0.55],
        [0.45, 0.70],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x * width} ${y * height})`}>
          <circle r="2.5" fill="#E8D9BE" />
          <circle r="6" fill="none" stroke="#E8D9BE" strokeOpacity="0.35" />
        </g>
      ))}
    </svg>
  );
}
