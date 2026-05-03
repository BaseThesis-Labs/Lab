import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

type Row = {
  name: string;
  bench: string;
  alone: number;
  withTools: number;
  accent?: boolean;
};

const data: Row[] = [
  { name: 'Claude Opus 4.7', bench: 'CharXiv', alone: 82.1, withTools: 91.0, accent: true },
  { name: 'Claude Mythos Preview', bench: 'HLE', alone: 56.8, withTools: 64.7 },
  { name: 'Claude Opus 4.7', bench: 'HLE', alone: 46.9, withTools: 54.7 },
  { name: 'Gemini 3 Pro + Poetiq', bench: 'ARC-AGI-2', alone: 31.0, withTools: 54.0, accent: true },
  { name: 'GPT-5.5', bench: 'HLE', alone: 44.4, withTools: 52.2 },
  { name: 'Gemini 3.1 Pro', bench: 'HLE', alone: 41.4, withTools: 51.4 },
];

const W = 1040;
const H = 560;
const PAD = { top: 84, right: 320, bottom: 44, left: 80 };
const PLOT_W = W - PAD.left - PAD.right; // 640
const PLOT_H = H - PAD.top - PAD.bottom; // 432

const xLeft = PAD.left + 80;       // 160
const xRight = PAD.left + PLOT_W - 50; // 670
const labelX = xRight + 40;
const yScale = (v: number) => PAD.top + (1 - v / 100) * PLOT_H;

function layoutLabels(values: number[], minGap: number) {
  const indexed = values.map((v, i) => ({ v, i, y: yScale(v) }));
  indexed.sort((a, b) => a.y - b.y);
  for (let i = 1; i < indexed.length; i++) {
    if (indexed[i].y - indexed[i - 1].y < minGap) {
      indexed[i].y = indexed[i - 1].y + minGap;
    }
  }
  const out = new Array(values.length);
  for (const item of indexed) out[item.i] = item.y;
  return out as number[];
}

function leaderPath(dotX: number, dotY: number, labelX: number, labelY: number) {
  const dir = Math.sign(labelX - dotX) || 1;
  const startX = dotX + 6 * dir;
  const elbowX = labelX - 12 * dir;
  const endX = labelX - 2 * dir;
  return `M ${startX} ${dotY} L ${elbowX} ${dotY} L ${elbowX} ${labelY} L ${endX} ${labelY}`;
}

export function Fig1AssemblagePremium() {
  const rightYs = layoutLabels(data.map((d) => d.withTools), 38);
  const leftYs = layoutLabels(data.map((d) => d.alone), 22);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* column headers */}
      <text
        x={xLeft}
        y={36}
        textAnchor="end"
        fill={C.text}
        fontFamily={FONT_MONO}
        fontSize={12}
        fontWeight={600}
        letterSpacing="0.18em"
      >
        MODEL ALONE
      </text>
      <text
        x={xLeft}
        y={56}
        textAnchor="end"
        fill={C.muted}
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
      >
        no tools, no thinking
      </text>

      <text
        x={xRight}
        y={36}
        textAnchor="start"
        fill={C.text}
        fontFamily={FONT_MONO}
        fontSize={12}
        fontWeight={600}
        letterSpacing="0.18em"
      >
        MODEL + ASSEMBLAGE
      </text>
      <text
        x={xRight}
        y={56}
        textAnchor="start"
        fill={C.muted}
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12}
      >
        tools + extended chain-of-thought
      </text>

      {/* divider hairline above plot */}
      <line x1={xLeft - 30} y1={68} x2={xRight + 30} y2={68} stroke={C.hairline} strokeWidth={1} />

      {/* y-grid */}
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke={C.grid}
            strokeWidth={1}
          />
          <text
            x={PAD.left - 14}
            y={yScale(tick) + 4}
            textAnchor="end"
            fill={C.muted}
            fontFamily={FONT_MONO}
            fontSize={11}
          >
            {tick}%
          </text>
        </g>
      ))}

      {/* slope lines */}
      {data.map((d, i) => {
        const color = d.accent ? C.warm : C.dim;
        const opacity = d.accent ? 1 : 0.7;
        const stroke = d.accent ? 2.2 : 1.4;
        return (
          <g key={i} opacity={opacity}>
            <line
              x1={xLeft}
              y1={yScale(d.alone)}
              x2={xRight}
              y2={yScale(d.withTools)}
              stroke={color}
              strokeWidth={stroke}
            />
            <circle cx={xLeft} cy={yScale(d.alone)} r={3.5} fill={color} />
            <circle cx={xRight} cy={yScale(d.withTools)} r={3.5} fill={color} />
          </g>
        );
      })}

      {/* left value labels */}
      {data.map((d, i) => {
        const color = d.accent ? C.warm : C.dim;
        const ny = yScale(d.alone);
        const ly = leftYs[i];
        return (
          <g key={`L${i}`}>
            {Math.abs(ly - ny) > 4 && (
              <path
                d={leaderPath(xLeft, ny, xLeft - 38, ly)}
                stroke={color}
                strokeWidth={0.8}
                fill="none"
                opacity={0.55}
              />
            )}
            <text
              x={xLeft - 38}
              y={ly + 4}
              textAnchor="end"
              fill={color}
              fontFamily={FONT_MONO}
              fontSize={12}
            >
              {d.alone.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* right composite labels */}
      {data.map((d, i) => {
        const color = d.accent ? C.warm : C.dim;
        const ny = yScale(d.withTools);
        const ly = rightYs[i];
        const fw = d.accent ? 600 : 500;
        return (
          <g key={`R${i}`}>
            {Math.abs(ly - ny) > 4 && (
              <path
                d={leaderPath(xRight, ny, labelX - 4, ly)}
                stroke={color}
                strokeWidth={0.8}
                fill="none"
                opacity={0.55}
              />
            )}
            <text
              x={labelX}
              y={ly + 4}
              textAnchor="start"
              fontFamily={FONT_SANS}
              fontSize={13.5}
              fontWeight={fw}
              fill={d.accent ? C.warm : C.text}
            >
              {d.name}
            </text>
            <text
              x={labelX}
              y={ly + 20}
              textAnchor="start"
              fontFamily={FONT_MONO}
              fontSize={11.5}
              fill={C.muted}
            >
              {d.bench} · {d.withTools.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
