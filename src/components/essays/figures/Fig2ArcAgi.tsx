import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

type Row = { label: string; value: number; display: string; positive?: boolean };

const data: Row[] = [
  { label: 'Humans (untrained baseline)', value: 100, display: '100%', positive: true },
  { label: 'Gemini 3.1 Pro', value: 0.51, display: '0.51%' },
  { label: 'Claude Opus 4.6', value: 0.25, display: '0.25%' },
  { label: 'GPT-5.4', value: 0.10, display: '0.10%' },
  { label: 'Grok 4.1', value: 0.05, display: '<0.1%' },
];

const W = 1040;
const ROW_H = 72;
const H = 80 + ROW_H * data.length + 70;
const PAD = { top: 50, right: 50, bottom: 60, left: 290 };
const PLOT_W = W - PAD.left - PAD.right;
const xScale = (v: number) => PAD.left + (v / 100) * PLOT_W;

export function Fig2ArcAgi() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* eyebrow */}
      <text
        x={PAD.left}
        y={26}
        fontFamily={FONT_MONO}
        fontSize={11}
        fontWeight={600}
        fill={C.muted}
        letterSpacing="0.18em"
      >
        ARC-AGI-3 · MARCH 25, 2026
      </text>
      <text
        x={PAD.left}
        y={42}
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.dim}
      >
        Untrained humans solve every environment. The four leading frontier models, run by their own vendors, score &lt; 1%.
      </text>

      {/* x-axis ticks */}
      {[0, 25, 50, 75, 100].map((t) => (
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
            {t}%
          </text>
        </g>
      ))}

      {data.map((d, i) => {
        const y = PAD.top + i * ROW_H + ROW_H / 2;
        const barH = 28;
        const visualVal = Math.max(d.value, 0.55);
        const barW = xScale(visualVal) - PAD.left;
        const fill = d.positive ? C.positive : C.warm;
        return (
          <g key={i}>
            <text
              x={PAD.left - 22}
              y={y + 5}
              textAnchor="end"
              fontFamily={FONT_SANS}
              fontSize={14}
              fontWeight={d.positive ? 500 : 500}
              fill={C.text}
            >
              {d.label}
            </text>
            <rect
              x={PAD.left}
              y={y - barH / 2}
              width={barW}
              height={barH}
              fill={fill}
              opacity={d.positive ? 0.92 : 0.88}
            />
            <text
              x={PAD.left + barW + 14}
              y={y + 5}
              textAnchor="start"
              fontFamily={FONT_MONO}
              fontSize={14}
              fontWeight={700}
              fill={fill}
            >
              {d.display}
            </text>
          </g>
        );
      })}

      {/* baseline */}
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
        y={H - 16}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        Pass rate (offline Kaggle, no external API calls during scoring)
      </text>
    </svg>
  );
}
