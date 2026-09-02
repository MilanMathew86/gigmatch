import type { TimelinePoint } from "@/lib/simulation/types";

const WIDTH = 640;
const HEIGHT = 200;
const PAD_L = 34;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 24;

export function TimelineChart({
  timeline,
  entryRound,
  totalRounds,
  strokeColor = "var(--color-brand)",
  fillColor = "var(--color-brand-tint)",
}: {
  timeline: TimelinePoint[];
  entryRound: number;
  totalRounds: number;
  strokeColor?: string;
  fillColor?: string;
}) {
  const innerW = WIDTH - PAD_L - PAD_R;
  const innerH = HEIGHT - PAD_T - PAD_B;

  const x = (round: number) => PAD_L + (round / totalRounds) * innerW;
  const y = (share: number) => PAD_T + innerH - share * innerH;

  const linePoints = timeline.map((p) => `${x(p.round).toFixed(1)},${y(p.newShareInWindow).toFixed(1)}`).join(" ");
  const areaPoints = `${x(timeline[0]?.round ?? 0).toFixed(1)},${y(0).toFixed(1)} ${linePoints} ${x(
    timeline[timeline.length - 1]?.round ?? totalRounds
  ).toFixed(1)},${y(0).toFixed(1)}`;

  const entryX = x(entryRound);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="New-provider match share over time">
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={PAD_L} x2={WIDTH - PAD_R} y1={y(g)} y2={y(g)} stroke="var(--color-border)" strokeWidth={1} />
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <text key={g} x={PAD_L - 8} y={y(g) + 3} textAnchor="end" fontSize={9} fill="var(--color-ink-faint)">
          {Math.round(g * 100)}%
        </text>
      ))}

      {/* entry marker */}
      <line x1={entryX} x2={entryX} y1={PAD_T} y2={HEIGHT - PAD_B} stroke="var(--color-accent)" strokeDasharray="3 3" strokeWidth={1.25} />
      <text x={entryX + 4} y={PAD_T + 10} fontSize={9.5} fontWeight={600} fill="var(--color-accent-hover)">
        New providers enter
      </text>

      {/* area + line */}
      <polygon points={areaPoints} fill={fillColor} opacity={0.6} />
      <polyline points={linePoints} fill="none" stroke={strokeColor} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* x axis labels */}
      <text x={PAD_L} y={HEIGHT - 6} fontSize={9} fill="var(--color-ink-faint)">
        Round 0
      </text>
      <text x={WIDTH - PAD_R} y={HEIGHT - 6} textAnchor="end" fontSize={9} fill="var(--color-ink-faint)">
        Round {totalRounds}
      </text>
    </svg>
  );
}
