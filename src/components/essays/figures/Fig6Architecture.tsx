import { C, FONT_MONO, FONT_SANS, FONT_SERIF } from './theme';

const W = 1080;
const H = 720;

type Box = { x: number; y: number; w: number; h: number; label: string; sub?: string; muted?: boolean };

const TOP_Y = 200;
const TOP_H = 72;
const SUB_Y = 380;
const SUB_H = 64;

const boxes: Box[] = [
  { x: 40, y: TOP_Y, w: 130, h: TOP_H, label: 'tokens', sub: 'x₁:T', muted: true },
  { x: 200, y: TOP_Y, w: 130, h: TOP_H, label: 'Prelude', sub: 'P' },
  { x: 360, y: TOP_Y, w: 180, h: TOP_H, label: 'Recurrent', sub: 'block R_θ' },
  { x: 580, y: TOP_Y, w: 180, h: TOP_H, label: 'fast-weight', sub: 'M_t,  eq. 5' },
  { x: 800, y: TOP_Y, w: 130, h: TOP_H, label: 'Coda', sub: 'C' },
  { x: 960, y: TOP_Y, w: 90, h: TOP_H, label: 'output', sub: 'ŷ', muted: true },
];

const subBoxes: Box[] = [
  { x: 360, y: SUB_Y, w: 180, h: SUB_H, label: 'state S_t,  eq. 4' },
  { x: 580, y: SUB_Y, w: 180, h: SUB_H, label: 'policy ρ(e_i),  eq. 6' },
];

// LOOP fully encloses Recurrent + fast-weight + state + policy
const LOOP = { x: 346, y: 130, w: 416, h: 330 };

// Loop arrow apex stays well inside LOOP region
const APEX_Y = 162;
const recCx = boxes[2].x + boxes[2].w / 2;
const fwCx = boxes[3].x + boxes[3].w / 2;

function Node({ b }: { b: Box }) {
  const fill = b.muted ? `${C.muted}22` : C.surface;
  const stroke = b.muted ? C.muted : C.text;
  return (
    <g>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={fill} stroke={stroke} strokeWidth={1.2} rx={3} />
      <text
        x={b.x + b.w / 2}
        y={b.y + b.h / 2 - (b.sub ? 6 : -5)}
        textAnchor="middle"
        fontFamily={FONT_SANS}
        fontSize={14}
        fontWeight={600}
        fill={C.text}
      >
        {b.label}
      </text>
      {b.sub && (
        <text
          x={b.x + b.w / 2}
          y={b.y + b.h / 2 + 16}
          textAnchor="middle"
          fontFamily={FONT_SERIF}
          fontStyle="italic"
          fontSize={13}
          fill={C.dim}
        >
          {b.sub}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1, y1, x2, y2, color = C.dim, strokeWidth = 1.4,
}: {
  x1: number; y1: number; x2: number; y2: number; color?: string; strokeWidth?: number;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 9;
  const ax = x2 - headLen * Math.cos(angle - 0.45);
  const ay = y2 - headLen * Math.sin(angle - 0.45);
  const bx = x2 - headLen * Math.cos(angle + 0.45);
  const by = y2 - headLen * Math.sin(angle + 0.45);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d={`M ${x2} ${y2} L ${ax} ${ay} L ${bx} ${by} Z`} fill={color} />
    </g>
  );
}

export function Fig6Architecture() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {/* loop region — encloses all four inner boxes */}
      <rect
        x={LOOP.x}
        y={LOOP.y}
        width={LOOP.w}
        height={LOOP.h}
        fill={`${C.warm}10`}
        stroke={C.warm}
        strokeWidth={1.4}
        strokeDasharray="6 4"
        rx={6}
      />
      {/* "closed loop in latent space" header sits above LOOP */}
      <text
        x={LOOP.x + LOOP.w / 2}
        y={LOOP.y - 14}
        textAnchor="middle"
        fontFamily={FONT_SANS}
        fontSize={13.5}
        fontWeight={600}
        fill={C.warm}
      >
        closed loop in latent space
      </text>

      {/* horizontal flow arrows (top row) */}
      {boxes.slice(0, -1).map((b, i) => {
        const next = boxes[i + 1];
        return (
          <Arrow
            key={i}
            x1={b.x + b.w}
            y1={b.y + b.h / 2}
            x2={next.x - 1}
            y2={next.y + b.h / 2}
            color={C.dim}
          />
        );
      })}

      {/* loop arrow: fast-weight → Recurrent, apex inside LOOP region */}
      <path
        d={`M ${fwCx} ${TOP_Y} C ${fwCx} ${APEX_Y}, ${recCx} ${APEX_Y}, ${recCx} ${TOP_Y - 6}`}
        stroke={C.warm}
        strokeWidth={1.8}
        fill="none"
      />
      {/* arrowhead at the Recurrent end */}
      <path
        d={`M ${recCx} ${TOP_Y - 6} l -6 -10 l 12 0 z`}
        fill={C.warm}
      />
      {/* "loop k → k+1" label, just above arrow apex, inside LOOP */}
      <text
        x={(recCx + fwCx) / 2}
        y={APEX_Y - 12}
        textAnchor="middle"
        fontFamily={FONT_SERIF}
        fontStyle="italic"
        fontSize={12.5}
        fill={C.warm}
      >
        loop k → k+1
      </text>

      {/* nodes */}
      {boxes.map((b, i) => (
        <Node key={i} b={b} />
      ))}
      {subBoxes.map((b, i) => (
        <Node key={`s${i}`} b={b} />
      ))}

      {/* down arrows from Recurrent / fast-weight to state / policy */}
      {[2, 3].map((idx) => {
        const top = boxes[idx];
        const sub = subBoxes[idx - 2];
        return (
          <Arrow
            key={idx}
            x1={top.x + top.w / 2}
            y1={top.y + top.h}
            x2={sub.x + sub.w / 2}
            y2={sub.y - 1}
            color={C.dim}
          />
        );
      })}

      {/* externalized assemblage callout */}
      <g transform={`translate(0, ${H - 200})`}>
        <rect
          x={140}
          y={0}
          width={W - 280}
          height={160}
          fill="none"
          stroke={C.muted}
          strokeWidth={1}
          strokeDasharray="6 4"
          rx={5}
        />
        <text x={170} y={36} fontFamily={FONT_SANS} fontSize={14} fontWeight={600} fill={C.text}>
          the externalized assemblage
        </text>
        <text x={380} y={36} fontFamily={FONT_SANS} fontSize={13.5} fill={C.dim}>
          · what CLA replaces
        </text>
        <text x={170} y={76} fontFamily={FONT_MONO} fontSize={12.5} fill={C.dim}>
          interpreter / retriever / filesystem / browser / orchestration
        </text>
        <text x={170} y={114} fontFamily={FONT_SERIF} fontStyle="italic" fontSize={12.5} fill={C.muted}>
          every arrow here is a serialization boundary
        </text>
        {/* X mark, top-right */}
        <g transform={`translate(${W - 220}, 28)`}>
          <circle cx={16} cy={16} r={16} fill="none" stroke={C.warm} strokeWidth={1.4} />
          <line x1={7} y1={7} x2={25} y2={25} stroke={C.warm} strokeWidth={1.4} />
          <line x1={25} y1={7} x2={7} y2={25} stroke={C.warm} strokeWidth={1.4} />
        </g>
      </g>
    </svg>
  );
}
