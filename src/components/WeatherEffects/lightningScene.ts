// Lightning: random strikes with a short timer and fading intensity, jagged
// bolts (sometimes branched, sometimes a double strike), a faint full-screen
// flash, and a two-pass glow + white-hot core when drawing each segment.
// Units are frames at 60 fps (callers pass `frames = dtSeconds * 60`).
//
// Photosensitivity: after each strike ends there's a MIN_STRIKE_GAP cooldown,
// so there are at most two strikes (one double strike) in any second, under
// WCAG 2.3.1's three-flashes limit. The full-screen flash is ≤ 4% white.

export const STRIKE_CHANCE = 0.006; // per frame, at full lightning
export const DOUBLE_STRIKE_CHANCE = 0.4;
export const DOUBLE_STRIKE_DELAY = 0.08 * 60; // frames (80 ms)
export const MIN_STRIKE_GAP = 60; // frames
export const INTENSITY_FADE = 0.06; // per frame
export const BOLT_FADE = 0.12; // life per frame
export const BOLT_STEPS = 10;
export const MAX_FLASH_ALPHA = 0.04;
const STEP_JITTER = 30; // px
const GLOW_COLOR = "rgba(180,200,255,0.2)";
const CORE_COLOR = "rgba(255,255,255,1)";
const SHADOW_COLOR = "rgba(200,220,255,0.8)";

export type BoltPath = { points: Float32Array; widths: Float32Array }; // BOLT_STEPS + 1 points, BOLT_STEPS widths
export type Bolt = BoltPath & { branch: BoltPath | null; brightness: number; life: number };

export type Lightning = {
  active: boolean;
  timer: number; // frames left in this strike
  intensity: number; // 0–1
  cooldown: number; // frames until another strike may start
  doubleStrikeIn: number; // frames until a second bolt; ≤ 0 = none pending
  flash: boolean; // draw the full-screen flash this frame
  bolts: Bolt[];
};

export function createLightning(): Lightning {
  return { active: false, timer: 0, intensity: 0, cooldown: 0, doubleStrikeIn: 0, flash: false, bolts: [] };
}

/** Straight line from start to end in BOLT_STEPS steps, each point after the first jittered ±30px sideways. */
export function buildBoltPath(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  widthMult: number,
  rng: () => number,
): BoltPath {
  const points = new Float32Array((BOLT_STEPS + 1) * 2);
  const widths = new Float32Array(BOLT_STEPS);
  for (let i = 0; i <= BOLT_STEPS; i++) {
    const t = i / BOLT_STEPS;
    points[i * 2] = x0 + (x1 - x0) * t + (i === 0 ? 0 : (rng() * 2 - 1) * STEP_JITTER);
    points[i * 2 + 1] = y0 + (y1 - y0) * t;
    if (i < BOLT_STEPS) widths[i] = (rng() * 2 + 1) * widthMult;
  }
  return { points, widths };
}

/** A bolt from the top edge to 20–60% down, ±200px across; half the time with a branch from 60% along. */
export function createBolt(width: number, height: number, rng: () => number): Bolt {
  const startX = rng() * width;
  const path = buildBoltPath(startX, 0, startX + (rng() * 2 - 1) * 200, height * (0.2 + rng() * 0.4), 1, rng);

  let branch: BoltPath | null = null;
  if (rng() < 0.5) {
    const i = Math.round(BOLT_STEPS * 0.6);
    const bx = path.points[i * 2];
    const by = path.points[i * 2 + 1];
    branch = buildBoltPath(bx, by, bx + (rng() * 2 - 1) * 125, by + 50 + rng() * 150, 0.6, rng);
  }

  return { ...path, branch, brightness: 0.5 + rng() * 0.5, life: 1 };
}

/** Per-frame lightning step: maybe strike, run the timer, fade, age bolts. Mutates in place. */
export function updateLightning(
  state: Lightning,
  frames: number,
  frequency: number,
  width: number,
  height: number,
  rng: () => number = Math.random,
): void {
  state.cooldown -= frames;

  // 1. Maybe start a strike (per-frame chance, scaled for variable frame length).
  const chance = 1 - Math.pow(1 - STRIKE_CHANCE * Math.max(frequency, 0), frames);
  if (!state.active && state.cooldown <= 0 && frames > 0 && rng() < chance) {
    state.active = true;
    state.timer = rng() * 12 + 8;
    state.intensity = 1;
    state.bolts.push(createBolt(width, height, rng));
    state.doubleStrikeIn = rng() < DOUBLE_STRIKE_CHANCE ? DOUBLE_STRIKE_DELAY : 0;
  }

  if (state.doubleStrikeIn > 0) {
    state.doubleStrikeIn -= frames;
    if (state.doubleStrikeIn <= 0) state.bolts.push(createBolt(width, height, rng));
  }

  // 2. Count down and fade.
  if (state.active) {
    state.timer -= frames;
    state.intensity = Math.max(0, state.intensity - INTENSITY_FADE * frames);
    if (state.timer <= 0) {
      state.active = false;
      state.intensity = 0;
      state.cooldown = MIN_STRIKE_GAP;
    }
  }

  // 3. Occasional faint full-screen flash while bright.
  state.flash = state.active && state.intensity > 0.5 && rng() > 0.7;

  // Age bolts, dropping dead ones in place.
  let alive = 0;
  for (let i = 0; i < state.bolts.length; i++) {
    const bolt = state.bolts[i];
    bolt.life -= BOLT_FADE * frames;
    if (bolt.life > 0) state.bolts[alive++] = bolt;
  }
  state.bolts.length = alive;
}

export function drawFlash(ctx: CanvasRenderingContext2D, state: Lightning, width: number, height: number): void {
  if (!state.flash) return;
  ctx.globalAlpha = state.intensity * MAX_FLASH_ALPHA;
  ctx.fillStyle = CORE_COLOR;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
}

function strokePath(ctx: CanvasRenderingContext2D, { points, widths }: BoltPath): void {
  for (let i = 0; i < BOLT_STEPS; i++) {
    ctx.beginPath();
    ctx.moveTo(points[i * 2], points[i * 2 + 1]);
    ctx.lineTo(points[i * 2 + 2], points[i * 2 + 3]);
    ctx.strokeStyle = GLOW_COLOR; // outer glow
    ctx.lineWidth = widths[i] * 10;
    ctx.stroke();
    ctx.strokeStyle = CORE_COLOR; // white-hot core
    ctx.lineWidth = widths[i] * 1.5;
    ctx.stroke();
  }
}

export function drawBolts(ctx: CanvasRenderingContext2D, bolts: Bolt[]): void {
  if (bolts.length === 0) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.shadowBlur = 20;
  ctx.shadowColor = SHADOW_COLOR;
  for (let i = 0; i < bolts.length; i++) {
    const bolt = bolts[i];
    ctx.globalAlpha = Math.max(0, bolt.life) * bolt.brightness;
    strokePath(ctx, bolt);
    if (bolt.branch) strokePath(ctx, bolt.branch);
  }
  ctx.restore();
}
