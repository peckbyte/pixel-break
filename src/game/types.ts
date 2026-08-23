export type Screen =
  | "title"
  | "select"
  | "howto"
  | "settings"
  | "playing"
  | "paused"
  | "clear"
  | "over";

export type BrickKind =
  | "normal"
  | "hard"
  | "steel"
  | "bomb"
  | "gold"
  | "power"
  | "zap"
  | "fire"
  | "ice";

export type PowerId =
  | "expand"
  | "shrink"
  | "multi"
  | "slow"
  | "fast"
  | "sticky"
  | "laser"
  | "life"
  | "fire"
  | "shield"
  | "bomb"
  | "score";

export type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  kind: BrickKind;
  color: string;
  alive: boolean;
  moving: boolean;
  vx: number;
  minX: number;
  maxX: number;
  flash: number;
  spawn: number;
};

export type Ball = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  r: number;
  stuck: boolean;
  stuckOff: number;
  fire: number;
  trail: number;
};

export type Drop = {
  x: number;
  y: number;
  id: PowerId;
  alive: boolean;
  rot: number;
};

export type Laser = {
  x: number;
  y: number;
  alive: boolean;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  g: number;
  alive: boolean;
};

export type Floater = {
  x: number;
  y: number;
  text: string;
  life: number;
  max: number;
  color: string;
  icon?: PowerId;
};

export type Bolt = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  max: number;
};

export type ActivePower = {
  id: PowerId;
  t: number;
};

export type OverlaySnap = {
  screen: Screen;
  score: number;
  high: number;
  lives: number;
  level: number;
  levelName: string;
  combo: number;
  unlocked: number;
  sfx: boolean;
  music: boolean;
  shake: boolean;
};
