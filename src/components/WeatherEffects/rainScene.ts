// Rain as a Scene: all streaks are one path and a single stroke() per frame.

import type { Scene } from "./canvasScene";
import { createDrops, updateDrops, type Drop } from "./rainSimulation";

export interface RainOptions {
  intensity: number; // drops per 10,000 px² of canvas
  wind: number; // px/s, positive = rightwards
  color: string; // any strokeStyle
}

export const MAX_DROPS = 500;
const AREA_UNIT = 10_000; // px²

export function dropCountFor(width: number, height: number, intensity: number): number {
  const count = Math.round(((width * height) / AREA_UNIT) * Math.max(intensity, 0));
  return Math.min(count, MAX_DROPS);
}

export function createRainScene({ intensity, wind, color }: RainOptions, rng: () => number = Math.random): Scene {
  let width = 0;
  let height = 0;
  let drops: Drop[] = [];

  return {
    resize(w, h) {
      width = w;
      height = h;
      drops = createDrops(dropCountFor(w, h, intensity), w, h, rng);
    },

    update(dt) {
      updateDrops(drops, dt, width, height, wind, rng);
    },

    draw(ctx) {
      if (drops.length === 0) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        // Slant the streak along its direction of travel.
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + (wind / drop.speed) * drop.length, drop.y + drop.length);
      }
      ctx.stroke();
    },
  };
}
