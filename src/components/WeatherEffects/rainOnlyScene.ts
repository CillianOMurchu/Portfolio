// Just the rain from the sky scene (same drops, streaks and splashes) on a
// transparent canvas: no sky tint, clouds, sun or lightning. Used for the
// constant light drizzle behind the home page.

import type { Scene } from "./canvasScene";
import { drawRain, drawSplashes } from "./rainScene";
import { createDrops, createParticlePool, DROP_COUNT, spawnSplash, updateDrops, updateParticles, type Drop } from "./rainSimulation";
import { SPLASH_CHANCE } from "./skyScene";

const FRAMES_PER_SECOND = 60;
const SPLASH_GROUND_JITTER = 8; // px above the bottom edge

/** `density` 0–1 is the fraction of the sky scene's 1200 drops. */
export function createRainOnlyScene(density: number, rng: () => number = Math.random): Scene {
  const active = Math.floor(DROP_COUNT * Math.min(Math.max(density, 0), 1));
  const particles = createParticlePool();
  let width = 0;
  let height = 0;
  let frames = 0;
  let drops: Drop[] = [];

  const splash = (drop: Drop) => {
    if (rng() < SPLASH_CHANCE * drop.z) spawnSplash(particles, drop.x, height - rng() * SPLASH_GROUND_JITTER, rng);
  };

  return {
    resize(w, h) {
      width = w;
      height = h;
      drops = createDrops(active, w, h, rng); // scattered over the full height: rain from the first frame
    },
    update(dt) {
      frames = dt * FRAMES_PER_SECOND;
      updateDrops(drops, active, frames, width, height, rng, splash);
      updateParticles(particles, frames);
    },
    draw(ctx) {
      drawRain(ctx, drops, active, false);
      drawSplashes(ctx, particles);
    },
  };
}
