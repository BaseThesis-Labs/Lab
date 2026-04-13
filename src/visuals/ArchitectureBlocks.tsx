interface Props {
  className?: string;
}

// Post-transformer block diagram: input stream → SSM/Attn hybrid → output.
export function ArchitectureBlocks({ className }: Props) {
  const W = 320;
  const H = 180;
  const rowY = 90;
  const blocks = [
    { x: 18, w: 40, label: 'x_t' },
    { x: 72, w: 56, label: 'SSM' },
    { x: 140, w: 56, label: 'ATTN' },
    { x: 208, w: 56, label: 'MLP' },
    { x: 276, w: 30, label: 'y_t' },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" className={className} aria-hidden>
      {/* grid rails */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line
          key={r}
          x1="0"
          x2={W}
          y1={H * r}
          y2={H * r}
          stroke="#EDEDED"
          strokeOpacity="0.05"
        />
      ))}

      {/* flow line with dashed animation */}
      <line
        x1="18"
        y1={rowY}
        x2={W - 14}
        y2={rowY}
        stroke="#E8D9BE"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="animate-dash-flow"
      />

      {/* depth stack — faded copies behind main row */}
      {[-16, -8, 0].map((dy, idx) => (
        <g key={idx} opacity={idx === 2 ? 1 : 0.18 + idx * 0.08}>
          {blocks.map((b) => (
            <g key={b.label}>
              <rect
                x={b.x}
                y={rowY - 16 + dy}
                width={b.w}
                height={32}
                fill="#0A0A0A"
                stroke={idx === 2 && (b.label === 'SSM' || b.label === 'ATTN') ? '#E8D9BE' : '#2A2A2A'}
                strokeOpacity={idx === 2 ? 1 : 0.6}
                rx={2}
              />
              {idx === 2 && (
                <text
                  x={b.x + b.w / 2}
                  y={rowY - 16 + dy + 20}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="10"
                  textAnchor="middle"
                  fill={b.label === 'SSM' || b.label === 'ATTN' ? '#E8D9BE' : '#EDEDED'}
                  opacity={b.label === 'SSM' || b.label === 'ATTN' ? 1 : 0.75}
                >
                  {b.label}
                </text>
              )}
            </g>
          ))}
        </g>
      ))}

      {/* annotation */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#737373">
        <text x="10" y={H - 14}>{`context=10⁶ · rank=128 · Δ=decoupled`}</text>
      </g>
    </svg>
  );
}
