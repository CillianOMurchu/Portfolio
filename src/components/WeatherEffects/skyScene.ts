// The sky: one opaque scene combining background, clouds, lightning, rain,
// splashes and sun. `weather` runs from 0 (full storm) to 1 (full sun); rain,
// lightning and clouds default to (1 - weather) but can be set independently
// (e.g. overcast with no rain), which is what the weather-code mapping uses.
//
// The canvas is never cleared: each frame starts with a translucent background
// fill, which leaves fading motion-blur trails behind the rain.

import type { Scene } from "./canvasScene";
import { createCloudLayers, createTextureCanvas, drawCloudLayers, updateCloudLayers, type CloudLayer, type CreateTextureCanvas } from "./cloudScene";
import { createLightning, drawBolts, drawFlash, updateLightning } from "./lightningScene";
import { drawRain, drawSplashes } from "./rainScene";
import { createDrops, createParticlePool, DROP_COUNT, spawnSplash, updateDrops, updateParticles, type Drop } from "./rainSimulation";
import { createSunGradient, drawSun } from "./sunScene";

export interface SkyOptions {
  /** 0 = full storm, 1 = full sun. Drives the sun and the sky tint. */
  weather: number;
  /** Rain density 0–1 (fraction of the 1200 drops). Default 1 - weather. */
  rain?: number;
  /** Lightning frequency 0–1. Default 1 - weather. */
  lightning?: number;
  /** Cloud opacity 0–1. Default 1 - weather. */
  clouds?: number;
}

export type ResolvedSky = Required<SkyOptions>;

export interface SkyDeps {
  rng?: () => number;
  createCanvas?: CreateTextureCanvas;
}

const FRAMES_PER_SECOND = 60;
// Chance that a landing drop splashes, times its depth z (near drops splash more). Keeps the
// average splash rate below what the particle pool sustains, so it never saturates and refills
// in bursts (which made the splashes pulse in unison).
export const SPLASH_CHANCE = 0.08;
const SPLASH_GROUND_JITTER = 8; // px above the bottom edge

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

export function resolveSky({ weather, rain, lightning, clouds }: SkyOptions): ResolvedSky {
  const w = clamp01(weather);
  return {
    weather: w,
    rain: clamp01(rain ?? 1 - w),
    lightning: clamp01(lightning ?? 1 - w),
    clouds: clamp01(clouds ?? 1 - w),
  };
}

/** Background colour (storm = black, sun = warm amber-brown) and its per-frame fill opacity at 60 fps. */
export function skyBackground(weather: number): { color: string; alpha: number } {
  return {
    color: `rgb(${Math.round(weather * 45)},${Math.round(weather * 28)},0)`,
    alpha: 0.4 - weather * 0.1,
  };
}

/** Per-frame opacity rescaled for a frame of `frames` 60fps-frames, so trails fade at the same speed at any refresh rate. */
export const fadeForFrames = (alpha: number, frames: number) => 1 - Math.pow(1 - alpha, frames);

export function createSkyScene(options: SkyOptions, deps: SkyDeps = {}): Scene {
  const { rng = Math.random, createCanvas = createTextureCanvas } = deps;
  const sky = resolveSky(options);
  const background = skyBackground(sky.weather);
  const activeDrops = Math.floor(DROP_COUNT * sky.rain);

  const lightning = createLightning();
  const particles = createParticlePool();
  const splash = (drop: Drop) => {
    if (rng() < SPLASH_CHANCE * drop.z) spawnSplash(particles, drop.x, height - rng() * SPLASH_GROUND_JITTER, rng);
  };

  let width = 0;
  let height = 0;
  let frames = 0;
  let drops: Drop[] = [];
  let layers: CloudLayer[] = [];
  let sun: CanvasGradient | null = null;

  return {
    clearEachFrame: false,

    resize(w, h, ctx) {
      width = w;
      height = h;
      drops = activeDrops > 0 ? createDrops(DROP_COUNT, w, h, rng) : [];
      layers = sky.clouds > 0 || sky.lightning > 0 ? createCloudLayers(w, h, rng, createCanvas) : [];
      sun = sky.weather > 0 ? createSunGradient(ctx, w, h, sky.weather, background.alpha) : null;
      // Start opaque so the page never shows through while trails build up.
      ctx.fillStyle = background.color;
      ctx.fillRect(0, 0, w, h);
    },

    update(dt) {
      frames = dt * FRAMES_PER_SECOND;
      updateLightning(lightning, frames, sky.lightning, width, height, rng); // 1–2: strike, timer, fade
      updateCloudLayers(layers, frames, width);
      updateDrops(drops, activeDrops, frames, width, height, rng, splash);
      updateParticles(particles, frames);
    },

    draw(ctx) {
      drawFlash(ctx, lightning, width, height); // 3
      ctx.globalAlpha = fadeForFrames(background.alpha, frames); // 4: translucent fill, no clearRect
      ctx.fillStyle = background.color;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      // Clouds and sun are re-stamped every frame onto the persistent canvas; scale them by frame length
      // so they build up to the same brightness at any refresh rate (1 at 60 fps).
      const stamp = Math.min(frames, 1);
      drawCloudLayers(ctx, layers, width, sky.clouds * stamp, lightning.active ? lightning.intensity : 0); // 5
      drawBolts(ctx, lightning.bolts); // 6
      drawRain(ctx, drops, activeDrops, lightning.active); // 8 (page content sits above the canvas)
      drawSplashes(ctx, particles); // 9
      if (sun && stamp > 0) {
        ctx.globalAlpha = stamp;
        drawSun(ctx, sun, width, height); // 10
        ctx.globalAlpha = 1;
      }
    },
  };
}
