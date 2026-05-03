import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

/* ─────────────── Panel A — effort paradox ─────────────── */
type Curve = {
  name: string;
  color: string;
  width: number;
  pts: [number, number][];
};

const curves: Curve[] = [
  {
    name: 'Claude 3.7 Sonnet (Thinking)',
    color: C.warm,
    width: 2.4,
    pts: [
      [1.5, 0.10],
      [2.5, 0.42],
      [3.5, 0.65],
      [4.5, 0.78],
      [5.5, 0.86],
      [6.5, 0.94],
      [7.0, 0.96],
      [7.5, 0.85],
      [8.0, 0.55],
      [8.7, 0.28],
      [9.5, 0.14],
      [10.5, 0.06],
      [11.5, 0.03],
    ],
  },
  {
    name: 'DeepSeek-R1',
    color: C.dim,
    width: 1.8,
    pts: [
      [1.5, 0.08],
      [2.5, 0.36],
      [3.5, 0.58],
      [4.5, 0.70],
      [5.5, 0.78],
      [6.5, 0.82],
      [7.2, 0.83],
      [7.7, 0.66],
      [8.3, 0.38],
      [9.0, 0.20],
      [10.0, 0.10],
      [11.5, 0.04],
    ],
  },
  {
    name: 'o3-mini (high)',
    color: C.muted,
    width: 1.6,
    pts: [
      [1.5, 0.05],
      [2.5, 0.28],
      [3.5, 0.48],
      [4.5, 0.62],
      [5.5, 0.70],
      [6.3, 0.72],
      [6.8, 0.65],
      [7.5, 0.40],
      [8.2, 0.20],
      [9.2, 0.09],
      [10.5, 0.04],
      [11.5, 0.02],
    ],
  },
];

/* ─────────────── Panel B — seed vs perturbed ─────────────── */
type Row = {
  label: string;
  bench: string;
  seed: number;
  perturbed: number;
  delta: string;
  highlight?: boolean;
};

const rows: Row[] = [
  { label: 'ASyMOB', bench: '2025 frontier avg.', seed: 77, perturbed: 33, delta: '−43.6 pp', highlight: true },
  { label: 'MSCR', bench: 'open-source math (one word)', seed: 85, perturbed: 35, delta: '−49.9 pp', highlight: true },
  { label: 'RIDE', bench: '26 models incl. GPT-5', seed: 70, perturbed: 48, delta: '−21.7 pp avg.' },
  { label: 'Putnam-AXIOM', bench: 'o1-preview', seed: 42, perturbed: 22, delta: '−19.6 pp' },
  { label: 'MSCR', bench: 'OpenAI o3 (one-word adv.)', seed: 91, perturbed: 75, delta: '−15.9 pp' },
];

/* ─────────────── layout ─────────────── */
const W = 1040;
const H = 800;

// Panel A
const A = { left: 80, top: 80, right: W - 60, bottom: 360 };
const xA = (v: number) => A.left + ((v - 1) / 11) * (A.right - A.left);
const yA = (v: number) => A.bottom - v * (A.bottom - A.top);
const BOUNDARY_X = 7.3;

// Panel B
const B = { left: 360, top: 470, right: W - 130, bottom: 740 };
const xB = (v: number) => B.left + (v / 100) * (B.right - B.left);
const ROW_H = 50;
const BAR_H = 16;

