import { useMemo } from 'react';

interface Props {
  className?: string;
  seed?: number;
}

// Ball-and-stick molecular lattice, soft perspective via z-sort.
export function MoleculeGraph({ className, seed = 5.1 }: Props) {
  const W = 320;
  const H = 180;

  const { nodes, edges } = useMemo(() => {
    const N = 14;
    const nodes = Array.from({ length: N }, (_, i) => {
      const theta = (i / N) * Math.PI * 2 + seed;
      const phi = Math.sin(i * 1.3 + seed) * 0.9;
      const r = 0.62 + Math.sin(i * 0.7 + seed) * 0.15;
      const x = Math.cos(theta) * Math.cos(phi) * r;
      const y = Math.sin(phi) * r;
      const z = Math.sin(theta) * Math.cos(phi) * r;
      return { x, y, z, id: i };
    });
    // edges by nearest neighbors
    const edges: [number, number][] = [];
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return;
        const dx = a.x - b.x,
          dy = a.y - b.y,
          dz = a.z - b.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 0.55) edges.push([i, j]);
      });
    });
    return { nodes, edges };
  }, [seed]);

  const project = (n: { x: number; y: number; z: number }) => {
    const scale = 60;
    const persp = 1 / (1.6 - n.z * 0.25);
    return {
      x: W / 2 + n.x * scale * persp * 1.4,
      y: H / 2 + n.y * scale * persp,
      depth: n.z,
    };
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={className} aria-hidden>
      {/* bounding circle */}
      <circle cx={W / 2} cy={H / 2} r="70" fill="none" stroke="#EDEDED" strokeOpacity="0.05" />
      <circle cx={W / 2} cy={H / 2} r="55" fill="none" stroke="#EDEDED" strokeOpacity="0.04" />

      {edges.map(([a, b], i) => {
        const pa = project(nodes[a]);
        const pb = project(nodes[b]);
        const alpha = 0.3 + (pa.depth + pb.depth) * 0.15;
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke="#EDEDED"
            strokeOpacity={alpha}
            strokeWidth="0.6"
          />
        );
      })}

      {nodes
        .map((n, i) => ({ ...project(n), i }))
        .sort((a, b) => a.depth - b.depth)
        .map((p) => {
          const isAccent = p.i % 5 === 0;
          const size = 2 + (p.depth + 0.5) * 2.4;
          return (
            <g key={p.i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={size + 3}
                fill={isAccent ? '#E8D9BE' : '#EDEDED'}
                opacity={0.08}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={size}
                fill={isAccent ? '#E8D9BE' : '#EDEDED'}
                opacity={0.75}
              />
            </g>
          );
        })}

      <text x="10" y={H - 10} fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#737373">
        SEQ:atlas-0042 · ΔG=−18.4
      </text>
    </svg>
  );
}
