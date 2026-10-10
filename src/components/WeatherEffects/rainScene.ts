// Drawing for the rain simulation. Each drop is a 1.2px-wide streak rotated to
// its velocity (fillRect(0, -0.6, len, 1.2) in drop space, built here as path
// corners). Drops are batched into depth buckets: one fill per bucket, not per drop.

import type { Drop, Particle } from "./rainSimulation";

export const DEPTH_BUCKETS = 6;
export const RAIN_COLOR = "rgb(180,200,220)";
export const SPLASH_COLOR = "rgb(250,250,250)";
export const LIGHTNING_RAIN_ALPHA = 0.8;
const HALF_WIDTH = 0.6;

export const bucketOf = (z: number) => Math.min(Math.floor(z * DEPTH_BUCKETS), DEPTH_BUCKETS - 1);

/** Opacity of a bucket: z * 0.5 at the bucket's mid-depth. */
export const bucketAlpha = (bucket: number) => ((bucket + 0.5) / DEPTH_BUCKETS) * 0.5;

/** Streak length: nearer drops are longer. */
export const streakLength = (drop: Drop) => drop.speed * (drop.z + 1.2);

export function drawRain(ctx: CanvasRenderingContext2D, drops: Drop[], active: number, lightning: boolean): void {
  const n = Math.min(active, drops.length);
  if (n === 0) return;
  ctx.fillStyle = RAIN_COLOR;

  for (let bucket = 0; bucket < DEPTH_BUCKETS; bucket++) {
    ctx.globalAlpha = lightning ? LIGHTNING_RAIN_ALPHA : bucketAlpha(bucket);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const drop = drops[i];
      if (bucketOf(drop.z) !== bucket) continue;
      const inv = 1 / Math.hypot(drop.vx, drop.vy);
      const ux = drop.vx * inv; // along the streak
      const uy = drop.vy * inv;
      const nx = -uy * HALF_WIDTH; // across it
      const ny = ux * HALF_WIDTH;
      const len = streakLength(drop);
      const ex = drop.x + ux * len;
      const ey = drop.y + uy * len;
      ctx.moveTo(drop.x - nx, drop.y - ny);
      ctx.lineTo(ex - nx, ey - ny);
      ctx.lineTo(ex + nx, ey + ny);
      ctx.lineTo(drop.x + nx, drop.y + ny);
      ctx.closePath();
    }
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawSplashes(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  ctx.fillStyle = SPLASH_COLOR;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (p.life <= 0) continue;
    ctx.globalAlpha = p.life;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}
