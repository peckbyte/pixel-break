export const VW = 240;
export const VH = 520;

export const STEP = 1 / 120;
export const MAX_FRAME_DT = 0.1;

export const HUD_H = 28;
export const WALL = 6;

export const COLS = 10;
export const BRICK_W = 21;
export const BRICK_H = 8;
export const BRICK_GAP = 2;
export const GRID_X = 8;
export const GRID_Y = 34;

export const PADDLE_Y = 468;
export const PADDLE_H = 7;
export const PADDLE_W = 48;
export const PADDLE_W_WIDE = 74;
export const PADDLE_W_NARROW = 28;

export const BALL_R = 3;
export const BALL_SPEED = 145;
export const BALL_SPEED_MAX = 280;

export const START_LIVES = 3;
export const MAX_LIVES = 7;
export const LEVEL_COUNT = 24;

export const DROP_W = 20;
export const DROP_H = 20;
export const DROP_SPEED = 62;

export const LASER_W = 2;
export const LASER_H = 8;
export const LASER_SPEED = 280;
export const LASER_COOLDOWN = 0.22;

export const PAL = {
  bg: "#07080c",
  bg2: "#0c0e14",
  wall: "#1a1e2a",
  wallHi: "#2c3344",
  hud: "#0a0c12",
  cream: "#f4f1ea",
  steel: "#c8d0dc",
  muted: "#8b90a0",
  dim: "#4a5160",
  teal: "#3cb8b0",
  tealHi: "#7ee0d4",
  brick: "#c45c4c",
  ok: "#5cba7a",
  gold: "#d4b45c",
  ball: "#fff8ee",
} as const;

export const BRICK_COLORS = [
  "#c45c4c",
  "#d4783c",
  "#d4b45c",
  "#5cba7a",
  "#3cb8b0",
  "#4a88c8",
  "#7a6cc0",
  "#c86aa0",
] as const;
