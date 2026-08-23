import { ICON, POWER_COLOR, powerPixels } from "./powerIcons";
import type { PowerId } from "./types";

export function PowerIcon({
  id,
  size = 24,
}: {
  id: PowerId;
  size?: number;
}) {
  const pixels = powerPixels(id);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${ICON} ${ICON}`}
      shapeRendering="crispEdges"
      aria-hidden
      className="shrink-0"
      style={{ imageRendering: "pixelated" }}
    >
      <rect width={ICON} height={ICON} fill={POWER_COLOR[id]} />
      <rect x={1} y={1} width={ICON - 2} height={ICON - 2} fill="#0c0e14" />
      {pixels.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={1} height={1} fill={p.color} />
      ))}
    </svg>
  );
}
