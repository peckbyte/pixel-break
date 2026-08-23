export function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

export function circleAabb(
  cx: number,
  cy: number,
  r: number,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  const nx = clamp(cx, x, x + w);
  const ny = clamp(cy, y, y + h);
  const dx = cx - nx;
  const dy = cy - ny;
  return dx * dx + dy * dy <= r * r;
}

/** Resolve circle vs AABB. Returns hit + outward normal. */
export function resolveCircleAabb(
  cx: number,
  cy: number,
  r: number,
  x: number,
  y: number,
  w: number,
  h: number,
): { hit: boolean; nx: number; ny: number; px: number; py: number } {
  const nearestX = clamp(cx, x, x + w);
  const nearestY = clamp(cy, y, y + h);
  let dx = cx - nearestX;
  let dy = cy - nearestY;
  const d2 = dx * dx + dy * dy;
  if (d2 > r * r) return { hit: false, nx: 0, ny: 0, px: cx, py: cy };

  if (d2 < 1e-8) {
    const left = cx - x;
    const right = x + w - cx;
    const top = cy - y;
    const bot = y + h - cy;
    const m = Math.min(left, right, top, bot);
    if (m === left) return { hit: true, nx: -1, ny: 0, px: x - r, py: cy };
    if (m === right) return { hit: true, nx: 1, ny: 0, px: x + w + r, py: cy };
    if (m === top) return { hit: true, nx: 0, ny: -1, px: cx, py: y - r };
    return { hit: true, nx: 0, ny: 1, px: cx, py: y + h + r };
  }

  const d = Math.sqrt(d2);
  const nx = dx / d;
  const ny = dy / d;
  return { hit: true, nx, ny, px: nearestX + nx * r, py: nearestY + ny * r };
}

export function reflect(vx: number, vy: number, nx: number, ny: number): { vx: number; vy: number } {
  const dot = vx * nx + vy * ny;
  return { vx: vx - 2 * dot * nx, vy: vy - 2 * dot * ny };
}

export function paddleBounce(
  ballX: number,
  paddleX: number,
  paddleW: number,
  speed: number,
): { vx: number; vy: number } {
  const hit = clamp((ballX - (paddleX + paddleW / 2)) / (paddleW / 2), -0.95, 0.95);
  const angle = hit * 1.15; // ~66 deg
  const vx = Math.sin(angle) * speed;
  const vy = -Math.cos(angle) * speed;
  return { vx, vy };
}

export function keepUpward(vx: number, vy: number, speed: number): { vx: number; vy: number } {
  if (vy >= -20) {
    const a = Math.atan2(vy, vx);
    const clamped = clamp(a, -Math.PI * 0.85, -Math.PI * 0.15);
    return { vx: Math.cos(clamped) * speed, vy: Math.sin(clamped) * speed };
  }
  const s = Math.hypot(vx, vy) || 1;
  return { vx: (vx / s) * speed, vy: (vy / s) * speed };
}

export function normalizeSpeed(vx: number, vy: number, speed: number): { vx: number; vy: number } {
  const s = Math.hypot(vx, vy);
  if (s < 1e-4) return { vx: 0, vy: -speed };
  // prevent too-horizontal
  const ax = Math.abs(vx / s);
  if (ax > 0.95) {
    const signX = vx < 0 ? -1 : 1;
    const nx = 0.92 * signX;
    const ny = (vy < 0 ? -1 : 1) * Math.sqrt(1 - nx * nx);
    return { vx: nx * speed, vy: ny * speed };
  }
  return { vx: (vx / s) * speed, vy: (vy / s) * speed };
}
