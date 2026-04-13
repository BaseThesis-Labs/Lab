import { useMemo } from 'react';

interface Props {
  className?: string;
}

// Isometric lattice of bonded nodes — Atlas protein-design feel.
export function Lattice({ className }: Props) {
  const W = 560;
  const H = 320;

  const { nodes, edges } = useMemo(() => {
    const nodes: { x: number; y: number; z: number; id: number; tag?: string }[] = [];
    const gx = 6;
    const gy = 3;
    const gz = 3;
    let id = 0;
    for (let zi = 0; zi < gz; zi++) {
      for (let yi = 0; yi < gy; yi++) {
        for (let xi = 0; xi < gx; xi++) {
          const jx = (Math.sin(id * 1.7) + 1) * 0.1;
          const jy = (Math.sin(id * 2.3 + 1) + 1) * 0.1;
          nodes.push({
            x: xi - (gx - 1) / 2 + jx,
            y: yi - (gy - 1) / 2 + jy,
            z: zi - (gz - 1) / 2,
            id: id++,
          });
        }
      }
    }
    // edges along axes
    const edges: [number, number][] = [];
    nodes.forEach((n) => {
      const right = nodes.find(
        (m) =>
          Math.abs(m.x - (n.x + 1)) < 0.4 &&
          Math.abs(m.y - n.y) < 0.3 &&
          Math.abs(m.z - n.z) < 0.3,
      );
      if (right) edges.push([n.id, right.id]);
      const up = nodes.find(
        (m) =>
          Math.abs(m.x - n.x) < 0.4 &&
          Math.abs(m.y - (n.y + 1)) < 0.3 &&
          Math.abs(m.z - n.z) < 0.3,
      );
      if (up) edges.push([n.id, up.id]);
      const back = nodes.find(
        (m) =>
          Math.abs(m.x - n.x) < 0.3 &&
          Math.abs(m.y - n.y) < 0.3 &&
          Math.abs(m.z - (n.z + 1)) < 0.4,
      );
      if (back) edges.push([n.id, back.id]);
    });
    return { nodes, edges };
  }, []);

  const iso = (n: { x: number; y: number; z: number }) => {
    // isometric-ish projection
    const s = 48;
    const x = W / 2 + (n.x - n.z * 0.5) * s;
    const y = H / 2 + (n.y * 0.9 + n.z * 0.45) * s * 0.9;
    return { x, y, depth: n.z };
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={className} aria-hidden>
      {/* ground plane tick */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={60}
          x2={W - 60}
          y1={H - 30 - i * 8}
          y2={H - 30 - i * 8}
          stroke="#EDEDED"
          strokeOpacity={0.02 + i * 0.004}
        />
      ))}

      {edges.map(([a, b], i) => {
        const pa = iso(nodes[a]);
        const pb = iso(nodes[b]);
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke="#EDEDED"
            strokeOpacity={0.22 + (pa.depth + pb.depth) * 0.05}
            strokeWidth="0.7"
          />
        );
      })}

      {nodes
        .map((n) => ({ ...iso(n), id: n.id }))
        .sort((a, b) => a.depth - b.depth)
        .map((p) => {
          const accent = p.id % 7 === 0;
          return (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill={accent ? '#E8D9BE' : '#EDEDED'}
                opacity="0.06"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={accent ? 3.6 : 2.6}
                fill={accent ? '#E8D9BE' : '#EDEDED'}
                opacity={accent ? 1 : 0.75}
              />
            </g>
          );
        })}

      <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#737373">
        <text x="20" y="20">./atlas · design</text>
        <text x={W - 140} y="20">aa=MVLKQGIRS… · n=54</text>
        <text x="20" y={H - 10}>binding=0.82 · fold=∆∆G −9.1</text>
      </g>
    </svg>
  );
}
