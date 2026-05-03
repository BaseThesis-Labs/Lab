import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

const W = 1040;
const H = 1300;

/* ─────────────── Panel A — Memory retention ─────────────── */
const A_HEADER_Y = 40;
const A_SUB_Y = 60;
const A = { left: 80, top: 100, right: W - 220, bottom: 380 };
const A_AXIS_LABEL_Y = A.bottom + 56;
const A_DIVIDER_Y = A.bottom + 90;

const ctx = [1, 2, 4, 8, 16, 32, 128, 1024];
const xMinA = 1, xMaxA = 1024;
const xA = (k: number) =>
  A.left + ((Math.log10(k) - Math.log10(xMinA)) / (Math.log10(xMaxA) - Math.log10(xMinA))) * (A.right - A.left);
const yA = (v: number) => A.bottom - (v / 100) * (A.bottom - A.top);

const gpt4o: [number, number][] = [
  [1, 99.3], [2, 97], [4, 93], [8, 88], [16, 80], [32, 69.7], [128, 55], [1024, 25],
];
const frontierAvg: [number, number][] = [
  [1, 97], [2, 93], [4, 85], [8, 75], [16, 62], [32, 48], [128, 35], [1024, 20],
];
const internalMem: [number, number][] = [
  [1, 97], [2, 96], [4, 94], [8, 93], [16, 91], [32, 88], [128, 82], [1024, 75],
];

