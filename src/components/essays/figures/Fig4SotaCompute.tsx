import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

/* ─────────────── Panel A — SOTA on hard problems ─────────────── */
const QUARTERS = ['Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2'];
const YEAR_LABEL_AT = [0, 4, 8];

type Series = {
  name: string;
  color: string;
  width: number;
  pts: [number, number][];
};

const seriesA: Series[] = [
  {
    name: 'MATH-500',
    color: C.muted,
    width: 1.5,
    pts: [
      [0, 65], [1, 78], [2, 88], [3, 95], [4, 97],
      [5, 98], [6, 99], [7, 99.4], [8, 99.6],
    ],
  },
  {
    name: 'AIME 2024',
    color: C.warm,
    width: 2.4,
    pts: [
      [0, 15], [1, 18], [2, 30], [3, 71], [4, 78],
      [5, 86], [6, 91], [7, 96], [8, 99],
    ],
  },
  {
    name: 'USAMO / IMO',
    color: C.accent,
    width: 2,
    pts: [
      [0, 2], [1, 5], [2, 8], [3, 12], [4, 22],
      [5, 60], [6, 78], [7, 92], [8, 97.6],
    ],
  },
  {
    name: 'GPQA-Diamond',
    color: C.dim,
    width: 1.5,
    pts: [
      [0, 38], [1, 48], [2, 56], [3, 64], [4, 70],
      [5, 76], [6, 80], [7, 84], [8, 87],
    ],
  },
];

type Annotation = { i: number; symbol: string; color: string; lead: string; rest: string };
const annotations: Annotation[] = [
  { i: 1, symbol: '①', color: C.warm, lead: 'DeepSeek-R1 pure-RL:', rest: '15.6% → 71.0% AIME, no SFT priming' },
  { i: 2, symbol: '②', color: C.accent, lead: 'Gemini Deep Think:', rest: 'IMO 2025 gold, 5/6 problems, natural language' },
  { i: 3, symbol: '③', color: C.accent, lead: 'Mythos Preview:', rest: '97.6% on USAMO 2026 (proof-graded)' },
  { i: 4, symbol: '④', color: C.muted, lead: 'o1-preview fails:', rest: 'USAMO 2025 (<5% on proofs)' },
];

/* ─────────────── Panel B — compute efficiency ─────────────── */
type Point = {
  i: number;
  label: string;
  shape: 'square' | 'circle' | 'diamond';
  color: string;
  compute: number;
  pass: number;
};

const points: Point[] = [
  { i: 1, label: 'DeepSeekMath · SFT', shape: 'square', color: C.dim, compute: 4_000, pass: 51 },
  { i: 2, label: 'Qwen3-8B · SFT (baseline)', shape: 'square', color: C.dim, compute: 800, pass: 63 },
  { i: 3, label: 'DeepSeekMath · GRPO', shape: 'circle', color: C.warm, compute: 8_000, pass: 56 },
  { i: 4, label: 'Qwen3-8B · RL (17.9% Δ)', shape: 'circle', color: C.warm, compute: 18_000, pass: 73.2 },
  { i: 5, label: 'DeepSeek-R2-Zero · pure RL', shape: 'circle', color: C.warm, compute: 60_000, pass: 78 },
  { i: 6, label: 'DeepSeek-R1 · RL + SFT', shape: 'circle', color: C.warm, compute: 120_000, pass: 80 },
  { i: 7, label: 'R1-Distill-Qwen-32B', shape: 'circle', color: C.warm, compute: 30_000, pass: 72 },
  { i: 8, label: 'Qwen3-8B + OPD (1.8k GPU-h)', shape: 'diamond', color: C.accent, compute: 1_800, pass: 80 },
];

/* ─────────────── layout ─────────────── */
const W = 1040;
const H = 1000;

// Panel A — chart (endpoint labels live in the strip on its right)
const A = { left: 80, top: 80, right: 870, bottom: 400 };
const xA = (q: number) => A.left + (q / 8) * (A.right - A.left);
const yA = (v: number) => A.bottom - (v / 100) * (A.bottom - A.top);

// Annotation row — 4 stacked rows under Panel A
const ANN_TOP = 470;
const ANN_ROW_H = 22;

// Panel B — chart
const B = { left: 80, top: 640, right: 720, bottom: 940 };
const xMin = 200, xMax = 200_000;
const xB = (gpu: number) =>
  B.left + ((Math.log10(gpu) - Math.log10(xMin)) / (Math.log10(xMax) - Math.log10(xMin))) * (B.right - B.left);
const yB = (v: number) => B.bottom - ((v - 40) / 60) * (B.bottom - B.top);

