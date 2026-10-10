// Lightning for the storm effect: occasional strikes, each a jagged bolt plus
// a dim full-screen flash that decays quickly, sometimes with one re-flash.
//
// Photosensitivity: strikes are ≥ MIN_INTERVAL s apart and produce at most two
// flashes, well under WCAG 2.3.1's three-flashes-per-second limit, and the
// full-screen flash is capped at MAX_FLASH_ALPHA.

import type { Scene } from "./canvasScene";

export const MIN_INTERVAL = 4; // s between strikes
export const MAX_INTERVAL = 10;
export const MAX_FLASH_ALPHA = 0.3;
export const MAX_BOLT_POINTS = 24;
const FLASH_DECAY = 6; // per s (exponential)
const BOLT_DECAY = 4;
const REFLASH_CHANCE = 0.6;
const BOLT_COLOR = "rgb(235,240,255)";

export interface LightningState {
  untilNextStrike: number; // s
  untilReflash: number; // s; ≤ 0 = none pending
  flash: number; // 0–1
  boltAlpha: number; // 0–1
  bolt: Float32Array; // x, y pairs
  boltPoints: number; // pairs in use
}

const nextInterval = (rng: () => number) => MIN_INTERVAL + rng() * (MAX_INTERVAL - MIN_INTERVAL);

export function createLightning(rng: () => number): LightningState {
  return {
    untilNextStrike: 1.5 + rng() * 2.5, // first strike comes a little sooner
    untilReflash: 0,
    flash: 0,
    boltAlpha: 0,
    bolt: new Float32Array(MAX_BOLT_POINTS * 2),
    boltPoints: 0,
  };
}

/** Writes a jagged top-to-middle bolt into `out`; returns the number of points. */
export function generateBolt(out: Float32Array, width: number, height: number, rng: () => number): number {
  const points = Math.min(12 + Math.floor(rng() * 9), MAX_BOLT_POINTS, out.length / 2);
  const bottom = height * (0.45 + rng() * 0.35);
  let x = width * (0.15 + rng() * 0.7);
  for (let i = 0; i < points; i++) {
    out[i * 2] = x;
    out[i * 2 + 1] = (bottom * i) / (points - 1);
    x += (rng() - 0.5) * width * 0.05;
  }
  return points;
}

export function strike(state: LightningState, width: number, height: number, rng: () => number): void {
  state.flash = 1;
  state.boltAlpha = 1;
  state.boltPoints = generateBolt(state.bolt, width, height, rng);
  state.untilReflash = rng() < REFLASH_CHANCE ? 0.08 + rng() * 0.1 : 0;
}

/** Decays the current flash/bolt and fires new strikes on schedule. Mutates in place. */
export function updateLightning(state: LightningState, dt: number, width: number, height: number, rng: () => number): void {
  state.flash *= Math.exp(-FLASH_DECAY * dt);
  state.boltAlpha *= Math.exp(-BOLT_DECAY * dt);

  if (state.untilReflash > 0) {
    state.untilReflash -= dt;
    if (state.untilReflash <= 0) {
      state.flash = Math.max(state.flash, 0.6);
      state.boltAlpha = Math.max(state.boltAlpha, 0.7);
    }
  }

  state.untilNextStrike -= dt;
  if (state.untilNextStrike <= 0) {
    strike(state, width, height, rng);
    state.untilNextStrike = nextInterval(rng);
  }
}

export function createLightningScene(rng: () => number = Math.random): Scene {
  let width = 0;
  let height = 0;
  const state = createLightning(rng);

  return {
    resize(w, h) {
      width = w;
      height = h;
    },

    update(dt) {
      updateLightning(state, dt, width, height, rng);
    },

    draw(ctx) {
      if (state.flash < 0.01 && state.boltAlpha < 0.01) return;
      ctx.save();

      ctx.fillStyle = BOLT_COLOR;
      ctx.globalAlpha = state.flash * MAX_FLASH_ALPHA;
      ctx.fillRect(0, 0, width, height);

      if (state.boltPoints > 1) {
        ctx.strokeStyle = BOLT_COLOR;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(state.bolt[0], state.bolt[1]);
        for (let i = 1; i < state.boltPoints; i++) ctx.lineTo(state.bolt[i * 2], state.bolt[i * 2 + 1]);
        // Wide faint halo, then a bright core, from the same path.
        ctx.globalAlpha = state.boltAlpha * 0.25;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.globalAlpha = state.boltAlpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}