function pathA(pts: [number, number][]) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xA(p[0]).toFixed(1)} ${yA(p[1]).toFixed(1)}`).join(' ');
}

/* ─────────────── Panel B — Capabilities ─────────────── */
const B_HEADER_Y = A_DIVIDER_Y + 36;
const B_SUB_Y = B_HEADER_Y + 18;
const B = { left: 80, top: B_HEADER_Y + 56, right: W - 220, bottom: B_HEADER_Y + 56 + 270 };
const B_DIVIDER_Y = B.bottom + 90;

type CapPt = { label: string; pretty: string[]; v: number };
const caps: CapPt[] = [
  { label: 'base', pretty: ['base', '(DSv3)'], v: 15.6 },
  { label: '+ pure RL', pretty: ['+ pure RL', '(R1-Zero)'], v: 71.0 },
  { label: '+ maj. vote', pretty: ['+ maj. vote', '(cons@64)'], v: 86.7 },
  { label: 'Nature update', pretty: ['Nature', 'update'], v: 77.9 },
];
const xB = (i: number) => B.left + 50 + (i / (caps.length - 1)) * (B.right - B.left - 100);
const yB = (v: number) => B.bottom - (v / 100) * (B.bottom - B.top);

/* ─────────────── Panel C — Determinism ─────────────── */
const C_HEADER_Y = B_DIVIDER_Y + 36;
const C_LEGEND_Y = C_HEADER_Y + 22;
const Cp = { left: 80, top: C_LEGEND_Y + 32, right: W - 220, bottom: C_LEGEND_Y + 32 + 200 };

type DetCol = { label: string[]; throughput: number; unique: number; uniqueDisp: string; uniqueLabel: string };
const det: DetCol[] = [
  {
    label: ['default kernels'],
    throughput: 100,
    unique: 80,
    uniqueDisp: '80',
    uniqueLabel: '1000 runs → 1000 unique outputs',
  },
  {
    label: ['batch-invariant kernels', '(TML 2025)'],
    throughput: 40,
    unique: 1,
    uniqueDisp: '1',
    uniqueLabel: '1000 runs → bit-identical',
  },
];
const groupX = (i: number) => Cp.left + 120 + i * 200;
const yCThr = (v: number) => Cp.bottom - (v / 100) * (Cp.bottom - Cp.top);

export function Fig5ThreeAxes() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* ────────── Panel A header ────────── */}
      <text x={A.left} y={A_HEADER_Y} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        A
      </text>
      <text x={A.left + 18} y={A_HEADER_Y} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        Memory{' '}
        <tspan fill={C.muted} fontStyle="italic" fontFamily={FONT_SERIF}>
          — effective ≠ nominal
        </tspan>
      </text>
      <text x={A.left} y={A_SUB_Y} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={12} fill={C.muted}>
        Retention vs. base accuracy
      </text>

      {/* y-grid */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={A.left} x2={A.right} y1={yA(t)} y2={yA(t)} stroke={C.grid} />
          <text x={A.left - 12} y={yA(t) + 4} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}
      <line x1={A.left} x2={A.right} y1={yA(85)} y2={yA(85)} stroke={C.muted} strokeDasharray="3 5" opacity={0.55} />
      <text x={A.right - 6} y={yA(85) - 6} textAnchor="end" fontFamily={FONT_MONO} fontSize={10.5} fill={C.muted}>
        floor (NoLiMa)
      </text>

      {/* x ticks */}
      {ctx.map((k) => (
        <g key={k}>
          <line x1={xA(k)} x2={xA(k)} y1={A.bottom} y2={A.bottom + 5} stroke={C.muted} />
          <text x={xA(k)} y={A.bottom + 22} textAnchor="middle" fontFamily={FONT_MONO} fontSize={10.5} fill={C.muted}>
            {k >= 1024 ? '1M' : `${k}K`}
          </text>
        </g>
      ))}
      <text
        x={(A.left + A.right) / 2}
        y={A_AXIS_LABEL_Y}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        Context position (tokens)
      </text>

      {/* curves */}
      <path d={pathA(internalMem)} stroke={C.cool} strokeWidth={1.6} strokeDasharray="5 5" fill="none" />
      <path d={pathA(frontierAvg)} stroke={C.dim} strokeWidth={1.6} fill="none" />
      <path d={pathA(gpt4o)} stroke={C.warm} strokeWidth={2.4} fill="none" />

      {/* legend (right of panel A) */}
      <g transform={`translate(${A.right + 26}, ${A.top + 16})`}>
        <line x1={0} x2={20} y1={5} y2={5} stroke={C.warm} strokeWidth={2.4} />
        <text x={28} y={9} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          GPT-4o (NoLiMa)
        </text>
        <line x1={0} x2={20} y1={29} y2={29} stroke={C.dim} strokeWidth={1.6} />
        <text x={28} y={33} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          frontier avg.
        </text>
        <line x1={0} x2={20} y1={53} y2={53} stroke={C.cool} strokeWidth={1.6} strokeDasharray="3 3" />
        <text x={28} y={57} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          internal memory
        </text>
        <text x={28} y={73} fontFamily={FONT_MONO} fontSize={10} fill={C.muted}>
          (Titans / TTT / Huginn)
        </text>
      </g>

      {/* annotated point at 32K */}
      <circle cx={xA(32)} cy={yA(69.7)} r={4} fill={C.warm} />
      <text x={xA(32) + 10} y={yA(69.7) - 10} fontFamily={FONT_MONO} fontSize={11} fontWeight={700} fill={C.warm}>
        99.3 → 69.7 at 32K
      </text>

      {/* divider */}
      <line x1={80} x2={W - 60} y1={A_DIVIDER_Y} y2={A_DIVIDER_Y} stroke={C.hairline} />

      {/* ────────── Panel B header ────────── */}
      <text x={B.left} y={B_HEADER_Y} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        B
      </text>
      <text x={B.left + 18} y={B_HEADER_Y} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        Capabilities{' '}
        <tspan fill={C.muted} fontStyle="italic" fontFamily={FONT_SERIF}>
          — RL internalises reasoning
        </tspan>
      </text>
      <text x={B.left} y={B_SUB_Y} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={12} fill={C.muted}>
        AIME 2024 pass@1, by post-training method
      </text>

      {/* y-grid */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={B.left} x2={B.right} y1={yB(t)} y2={yB(t)} stroke={C.grid} />
          <text x={B.left - 12} y={yB(t) + 4} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}

      {/* line connecting points */}
      <path
        d={caps.map((c, i) => `${i === 0 ? 'M' : 'L'} ${xB(i)} ${yB(c.v)}`).join(' ')}
        stroke={C.warm}
        strokeWidth={2}
        fill="none"
      />
      {caps.map((c, i) => (
        <g key={i}>
          <circle cx={xB(i)} cy={yB(c.v)} r={5.5} fill={C.warm} />
          <text
            x={xB(i)}
            y={yB(c.v) - 14}
            textAnchor="middle"
            fontFamily={FONT_MONO}
            fontSize={12.5}
            fontWeight={700}
            fill={i === 0 ? C.muted : C.warm}
          >
            {c.v}%
          </text>
          {c.pretty.map((line, k) => (
            <text
              key={k}
              x={xB(i)}
              y={B.bottom + 22 + k * 14}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={11}
              fill={C.muted}
            >
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* Mukherjee callout */}
      <g transform={`translate(${B.right + 26}, ${B.top + 16})`}>
        <text x={0} y={0} fontFamily={FONT_SANS} fontSize={12} fontWeight={600} fill={C.accent}>
          RL moves only 5–30%
        </text>
        <text x={0} y={16} fontFamily={FONT_SANS} fontSize={12} fontWeight={600} fill={C.accent}>
          of parameters
        </text>
        <text x={0} y={32} fontFamily={FONT_MONO} fontSize={10.5} fill={C.muted}>
          (Mukherjee et al., 2025)
        </text>
        <text x={0} y={68} fontFamily={FONT_SANS} fontSize={11} fontWeight={600} fill={C.dim}>
          On-policy distillation
        </text>
        <text x={0} y={84} fontFamily={FONT_MONO} fontSize={10} fill={C.muted}>
          reaches RL endpoint at:
        </text>
        <rect x={0} y={94} width={8} height={11} fill={C.accent} />
        <text x={14} y={104} fontFamily={FONT_MONO} fontSize={10.5} fill={C.dim}>
          OPD: 1–2× cost
        </text>
        <rect x={0} y={114} width={92} height={11} fill={C.warm} opacity={0.55} />
        <text x={98} y={124} fontFamily={FONT_MONO} fontSize={10.5} fill={C.dim}>
          RL: 100×
        </text>
        <text x={0} y={142} fontFamily={FONT_MONO} fontSize={9.5} fill={C.muted}>
          Lu / TML, Oct 2025
        </text>
      </g>

      {/* divider */}
      <line x1={80} x2={W - 60} y1={B_DIVIDER_Y} y2={B_DIVIDER_Y} stroke={C.hairline} />

      {/* ────────── Panel C header ────────── */}
      <text x={Cp.left} y={C_HEADER_Y} fontFamily={FONT_SANS} fontSize={15} fontWeight={600} fill={C.warm}>
        C
      </text>
      <text x={Cp.left + 18} y={C_HEADER_Y} fontFamily={FONT_SANS} fontSize={15} fontWeight={500} fill={C.text}>
        Determinism{' '}
        <tspan fill={C.muted} fontStyle="italic" fontFamily={FONT_SERIF}>
          — the seam has a price
        </tspan>
      </text>

      {/* legend — sits clearly above chart, full hairline gap */}
      <g transform={`translate(${Cp.left}, ${C_LEGEND_Y})`}>
        <rect x={0} y={0} width={11} height={11} fill={C.dim} opacity={0.6} />
        <text x={18} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          rel. throughput (left)
        </text>
        <rect x={188} y={0} width={11} height={11} fill={C.warm} />
        <text x={206} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          unique outputs / 1000 runs at T=0 (right, log)
        </text>
      </g>

      {/* y-grid */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={Cp.left + 60} x2={Cp.right - 30} y1={yCThr(t)} y2={yCThr(t)} stroke={C.grid} />
          <text x={Cp.left + 52} y={yCThr(t) + 4} textAnchor="end" fontFamily={FONT_MONO} fontSize={11} fill={C.muted}>
            {t}%
          </text>
        </g>
      ))}

      {/* groups */}
      {det.map((d, i) => {
        const cx = groupX(i);
        const barW = 44;
        const groupGap = 12;
        const uniqueLogScale = (n: number) => {
          const ratio = Math.log10(Math.max(n, 1)) / Math.log10(1000);
          return ratio * (Cp.bottom - Cp.top);
        };
        const uniqueH = uniqueLogScale(d.unique);
        const thrH = (d.throughput / 100) * (Cp.bottom - Cp.top);
        const leftBarX = cx - barW - groupGap / 2;
        const rightBarX = cx + groupGap / 2;
        return (
          <g key={i}>
            <rect x={leftBarX} y={Cp.bottom - thrH} width={barW} height={thrH} fill={C.dim} opacity={0.6} />
            <text
              x={leftBarX + barW / 2}
              y={Cp.bottom - thrH - 8}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={12.5}
              fontWeight={700}
              fill={C.text}
            >
              {d.throughput}%
            </text>
            <rect x={rightBarX} y={Cp.bottom - uniqueH} width={barW} height={Math.max(uniqueH, 2)} fill={C.warm} />
            <text
              x={rightBarX + barW / 2}
              y={Cp.bottom - uniqueH - 8}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={12.5}
              fontWeight={700}
              fill={C.warm}
            >
              {d.uniqueDisp}
            </text>
            {/* group label below axis */}
            {d.label.map((line, k) => (
              <text
                key={k}
                x={cx}
                y={Cp.bottom + 24 + k * 16}
                textAnchor="middle"
                fontFamily={FONT_MONO}
                fontSize={12}
                fill={C.text}
              >
                {line}
              </text>
            ))}
            <text
              x={cx}
              y={Cp.bottom + 24 + d.label.length * 16 + 8}
              textAnchor="middle"
              fontFamily={FONT_SERIF}
              fontStyle="italic"
              fontSize={11}
              fill={C.muted}
            >
              {d.uniqueLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