function pathOf(s: Series) {
  return s.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xA(p[0]).toFixed(1)} ${yA(p[1]).toFixed(1)}`)
    .join(' ');
}

function Marker({ x, y, shape, color }: { x: number; y: number; shape: Point['shape']; color: string }) {
  if (shape === 'square') return <rect x={x - 6} y={y - 6} width={12} height={12} fill={color} />;
  if (shape === 'diamond')
    return <path d={`M ${x} ${y - 8} L ${x + 8} ${y} L ${x} ${y + 8} L ${x - 8} ${y} Z`} fill={color} />;
  return <circle cx={x} cy={y} r={6.5} fill={color} />;
}

/** Shift Y values down so adjacent labels are at least minGap apart. */
function layoutLabels(values: number[], minGap: number, scale: (v: number) => number) {
  const idx = values.map((v, i) => ({ v, i, y: scale(v) }));
  idx.sort((a, b) => a.y - b.y);
  for (let k = 1; k < idx.length; k++) {
    if (idx[k].y - idx[k - 1].y < minGap) idx[k].y = idx[k - 1].y + minGap;
  }
  const out = new Array(values.length);
  for (const it of idx) out[it.i] = it.y;
  return out as number[];
}

function leaderPath(dotX: number, dotY: number, labelX: number, labelY: number) {
  const dir = Math.sign(labelX - dotX) || 1;
  const startX = dotX + 6 * dir;
  const elbowX = labelX - 12 * dir;
  const endX = labelX - 2 * dir;
  return `M ${startX} ${dotY} L ${elbowX} ${dotY} L ${elbowX} ${labelY} L ${endX} ${labelY}`;
}

export function Fig4SotaCompute() {
  const labelX = A.right + 28;
  const endValues = seriesA.map((s) => s.pts[s.pts.length - 1][1]);
  const labelYs = layoutLabels(endValues, 22, yA);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* ────────── Panel A header ────────── */}
      <text x={A.left} y={36} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        A
      </text>
      <text x={A.left + 18} y={36} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        SOTA on hard problems · 2024 Q2 — 2026 Q2
      </text>
      <text x={A.left} y={56} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={12} fill={C.muted}>
        Pass@1 (no tools)
      </text>

      {/* y-grid */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={A.left} x2={A.right} y1={yA(t)} y2={yA(t)} stroke={C.grid} strokeWidth={1} />
          <text x={A.left - 12} y={yA(t) + 4} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}
      {/* saturation band */}
      <rect x={A.left} y={yA(100)} width={A.right - A.left} height={yA(95) - yA(100)} fill={C.text} opacity={0.04} />
      <text x={A.left + 10} y={yA(100) + 14} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={11} fill={C.muted}>
        saturation band
      </text>

      {/* x-axis */}
      <line x1={A.left} y1={A.bottom} x2={A.right} y2={A.bottom} stroke={C.hairline} />
      {QUARTERS.map((q, i) => (
        <g key={i}>
          <line x1={xA(i)} x2={xA(i)} y1={A.bottom} y2={A.bottom + 5} stroke={C.muted} />
          <text x={xA(i)} y={A.bottom + 22} textAnchor="middle" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {q}
          </text>
        </g>
      ))}
      {YEAR_LABEL_AT.map((i, k) => (
        <text
          key={k}
          x={xA(i + 1)}
          y={A.bottom + 42}
          textAnchor="middle"
          fontFamily={FONT_MONO}
          fontSize={12.5}
          fill={C.text}
          fontWeight={500}
        >
          {2024 + k}
        </text>
      ))}

      {/* lines */}
      {seriesA.map((s, i) => (
        <path
          key={i}
          d={pathOf(s)}
          stroke={s.color}
          strokeWidth={s.width}
          fill="none"
          strokeLinejoin="round"
        />
      ))}

      {/* endpoint dots + collision-avoiding labels */}
      {seriesA.map((s, i) => {
        const lastQ = s.pts[s.pts.length - 1][0];
        const lastV = s.pts[s.pts.length - 1][1];
        const dotX = xA(lastQ);
        const dotY = yA(lastV);
        const ly = labelYs[i];
        const labelColor =
          s.color === C.muted || s.color === C.dim ? C.dim : s.color;
        return (
          <g key={`L${i}`}>
            <circle cx={dotX} cy={dotY} r={4} fill={s.color} />
            {Math.abs(ly - dotY) > 4 && (
              <path
                d={leaderPath(dotX, dotY, labelX, ly)}
                stroke={s.color}
                strokeWidth={0.9}
                fill="none"
                opacity={0.55}
              />
            )}
            <text
              x={labelX}
              y={ly + 4}
              fontFamily={FONT_SANS}
              fontSize={13}
              fontWeight={s.color === C.warm || s.color === C.accent ? 600 : 500}
              fill={labelColor}
            >
              {s.name}
            </text>
          </g>
        );
      })}

      {/* numbered point markers on trajectories */}
      <circle cx={xA(3)} cy={yA(71)} r={3.5} fill={C.warm} />
      <text x={xA(3) - 16} y={yA(71) - 10} fontFamily={FONT_MONO} fontSize={12} fontWeight={700} fill={C.warm}>
        ①
      </text>
      <circle cx={xA(5)} cy={yA(60)} r={3.5} fill={C.accent} />
      <text x={xA(5) + 8} y={yA(60) - 6} fontFamily={FONT_MONO} fontSize={12} fontWeight={700} fill={C.accent}>
        ②
      </text>
      <circle cx={xA(8)} cy={yA(97.6)} r={3.5} fill={C.accent} />
      <text x={xA(8) - 22} y={yA(97.6) - 12} fontFamily={FONT_MONO} fontSize={12} fontWeight={700} fill={C.accent}>
        ③
      </text>
      <circle cx={xA(4)} cy={yA(22)} r={3.5} fill={C.muted} />
      <text x={xA(4) - 14} y={yA(22) + 18} fontFamily={FONT_MONO} fontSize={12} fontWeight={700} fill={C.muted}>
        ④
      </text>

      {/* annotation block — vertical stack under panel A, single line each */}
      <line x1={80} x2={W - 60} y1={ANN_TOP - 22} y2={ANN_TOP - 22} stroke={C.hairline} />
      {annotations.map((a, i) => {
        const y = ANN_TOP + i * ANN_ROW_H;
        return (
          <g key={a.i}>
            <text x={100} y={y} fontFamily={FONT_MONO} fontSize={13} fontWeight={700} fill={a.color}>
              {a.symbol}
            </text>
            <text x={124} y={y} fontFamily={FONT_SANS} fontSize={12.5} fontWeight={600} fill={a.color}>
              {a.lead}
            </text>
            <text x={300} y={y} fontFamily={FONT_MONO} fontSize={11.5} fill={C.dim}>
              {a.rest}
            </text>
          </g>
        );
      })}

      {/* divider */}
      <line x1={80} x2={W - 60} y1={580} y2={580} stroke={C.hairline} />

      {/* ────────── Panel B header ────────── */}
      <text x={B.left} y={612} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        B
      </text>
      <text x={B.left + 18} y={612} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        Compute efficiency · AIME 2024 by training method
      </text>

      {/* legend */}
      <g transform={`translate(${B.left}, 626)`}>
        <rect width={10} height={10} fill={C.dim} />
        <text x={16} y={9} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          SFT
        </text>
        <circle cx={70} cy={5} r={5} fill={C.warm} />
        <text x={80} y={9} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          RL with verifiable rewards
        </text>
        <path d={`M 244 -3 L 251 5 L 244 13 L 237 5 Z`} fill={C.accent} />
        <text x={256} y={9} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          On-policy distillation
        </text>
      </g>

      {/* y-grid */}
      {[40, 60, 80, 100].map((t) => (
        <g key={t}>
          <line x1={B.left} x2={B.right} y1={yB(t)} y2={yB(t)} stroke={C.grid} />
          <text x={B.left - 12} y={yB(t) + 4} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}
      {/* x ticks log */}
      {[1_000, 10_000, 100_000].map((t) => (
        <g key={t}>
          <line x1={xB(t)} x2={xB(t)} y1={B.top} y2={B.bottom} stroke={C.grid} strokeWidth={1} />
          <text x={xB(t)} y={B.bottom + 22} textAnchor="middle" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t >= 1000 ? `${t / 1000}k` : t}
          </text>
        </g>
      ))}
      <text
        x={(B.left + B.right) / 2}
        y={B.bottom + 44}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        Training compute → (GPU-hours, log scale)
      </text>
      <text
        x={B.left - 48}
        y={(B.top + B.bottom) / 2}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
        transform={`rotate(-90, ${B.left - 48}, ${(B.top + B.bottom) / 2})`}
      >
        AIME 2024 pass@1
      </text>

      {/* OPD callout — leader from point 8 toward point 4 */}
      <path
        d={`M ${xB(1_800) + 14} ${yB(80) + 4} Q ${xB(6_000)} ${yB(78) + 4} ${xB(18_000) - 12} ${yB(73.2) + 4}`}
        stroke={C.accent}
        strokeWidth={1.2}
        fill="none"
        strokeDasharray="4 4"
      />
      <text x={xB(1_800) + 14} y={yB(80) - 24} fontFamily={FONT_SANS} fontSize={12} fontWeight={600} fill={C.accent}>
        OPD: ~10× less compute,
      </text>
      <text x={xB(1_800) + 14} y={yB(80) - 10} fontFamily={FONT_SANS} fontSize={12} fontWeight={600} fill={C.accent}>
        +6.8 pp over RL (same checkpoint)
      </text>

      {/* points */}
      {points.map((p) => (
        <g key={p.i}>
          <Marker x={xB(p.compute)} y={yB(p.pass)} shape={p.shape} color={p.color} />
          <text
            x={xB(p.compute) + 12}
            y={yB(p.pass) + 5}
            fontFamily={FONT_MONO}
            fontSize={10.5}
            fontWeight={600}
            fill={C.muted}
          >
            {p.i}
          </text>
        </g>
      ))}

      {/* numbered point legend, right of Panel B */}
      <g transform={`translate(${B.right + 32}, ${B.top + 20})`}>
        {points.map((p, i) => (
          <g key={i} transform={`translate(0, ${i * 22})`}>
            <text x={0} y={5} fontFamily={FONT_MONO} fontSize={11} fontWeight={700} fill={p.color}>
              {p.i}
            </text>
            <text x={16} y={5} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
              {p.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
