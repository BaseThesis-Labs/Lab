import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

type Row = {
  label: string;
  sub: string;
  value: number; // TOPS/W
  display: string;
  category: 'tax' | 'colocated' | 'biological';
};

const data: Row[] = [
  { label: 'Server CPU', sub: 'FP32, baseline', value: 0.05, display: '0.05', category: 'tax' },
  { label: 'NVIDIA H100', sub: 'FP8, frontier GPU', value: 3, display: '3', category: 'tax' },
  { label: 'IBM HERMES', sub: 'PCM, in-memory', value: 12.4, display: '12.4', category: 'colocated' },
  { label: 'IBM NorthPole', sub: 'digital, brain-inspired', value: 22, display: '22', category: 'colocated' },
  { label: 'Human cortex', sub: 'biological reference', value: 10_000, display: '~10,000', category: 'biological' },
];

const W = 1040;
const ROW_H = 64;
const H = 100 + ROW_H * data.length + 80;
const PAD = { top: 76, right: 220, bottom: 76, left: 280 };
const PLOT_W = W - PAD.left - PAD.right;

// Log scale: 0.01 to 100,000 (5 decades)
const xMin = 0.01;
const xMax = 100_000;
const xScale = (v: number) =>
  PAD.left +
  ((Math.log10(Math.max(v, xMin)) - Math.log10(xMin)) /
    (Math.log10(xMax) - Math.log10(xMin))) *
    PLOT_W;

const colorFor = (cat: Row['category']) => {
  if (cat === 'tax') return C.dim;
  if (cat === 'colocated') return C.warm;
  return C.muted;
};

export function Fig7LocalityPremium() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* legend */}
      <g transform={`translate(${PAD.left}, 28)`}>
        <rect width={11} height={11} fill={C.dim} opacity={0.7} />
        <text x={18} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          Pays the data-movement tax (von Neumann)
        </text>
        <rect x={266} width={11} height={11} fill={C.warm} />
        <text x={284} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          Compute and memory co-located
        </text>
        <rect
          x={490}
          width={11}
          height={11}
          fill="none"
          stroke={C.muted}
          strokeWidth={1}
          strokeDasharray="2 2"
        />
        <text x={508} y={10} fontFamily={FONT_MONO} fontSize={11} fill={C.dim}>
          Biological reference
        </text>
      </g>

      {/* x-axis ticks (log: 0.01, 0.1, 1, 10, 100, 1k, 10k) */}
      {[0.01, 0.1, 1, 10, 100, 1_000, 10_000].map((t) => (
        <g key={t}>
          <line
            x1={xScale(t)}
            x2={xScale(t)}
            y1={PAD.top}
            y2={H - PAD.bottom + 6}
            stroke={C.grid}
            strokeWidth={1}
          />
          <text
            x={xScale(t)}
            y={H - PAD.bottom + 24}
            textAnchor="middle"
            fill={C.muted}
            fontFamily={FONT_MONO}
            fontSize={11}
          >
            {t < 1 ? t : t < 1000 ? t : t === 1000 ? '1k' : '10k'}
          </text>
        </g>
      ))}

      {data.map((d, i) => {
        const y = PAD.top + i * ROW_H + ROW_H / 2;
        const barH = 26;
        const barW = xScale(d.value) - PAD.left;
        const fill = colorFor(d.category);
        const isBio = d.category === 'biological';
        return (
          <g key={i}>
            {/* row labels */}
            <text
              x={PAD.left - 22}
              y={y - 2}
              textAnchor="end"
              fontFamily={FONT_SANS}
              fontSize={14}
              fontWeight={500}
              fill={C.text}
            >
              {d.label}
            </text>
            <text
              x={PAD.left - 22}
              y={y + 16}
              textAnchor="end"
              fontFamily={FONT_SERIF}
              fontStyle="italic"
              fontSize={12}
              fill={C.muted}
            >
              {d.sub}
            </text>

            {/* bar */}
            {isBio ? (
              <rect
                x={PAD.left}
                y={y - barH / 2}
                width={Math.max(barW, 4)}
                height={barH}
                fill="none"
                stroke={C.muted}
                strokeWidth={1.2}
                strokeDasharray="3 3"
              />
            ) : (
              <rect
                x={PAD.left}
                y={y - barH / 2}
                width={Math.max(barW, 4)}
                height={barH}
                fill={fill}
                opacity={d.category === 'tax' ? 0.65 : 0.9}
              />
            )}

            {/* value label at bar end */}
            <text
              x={PAD.left + barW + 14}
              y={y - 2}
              fontFamily={FONT_MONO}
              fontSize={14}
              fontWeight={700}
              fill={fill}
            >
              {d.display}
            </text>
            <text
              x={PAD.left + barW + 14}
              y={y + 14}
              fontFamily={FONT_MONO}
              fontSize={11}
              fill={C.muted}
            >
              TOPS/W
            </text>
          </g>
        );
      })}

      {/* x-axis baseline */}
      <line
        x1={PAD.left}
        x2={W - PAD.right}
        y1={H - PAD.bottom + 4}
        y2={H - PAD.bottom + 4}
        stroke={C.hairline}
        strokeWidth={1}
      />
      <text
        x={(PAD.left + W - PAD.right) / 2}
        y={H - 24}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        TOPS/W (log scale)
      </text>
    </svg>
  );
}
