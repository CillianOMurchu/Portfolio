// Foggy: a haze thickening towards the bottom of the screen, plus wide fog
// banks that drift sideways and slowly thin and thicken.

import type { Scene } from "./canvasScene";
import { createUnitGlow, fillGlow, rgba, type RGB } from "./paint";

export interface FogOptions {
  density: number; // opacity multiplier, 0–1
  wind: number; // px/s, positive = rightwards
  color: RGB;
}

export type FogBank = { x: number; y: number; rx: number; ry: number; speed: number; phase: number };

export const FOG_BANK_COUNT = 7;
export const BREATH_SPEED = 0.25; // rad/s
const TAU = Math.PI * 2;

export function createFogBanks(count: number, width: number, height: number, wind: number, rng: () => number): FogBank[] {
  const banks: FogBank[] = [];
  for (let i = 0; i < count; i++) {
    banks.push({
      x: rng() * width,
      y: height * (0.35 + rng() * 0.65),
      rx: width * (0.35 + rng() * 0.3),
      ry: height * (0.1 + rng() * 0.12),
      speed: wind * (0.5 + rng()),
      phase: rng() * TAU,
    });
  }
  return banks;
}

/** Drifts banks in place (wrapping at the edges) and advances their breathing. */
export function updateFog(banks: FogBank[], dt: number, width: number): void {
  for (let i = 0; i < banks.length; i++) {
    const bank = banks[i];
    bank.x += bank.speed * dt;
    if (bank.x - bank.rx > width) bank.x = -bank.rx;
    else if (bank.x + bank.rx < 0) bank.x = width + bank.rx;
    bank.phase = (bank.phase + BREATH_SPEED * dt) % TAU;
  }
}

/** Bank opacity: breathes between 0.10 and 0.34 at density 1. */
export function fogBankAlpha(bank: FogBank, density: number): number {
  return Math.min(Math.max(density * (0.22 + 0.12 * Math.sin(bank.phase)), 0), 1);
}

export function createFogScene({ density, wind, color }: FogOptions, rng: () => number = Math.random): Scene {
  let width = 0;
  let height = 0;
  let banks: FogBank[] = [];
  let glow: CanvasGradient | null = null;
  let haze: CanvasGradient | null = null;

  return {
    resize(w, h, ctx) {
      width = w;
      height = h;
      banks = createFogBanks(FOG_BANK_COUNT, w, h, wind, rng);
      glow = createUnitGlow(ctx, color, [[0, 1], [0.6, 0.6], [1, 0]]);
      haze = ctx.createLinearGradient(0, h * 0.2, 0, h);
      haze.addColorStop(0, rgba(color, 0));
      haze.addColorStop(1, rgba(color, Math.min(0.3 * Math.max(density, 0), 1)));
    },

    update(dt) {
      updateFog(banks, dt, width);
    },

    draw(ctx) {
      if (!glow || !haze) return;
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < banks.length; i++) {
        const bank = banks[i];
        fillGlow(ctx, glow, bank.x, bank.y, bank.rx, bank.ry, fogBankAlpha(bank, density));
      }
    },
  };
}
