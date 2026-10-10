// Cloudy: soft clouds (clusters of overlapping glow "puffs") drifting across
// the upper half of the screen and wrapping around.

import type { Scene } from "./canvasScene";
import { createUnitGlow, fillGlow, type RGB } from "./paint";

export interface CloudOptions {
  coverage: number; // cloud-count multiplier
  wind: number; // px/s, positive = rightwards
  color: RGB;
}

export type Puff = { dx: number; dy: number; r: number };
export type Cloud = { x: number; y: number; speed: number; halfWidth: number; alpha: number; puffs: Puff[] };

export const MAX_CLOUDS = 16;
const PX_PER_CLOUD = 240; // of canvas width, at coverage 1 (≈ 8 clouds at 1920px)

export function cloudCountFor(width: number, coverage: number): number {
  return Math.min(Math.round((width / PX_PER_CLOUD) * Math.max(coverage, 0)), MAX_CLOUDS);
}

const randomCloudY = (height: number, rng: () => number) => height * (0.05 + rng() * 0.45);

/** One cloud: a row of puffs, biggest and highest in the middle. `x` is 0 until placed. */
export function createCloud(width: number, height: number, wind: number, rng: () => number): Cloud {
  const base = Math.max(width, height) * (0.04 + rng() * 0.04);
  const puffCount = 5 + Math.floor(rng() * 3);
  const puffs: Puff[] = [];
  let halfWidth = 0;

  for (let i = 0; i < puffCount; i++) {
    const t = (i / (puffCount - 1)) * 2 - 1; // -1 … 1 across the cloud
    const middle = 1 - Math.abs(t);
    const puff = {
      dx: t * base * 1.5 + (rng() - 0.5) * base * 0.3,
      dy: -middle * base * 0.5 + (rng() - 0.5) * base * 0.2,
      r: base * (0.6 + middle * 0.5 + rng() * 0.2),
    };
    puffs.push(puff);
    halfWidth = Math.max(halfWidth, Math.abs(puff.dx) + puff.r);
  }

  return {
    x: 0,
    y: randomCloudY(height, rng),
    speed: wind * (0.6 + rng() * 0.8),
    halfWidth,
    alpha: 0.18 + rng() * 0.14,
    puffs,
  };
}

export function createClouds(count: number, width: number, height: number, wind: number, rng: () => number): Cloud[] {
  const clouds: Cloud[] = [];
  for (let i = 0; i < count; i++) {
    const cloud = createCloud(width, height, wind, rng);
    cloud.x = rng() * (width + 2 * cloud.halfWidth) - cloud.halfWidth; // anywhere, incl. partly off-screen
    clouds.push(cloud);
  }
  return clouds;
}

/** Drifts clouds in place; one that fully leaves re-enters on the opposite edge at a new height. */
export function updateClouds(clouds: Cloud[], dt: number, width: number, height: number, rng: () => number): void {
  for (let i = 0; i < clouds.length; i++) {
    const cloud = clouds[i];
    cloud.x += cloud.speed * dt;
    if (cloud.speed > 0 && cloud.x - cloud.halfWidth > width) {
      cloud.x = -cloud.halfWidth;
      cloud.y = randomCloudY(height, rng);
    } else if (cloud.speed < 0 && cloud.x + cloud.halfWidth < 0) {
      cloud.x = width + cloud.halfWidth;
      cloud.y = randomCloudY(height, rng);
    }
  }
}

export function createCloudScene({ coverage, wind, color }: CloudOptions, rng: () => number = Math.random): Scene {
  let width = 0;
  let height = 0;
  let clouds: Cloud[] = [];
  let glow: CanvasGradient | null = null;

  return {
    resize(w, h, ctx) {
      width = w;
      height = h;
      clouds = createClouds(cloudCountFor(w, coverage), w, h, wind, rng);
      glow = createUnitGlow(ctx, color, [[0, 1], [0.5, 0.85], [1, 0]]);
    },

    update(dt) {
      updateClouds(clouds, dt, width, height, rng);
    },

    draw(ctx) {
      if (!glow) return;
      for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i];
        for (let j = 0; j < cloud.puffs.length; j++) {
          const puff = cloud.puffs[j];
          fillGlow(ctx, glow, cloud.x + puff.dx, cloud.y + puff.dy, puff.r, puff.r * 0.85, cloud.alpha);
        }
      }
    },
  };
}
