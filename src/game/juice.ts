import type { Bolt, Floater, Particle, PowerId } from "./types";

const POOL = 420;

export class Juice {
  particles: Particle[] = [];
  floaters: Floater[] = [];
  bolts: Bolt[] = [];
  trauma = 0;
  hitstop = 0;
  flash = 0;
  kick = 0;
  private cursor = 0;
  reduced = false;

  constructor() {
    for (let i = 0; i < POOL; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        max: 1,
        size: 1,
        color: "#fff",
        g: 0,
        alive: false,
      });
    }
  }

  reset() {
    for (const p of this.particles) p.alive = false;
    this.floaters.length = 0;
    this.bolts.length = 0;
    this.trauma = 0;
    this.hitstop = 0;
    this.flash = 0;
    this.kick = 0;
  }

  addTrauma(v: number) {
    if (this.reduced) return;
    this.trauma = Math.min(1, this.trauma + v);
  }

  freeze(sec: number) {
    if (this.reduced) return;
    this.hitstop = Math.max(this.hitstop, sec);
  }

  burst(x: number, y: number, color: string, n = 10, speed = 70) {
    for (let i = 0; i < n; i++) {
      const p = this.alloc();
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.35 + Math.random());
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * s;
      p.vy = Math.sin(a) * s - 20;
      p.life = 0.28 + Math.random() * 0.35;
      p.max = p.life;
      p.size = 1 + (Math.random() < 0.35 ? 1 : 0);
      p.color = color;
      p.g = 180;
      p.alive = true;
    }
  }

  spark(x: number, y: number, nx: number, ny: number, color: string) {
    for (let i = 0; i < 6; i++) {
      const p = this.alloc();
      const spread = (Math.random() - 0.5) * 1.2;
      p.x = x;
      p.y = y;
      p.vx = nx * 80 + ny * spread * 60;
      p.vy = ny * 80 + nx * spread * 60;
      p.life = 0.18 + Math.random() * 0.12;
      p.max = p.life;
      p.size = 1;
      p.color = color;
      p.g = 40;
      p.alive = true;
    }
  }

  confetti(cx: number, cy: number) {
    const colors = ["#c45c4c", "#3cb8b0", "#d4b45c", "#c8d0dc", "#5cba7a", "#4a88c8"];
    for (let i = 0; i < 48; i++) {
      const p = this.alloc();
      p.x = cx + (Math.random() - 0.5) * 80;
      p.y = cy;
      p.vx = (Math.random() - 0.5) * 140;
      p.vy = -40 - Math.random() * 120;
      p.life = 0.8 + Math.random() * 0.6;
      p.max = p.life;
      p.size = 1 + (Math.random() < 0.5 ? 1 : 0);
      p.color = colors[i % colors.length]!;
      p.g = 220;
      p.alive = true;
    }
  }

  float(x: number, y: number, text: string, color: string) {
    this.floaters.push({ x, y, text, life: 0.7, max: 0.7, color });
  }

  floatIcon(x: number, y: number, icon: PowerId, color: string) {
    this.floaters.push({ x, y, text: "", life: 0.85, max: 0.85, color, icon });
  }

  bolt(x1: number, y1: number, x2: number, y2: number) {
    this.bolts.push({ x1, y1, x2, y2, life: 0.2, max: 0.2 });
    this.spark(x2, y2, 0, -1, "#f4e4a0");
  }

  update(dt: number) {
    if (this.hitstop > 0) this.hitstop = Math.max(0, this.hitstop - dt);
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    this.flash = Math.max(0, this.flash - dt * 4);
    this.kick = Math.max(0, this.kick - dt * 3.2);
    const sim = this.hitstop > 0 ? 0 : dt;
    if (sim <= 0) {
      // particles still tick a little during freeze
    }
    const pdt = dt;
    for (const p of this.particles) {
      if (!p.alive) continue;
      p.life -= pdt;
      if (p.life <= 0) {
        p.alive = false;
        continue;
      }
      p.vy += p.g * pdt;
      p.x += p.vx * pdt;
      p.y += p.vy * pdt;
    }
    for (let i = this.floaters.length - 1; i >= 0; i--) {
      const f = this.floaters[i]!;
      f.life -= dt;
      f.y -= 18 * dt;
      if (f.life <= 0) this.floaters.splice(i, 1);
    }
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i]!;
      b.life -= dt;
      if (b.life <= 0) this.bolts.splice(i, 1);
    }
  }

  offset(): { x: number; y: number } {
    if (this.reduced || this.trauma <= 0) return { x: 0, y: 0 };
    const s = this.trauma * this.trauma;
    return {
      x: (Math.random() * 2 - 1) * s * 5,
      y: (Math.random() * 2 - 1) * s * 4,
    };
  }

  private alloc(): Particle {
    for (let n = 0; n < POOL; n++) {
      const p = this.particles[this.cursor]!;
      this.cursor = (this.cursor + 1) % POOL;
      if (!p.alive) return p;
    }
    return this.particles[this.cursor]!;
  }
}