function curvePath(pts: [number, number][]) {
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xA(p[0]).toFixed(1)} ${yA(p[1]).toFixed(1)}`)
    .join(' ');
}

export function Fig3Brittleness() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* ────────── Panel A header ────────── */}
      <text x={A.left} y={36} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        A
      </text>
      <text x={A.left + 18} y={36} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        The effort paradox
      </text>
      <text x={A.left} y={56} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={12} fill={C.muted}>
        Reasoning tokens used (normalized)
      </text>

      {/* y-grid + axis */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={A.left} x2={A.right} y1={yA(t)} y2={yA(t)} stroke={C.grid} strokeWidth={1} />
          <text x={A.left - 12} y={yA(t) + 4} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {Math.round(t * 100)}%
          </text>
        </g>
      ))}
      <line x1={A.left} y1={A.bottom} x2={A.right} y2={A.bottom} stroke={C.hairline} strokeWidth={1} />

      {/* x ticks */}
      {[2, 4, 6, 8, 10, 11].map((t) => (
        <g key={t}>
          <line x1={xA(t)} x2={xA(t)} y1={A.bottom} y2={A.bottom + 5} stroke={C.muted} strokeWidth={1} />
          <text
            x={xA(t)}
            y={A.bottom + 22}
            textAnchor="middle"
            fontFamily={FONT_MONO}
            fontSize={11}
            fill={C.muted}
          >
            {t}
          </text>
        </g>
      ))}
      <text
        x={(A.left + A.right) / 2}
        y={A.bottom + 44}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        Problem complexity →
      </text>

      {/* capability boundary */}
      <line
        x1={xA(BOUNDARY_X)}
        x2={xA(BOUNDARY_X)}
        y1={A.top}
        y2={A.bottom}
        stroke={C.dim}
        strokeWidth={1}
        strokeDasharray="4 5"
        opacity={0.55}
      />
      <text x={xA(BOUNDARY_X) + 8} y={A.top + 12} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={11} fill={C.muted}>
        capability
      </text>
      <text x={xA(BOUNDARY_X) + 8} y={A.top + 26} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={11} fill={C.muted}>
        boundary
      </text>

      {/* curves */}
      {curves.map((c, i) => (
        <path
          key={i}
          d={curvePath(c.pts)}
          stroke={c.color}
          strokeWidth={c.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* legend (top-left of panel A interior) */}
      {curves.map((c, i) => (
        <g key={`leg${i}`} transform={`translate(${A.left + 16}, ${A.top + 16 + i * 18})`}>
          <line x1={0} x2={20} y1={5} y2={5} stroke={c.color} strokeWidth={c.width} strokeLinecap="round" />
          <text x={28} y={9} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
            {c.name}
          </text>
        </g>
      ))}

      {/* annotation arrow + label */}
      <g>
        <text
          x={xA(BOUNDARY_X) + 110}
          y={A.top + 96}
          fontFamily={FONT_SANS}
          fontSize={12}
          fontWeight={600}
          fill={C.warm}
        >
          models reduce effort
        </text>
        <text
          x={xA(BOUNDARY_X) + 110}
          y={A.top + 113}
          fontFamily={FONT_SANS}
          fontSize={12}
          fontWeight={600}
          fill={C.warm}
        >
          despite remaining
        </text>
        <text
          x={xA(BOUNDARY_X) + 110}
          y={A.top + 130}
          fontFamily={FONT_SANS}
          fontSize={12}
          fontWeight={600}
          fill={C.warm}
        >
          token budget
        </text>
        <path
          d={`M ${xA(BOUNDARY_X) + 120} ${A.top + 140} Q ${xA(BOUNDARY_X) + 70} ${A.top + 170} ${xA(BOUNDARY_X) + 24} ${A.top + 192}`}
          stroke={C.warm}
          strokeWidth={1.2}
          fill="none"
        />
        <path
          d={`M ${xA(BOUNDARY_X) + 32} ${A.top + 188} L ${xA(BOUNDARY_X) + 24} ${A.top + 192} L ${xA(BOUNDARY_X) + 34} ${A.top + 198} Z`}
          fill={C.warm}
        />
      </g>

      {/* ────────── Panel A / B divider ────────── */}
      <line x1={80} x2={W - 60} y1={400} y2={400} stroke={C.hairline} strokeWidth={1} />

      {/* ────────── Panel B header ────────── */}
      <text x={80} y={430} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        B
      </text>
      <text x={98} y={430} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        Seed vs. perturbed{' '}
        <tspan fill={C.muted} fontStyle="italic" fontFamily={FONT_SERIF} fontSize={13}>
          (the same problem, restated)
        </tspan>
      </text>

      {/* legend */}
      <g transform={`translate(${B.left}, 446)`}>
        <rect width={11} height={11} fill={C.dim} opacity={0.55} />
        <text x={18} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          seed
        </text>
        <rect x={80} width={11} height={11} fill={C.text} />
        <text x={98} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          perturbed
        </text>
      </g>

      {/* x-grid */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={xB(t)} x2={xB(t)} y1={B.top - 6} y2={B.bottom + 6} stroke={C.grid} strokeWidth={1} />
          <text x={xB(t)} y={B.bottom + 24} textAnchor="middle" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}

      {/* rows */}
      {rows.map((r, i) => {
        const yCenter = B.top + i * ROW_H + ROW_H / 2;
        const seedFill = r.highlight ? `${C.warm}55` : `${C.dim}55`;
        const perturbedFill = r.highlight ? C.warm : C.text;
        return (
          <g key={i}>
            <text
              x={B.left - 18}
              y={yCenter - 6}
              textAnchor="end"
              fontFamily={FONT_SANS}
              fontSize={13}
              fontWeight={500}
              fill={r.highlight ? C.warm : C.text}
            >
              {r.label}
            </text>
            <text
              x={B.left - 18}
              y={yCenter + 11}
              textAnchor="end"
              fontFamily={FONT_SERIF}
              fontStyle="italic"
              fontSize={11.5}
              fill={C.muted}
            >
              {r.bench}
            </text>

            {/* seed bar (top) */}
            <rect
              x={B.left}
              y={yCenter - BAR_H - 3}
              width={xB(r.seed) - B.left}
              height={BAR_H}
              fill={seedFill}
            />
            <text
              x={xB(r.seed) + 8}
              y={yCenter - BAR_H + 9}
              fontFamily={FONT_MONO}
              fontSize={11}
              fill={C.dim}
            >
              {r.seed}%
            </text>

            {/* perturbed bar (bottom) */}
            <rect
              x={B.left}
              y={yCenter + 3}
              width={xB(r.perturbed) - B.left}
              height={BAR_H}
              fill={perturbedFill}
              opacity={0.92}
            />
            <text
              x={xB(r.perturbed) + 8}
              y={yCenter + BAR_H - 1}
              fontFamily={FONT_MONO}
              fontSize={11}
              fontWeight={r.highlight ? 600 : 500}
              fill={r.highlight ? C.warm : C.text}
            >
              {r.perturbed}%
            </text>
            <text
              x={xB(r.perturbed) + 60}
              y={yCenter + BAR_H - 1}
              fontFamily={FONT_MONO}
              fontSize={11}
              fontWeight={r.highlight ? 600 : 500}
              fill={r.highlight ? C.warm : C.muted}
            >
              {r.delta}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
