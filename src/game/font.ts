/** 5×7 bitmap glyphs for HUD. Bits are left-to-right in the low 5 bits. */
const G: Record<string, number[]> = {
  "0": [14, 17, 19, 21, 25, 17, 14],
  "1": [4, 12, 4, 4, 4, 4, 14],
  "2": [14, 17, 1, 2, 4, 8, 31],
  "3": [14, 17, 1, 6, 1, 17, 14],
  "4": [2, 6, 10, 18, 31, 2, 2],
  "5": [31, 16, 30, 1, 1, 17, 14],
  "6": [6, 8, 16, 30, 17, 17, 14],
  "7": [31, 1, 2, 4, 8, 8, 8],
  "8": [14, 17, 17, 14, 17, 17, 14],
  "9": [14, 17, 17, 15, 1, 2, 12],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  F: [31, 16, 16, 30, 16, 16, 16],
  G: [14, 17, 16, 19, 17, 17, 14],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  K: [17, 18, 20, 24, 20, 18, 17],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [14, 17, 16, 14, 1, 17, 14],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  V: [17, 17, 17, 17, 17, 10, 4],
  W: [17, 17, 17, 21, 21, 21, 10],
  X: [17, 17, 10, 4, 10, 17, 17],
  Y: [17, 17, 10, 4, 4, 4, 4],
  Z: [31, 1, 2, 4, 8, 16, 31],
  " ": [0, 0, 0, 0, 0, 0, 0],
  ":": [0, 4, 4, 0, 4, 4, 0],
  "+": [0, 4, 4, 31, 4, 4, 0],
  x: [0, 17, 10, 4, 10, 17, 0],
  "-": [0, 0, 0, 14, 0, 0, 0],
  "!": [4, 4, 4, 4, 4, 0, 4],
  "/": [1, 1, 2, 4, 8, 16, 16],
};

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  scale = 1,
  align: "left" | "center" | "right" = "left",
) {
  const s = text.toUpperCase();
  const gw = 6 * scale;
  const width = s.length * gw - scale;
  let cx = x;
  if (align === "center") cx = Math.round(x - width / 2);
  if (align === "right") cx = Math.round(x - width);
  ctx.fillStyle = color;
  for (let i = 0; i < s.length; i++) {
    const glyph = G[s[i]!] ?? G[" "]!;
    for (let row = 0; row < 7; row++) {
      const bits = glyph[row]!;
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << (4 - col))) {
          ctx.fillRect(cx + col * scale, y + row * scale, scale, scale);
        }
      }
    }
    cx += gw;
  }
}

export function textWidth(text: string, scale = 1) {
  return text.length * 6 * scale - scale;
}
