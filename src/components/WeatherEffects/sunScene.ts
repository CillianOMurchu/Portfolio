// Sunny: a warm glow in the top-right corner that slowly breathes, with soft
// light rays rotating around it.

import type { Scene } from "./canvasScene";
import { createUnitGlow, fillGlow, type RGB } from "./paint";

export interface SunOptions {
  color: RGB;
  intensity: number; // opacity multiplier, 0–1
}

export interface SunState {
  time: number; // s
  rotation: number; // rad
}

export const RAY_COUNT = 12;
export const RAY_HALF_WIDTH = 0.07; // rad
export const ROTATION_SPEED = 0.04; // rad/s
export const PULSE_PERIOD = 6; // s
const TAU = Math.PI * 2;

// Unit-length ray tips, precomputed: [x1, y1, x2, y2] per ray (the base is the origin).
const RAY_TIPS = new Float32Array(RAY_COUNT * 4);
for (let i = 0; i < RAY_COUNT; i++) {
  const angle = (i * TAU) / RAY_COUNT;
  RAY_TIPS[i * 4] = Math.cos(angle - RAY_HALF_WIDTH);
  RAY_TIPS[i * 4 + 1] = Math.sin(angle - RAY_HALF_WIDTH);
  RAY_TIPS[i * 4 + 2] = Math.cos(angle + RAY_HALF_WIDTH);
  RAY_TIPS[i * 4 + 3] = Math.sin(angle + RAY_HALF_WIDTH);
}

export function updateSun(state: SunState, dt: number): void {
  state.time += dt;
  state.rotation = (state.rotation + ROTATION_SPEED * dt) % TAU;
}

/** Glow strength in [0.7, 1], breathing once per PULSE_PERIOD. */
export function sunPulse(time: number): number {
  return 0.85 + 0.15 * Math.sin((TAU * time) / PULSE_PERIOD);
}

/** Sun centre (top-right) and glow radius for a canvas size. */
export function sunLayout(width: number, height: number): { x: number; y: number; radius: number } {
  return { x: width * 0.85, y: height * 0.1, radius: Math.hypot(width, height) * 0.35 };
}

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

export function createSunScene({ color, intensity }: SunOptions): Scene {
  const state: SunState = { time: 0, rotation: 0 };
  let layout = { x: 0, y: 0, radius: 0 };
  let glow: CanvasGradient | null = null;
  let rays: CanvasGradient | null = null;

  return {
    resize(width, height, ctx) {
      layout = sunLayout(width, height);
      glow = createUnitGlow(ctx, color, [[0, 0.55], [0.25, 0.25], [1, 0]]);
      rays = createUnitGlow(ctx, color, [[0, 0.3], [1, 0]]);
    },

    update(dt) {
      updateSun(state, dt);
    },

    draw(ctx) {
      if (!glow || !rays) return;
      const alpha = clamp01(sunPulse(state.time) * intensity);
      const rayLength = layout.radius * 1.3;

      // Rays: one path of wedges, one fill, rotated as a whole.
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = rays;
      ctx.translate(layout.x, layout.y);
      ctx.rotate(state.rotation);
      ctx.scale(rayLength, rayLength);
      ctx.beginPath();
      for (let i = 0; i < RAY_COUNT; i++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(RAY_TIPS[i * 4], RAY_TIPS[i * 4 + 1]);
        ctx.lineTo(RAY_TIPS[i * 4 + 2], RAY_TIPS[i * 4 + 3]);
        ctx.closePath();
      }
      ctx.fill();
      ctx.restore();

      fillGlow(ctx, glow, layout.x, layout.y, layout.radius, layout.radius, alpha);
    },
  };
}
