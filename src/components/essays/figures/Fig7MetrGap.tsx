import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

const W = 1040;
const H = 480;
const PAD = { top: 80, right: 280, bottom: 100, left: 100 };
const PLOT_H = H - PAD.top - PAD.bottom;
const PLOT_W = W - PAD.left - PAD.right;

const Y_MIN = -30, Y_MAX = 30;
const yScale = (v: number) => PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;
const ZERO_Y = yScale(0);

type Bar = { label: string; sub: string[]; value: number; display: string; accent?: boolean };
const bars: Bar[] = [
  { label: 'Developers', sub: ['expected', '(pre-study)'], value: 24, display: '+24%' },
  { label: 'Developers', sub: ['self-reported', '(post-study)'], value: 20, display: '+20%' },
  { label: 'Actual', sub: ['measured', '(RCT)'], value: -19, display: '−19%', accent: true },
];

const COL_W = PLOT_W / bars.length;
const BAR_W = 120;

export function Fig7MetrGap() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* eyebrow */}
      <text
        x={PAD.left}
        y={36}
        fontFamily={FONT_MONO}
        fontSize={11}
        fontWeight={600}
        fill={C.muted}
        letterSpacing="0.18em"
      >
        METR RCT · JULY 2025
      </text>
      <text x={PAD.left} y={56} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={12} fill={C.dim}>
        16 experienced open-source developers, ≥5 years on the codebase
      </text>

      {/* y grid */}
      {[-25, 0, 25].map((t) => (
        <g key={t}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke={t === 0 ? `${C.text}40` : C.grid}
            strokeWidth={1}
          />
          <text
            x={PAD.left - 14}
            y={yScale(t) + 5}
            textAnchor="end"
            fontFamily={FONT_MONO}
            fontSize={12}
            fill={C.muted}
          >
            {t > 0 ? `+${t}%` : t === 0 ? '0%' : `${t}%`}
          </text>
        </g>
      ))}

      {/* bars */}
      {bars.map((b, i) => {
        const cx = PAD.left + i * COL_W + COL_W / 2;
        const x = cx - BAR_W / 2;
        const top = b.value > 0 ? yScale(b.value) : ZERO_Y;
        const bottom = b.value > 0 ? ZERO_Y : yScale(b.value);
        const h = bottom - top;
        const fill = b.accent ? C.warm : C.dim;
        return (
          <g key={i}>
            <rect x={x} y={top} width={BAR_W} height={h} fill={fill} opacity={b.accent ? 0.95 : 0.7} />
            <text
              x={cx}
              y={b.value > 0 ? top - 14 : bottom + 28}
              textAnchor="middle"
              fontFamily={FONT_SANS}
              fontSize={26}
              fontWeight={700}
              fill={b.accent ? C.warm : C.text}
            >
              {b.display}
            </text>
            <text
              x={cx}
              y={H - PAD.bottom + 30}
              textAnchor="middle"
              fontFamily={FONT_SANS}
              fontSize={13.5}
              fontWeight={500}
              fill={C.text}
            >
              {b.label}
            </text>
            {b.sub.map((l, k) => (
              <text
                key={k}
                x={cx}
                y={H - PAD.bottom + 50 + k * 15}
                textAnchor="middle"
                fontFamily={FONT_SERIF}
                fontStyle="italic"
                fontSize={12}
                fill={C.muted}
              >
                {l}
              </text>
            ))}
          </g>
        );
      })}

      {/* annotation */}
      <text x={W - PAD.right + 24} y={yScale(-12)} fontFamily={FONT_SANS} fontSize={13} fontWeight={600} fill={C.warm}>
        the gap the
      </text>
      <text x={W - PAD.right + 24} y={yScale(-12) + 18} fontFamily={FONT_SANS} fontSize={13} fontWeight={600} fill={C.warm}>
        developers couldn't see
      </text>
      <path
        d={`M ${W - PAD.right + 22} ${yScale(-12) + 8} Q ${W - PAD.right - 30} ${yScale(-14)} ${
          PAD.left + 2 * COL_W + COL_W / 2 + BAR_W / 2 + 6
        } ${yScale(-14)}`}
        stroke={C.warm}
        strokeWidth={1.2}
        fill="none"
      />
    </svg>
  );
}
