import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

type Row = {
  label: string;
  sub: string;
  value: number; // pass rate %
  display: string;
  cost: string;
  highlight?: 'human' | 'harness' | 'frontier' | 'baseline';
};

const data: Row[] = [
  {
    label: 'Untrained humans',
    sub: 'every problem solved',
    value: 100,
    display: '~100%',
    cost: '',
    highlight: 'human',
  },
  {
    label: 'Gemini 3 Pro + Poetiq harness',
    sub: 'open-source agentic harness',
    value: 54,
    display: '54%',
    cost: '$30.57 / task',
    highlight: 'harness',
  },
  {
    label: 'Gemini 3 Pro · alone',
    sub: 'single model, single call',
    value: 31,
    display: '31%',
    cost: '$0.81 / task',
    highlight: 'frontier',
  },
  {
    label: 'Multi-LLM AB-MCTS',
    sub: 'o4-mini + Gemini 2.5 Pro + DeepSeek-R1, joint search',
    value: 30,
    display: '30%',
    cost: 'multi-call',
  },
  {
    label: 'AB-MCTS · single model',
    sub: 'o4-mini, adaptive branching tree search',
    value: 27.5,
    display: '27.5%',
    cost: 'multi-call',
  },
  {
    label: 'Best single frontier model',
    sub: 'o4-mini, repeated sampling baseline',
    value: 23,
    display: '23%',
    cost: '~$0.40 / task',
    highlight: 'baseline',
  },
];

const W = 1040;
const ROW_H = 70;
const HEADER_H = 110;
const FOOTER_H = 110;
const H = HEADER_H + ROW_H * data.length + FOOTER_H;
const PAD = { right: 180, left: 360 };
const PLOT_W = W - PAD.left - PAD.right;
const xScale = (v: number) => PAD.left + (v / 100) * PLOT_W;

const colorFor = (h?: Row['highlight']) => {
  if (h === 'human') return C.positive;
  if (h === 'harness') return C.warm;
  return C.dim;
};

export function Fig8OrchestrationLadder() {
  // Indices for the +23 pp / 37x cost annotation: between Gemini 3 Pro + Poetiq (i=1) and Gemini 3 Pro alone (i=2)
  const harnessY = HEADER_H + 1 * ROW_H + ROW_H / 2;
  const aloneY = HEADER_H + 2 * ROW_H + ROW_H / 2;
  const annotationX = xScale(54) + 16; // just past the harness bar end

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* eyebrow */}
      <text
        x={PAD.left}
        y={32}
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        Frontier results, May 2026 · every system below the untrained-human baseline
      </text>

      {/* title */}
      <text
        x={PAD.left}
        y={62}
        fontFamily={FONT_SANS}
        fontSize={17}
        fontWeight={600}
        fill={C.warm}
      >
        How much does external orchestration buy on ARC-AGI-2?
      </text>

      {/* x-axis grid + ticks */}
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line
            x1={xScale(t)}
            x2={xScale(t)}
            y1={HEADER_H - 12}
            y2={H - FOOTER_H + 6}
            stroke={C.grid}
            strokeWidth={1}
          />
          <text
            x={xScale(t)}
            y={H - FOOTER_H + 24}
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
        const y = HEADER_H + i * ROW_H + ROW_H / 2;
        const barH = 30;
        const barW = xScale(d.value) - PAD.left;
        const fill = colorFor(d.highlight);
        return (
          <g key={i}>
            {/* row labels */}
            <text
              x={PAD.left - 22}
              y={y - 2}
              textAnchor="end"
              fontFamily={FONT_SANS}
              fontSize={13.5}
              fontWeight={d.highlight === 'human' ? 600 : 500}
              fill={d.highlight === 'human' ? C.positive : C.text}
            >
              {d.label}
            </text>
            <text
              x={PAD.left - 22}
              y={y + 16}
              textAnchor="end"
              fontFamily={FONT_SERIF}
              fontStyle="italic"
              fontSize={11.5}
              fill={C.muted}
            >
              {d.sub}
            </text>

            {/* bar */}
            <rect
              x={PAD.left}
              y={y - barH / 2}
              width={barW}
              height={barH}
              fill={fill}
              opacity={d.highlight === 'human' ? 0.92 : d.highlight === 'harness' ? 0.92 : 0.7}
            />

            {/* value */}
            <text
              x={PAD.left + barW + 14}
              y={y + 5}
              fontFamily={FONT_MONO}
              fontSize={14}
              fontWeight={700}
              fill={fill}
            >
              {d.display}
            </text>

            {/* cost label, far right */}
            {d.cost && (
              <text
                x={W - 30}
                y={y + 5}
                textAnchor="end"
                fontFamily={FONT_MONO}
                fontSize={11}
                fill={C.muted}
              >
                {d.cost}
              </text>
            )}
          </g>
        );
      })}

      {/* "+23 pp / 37x cost" annotation between Poetiq harness and Gemini 3 Pro alone */}
      <g>
        {/* small bracket between the two bars */}
        <line
          x1={xScale(31) + 4}
          y1={aloneY - 8}
          x2={xScale(54) + 4}
          y2={harnessY + 8}
          stroke={C.warm}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <rect
          x={annotationX + 6}
          y={(harnessY + aloneY) / 2 - 22}
          width={86}
          height={42}
          rx={3}
          fill={`${C.warm}15`}
          stroke={C.warm}
          strokeWidth={0.8}
        />
        <text
          x={annotationX + 49}
          y={(harnessY + aloneY) / 2 - 6}
          textAnchor="middle"
          fontFamily={FONT_MONO}
          fontSize={12}
          fontWeight={700}
          fill={C.warm}
        >
          +23 pp
        </text>
        <text
          x={annotationX + 49}
          y={(harnessY + aloneY) / 2 + 10}
          textAnchor="middle"
          fontFamily={FONT_MONO}
          fontSize={11}
          fill={C.warm}
        >
          37× cost
        </text>
      </g>

      {/* "46-point gap to untrained humans" annotation */}
      <text
        x={W - PAD.right + 20}
        y={H - FOOTER_H + 50}
        textAnchor="end"
        fontFamily={FONT_SANS}
        fontSize={12.5}
        fontWeight={600}
        fill={C.warm}
      >
        46-point gap to untrained humans
      </text>
      <text
        x={W - PAD.right + 20}
        y={H - FOOTER_H + 66}
        textAnchor="end"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={11.5}
        fill={C.muted}
      >
        (even with the strongest published scaffolding)
      </text>

      {/* axis label */}
      <text
        x={(PAD.left + W - PAD.right) / 2}
        y={H - FOOTER_H + 50}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
        fill={C.muted}
      >
        Pass rate on ARC-AGI-2
      </text>

      {/* sources */}
      <text
        x={PAD.left}
        y={H - 18}
        fontFamily={FONT_MONO}
        fontSize={10}
        fill={C.muted}
      >
        Sources: Sakana AI · Inoue et al., AB-MCTS, arXiv:2503.04412 (Mar 2025) · ARC Prize Foundation 2025 Technical Report
      </text>
    </svg>
  );
}
