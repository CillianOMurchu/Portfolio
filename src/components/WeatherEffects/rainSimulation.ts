// Pure rain simulation (no DOM): angled drops with gravity and depth, plus a
// fixed pool of splash particles. Units are "frames" at 60 fps, so callers
// pass `frames = dtSeconds * 60`; deterministic when `rng` is injected.

export const DROP_COUNT = 1200;
export const RAIN_ANGLE = (5 * Math.PI) / 180; // from vertical, blowing right
export const MIN_SPEED = 10; // px/frame
export const MAX_SPEED = 25;
export const GRAVITY = 0.5; // px/frame²
export const SPAWN_Y = -20;

const COS = Math.cos(RAIN_ANGLE);
const SIN = Math.sin(RAIN_ANGLE);
const MAX_VY = MAX_SPEED * COS;

/** z: depth in [0, 1); nearer drops (higher z) are longer and more opaque. */
export type Drop = { x: number; y: number; vx: number; vy: number; speed: number; z: number };

/** Re-launches a drop just above the top, shifted against the wind so the right-drift covers the screen. */
export function respawnDrop(drop: Drop, width: number, height: number, rng: () => number): void {
  const drift = height * Math.tan(RAIN_ANGLE);
  drop.speed = MIN_SPEED + rng() * (MAX_SPEED - MIN_SPEED);
  drop.vx = SIN * drop.speed;
  drop.vy = COS * drop.speed;
  drop.x = rng() * (width + drift) - drift;
  drop.y = SPAWN_Y;
}

/** Creates drops scattered over the whole screen height, so the rain doesn't arrive as one wave. */
export function createDrops(count: number, width: number, height: number, rng: () => number = Math.random): Drop[] {
  const drops: Drop[] = new Array(Math.max(0, Math.floor(count)));
  for (let i = 0; i < drops.length; i++) {
    const drop: Drop = { x: 0, y: 0, vx: 0, vy: 0, speed: 0, z: rng() };
    respawnDrop(drop, width, height, rng);
    drop.y = rng() * height;
    drops[i] = drop;
  }
  return drops;
}

/**
 * Advances the first `active` drops in place. Drops that pass the bottom call `onLand` (if given) and
 * respawn; drops that pass the right edge just respawn.
 */
export function updateDrops(
  drops: Drop[],
  active: number,
  frames: number,
  width: number,
  height: number,
  rng: () => number = Math.random,
  onLand?: (drop: Drop) => void,
): void {
  const n = Math.min(active, drops.length);
  for (let i = 0; i < n; i++) {
    const drop = drops[i];
    drop.vy = Math.min(drop.vy + GRAVITY * COS * frames, MAX_VY);
    drop.x += drop.vx * frames;
    drop.y += drop.vy * frames;

    if (drop.y > height) {
      onLand?.(drop);
      respawnDrop(drop, width, height, rng);
    } else if (drop.x > width) {
      respawnDrop(drop, width, height, rng);
    }
  }
}

// ─── Splashes ─────────────────────────────────────────────────────────────────

export const PARTICLES_PER_SPLASH = 10;
export const MAX_PARTICLES = 400;
export const SPLASH_GRAVITY = 0.5; // px/frame²
export const SPLASH_DRAG = 0.98; // vx multiplier per frame
export const SPLASH_FADE = 0.04; // life per frame
const SPLASH_SPREAD = (54 * Math.PI) / 180;

/** life ≤ 0 = free slot; new particles start at 0.6–1. */
export type Particle = { x: number; y: number; vx: number; vy: number; size: number; life: number };

export function createParticlePool(size: number = MAX_PARTICLES): Particle[] {
  const pool: Particle[] = new Array(size);
  for (let i = 0; i < size; i++) pool[i] = { x: 0, y: 0, vx: 0, vy: 0, size: 0, life: 0 };
  return pool;
}

/** Fires up to PARTICLES_PER_SPLASH particles up and back against the rain, reusing free slots. Returns how many. */
export function spawnSplash(pool: Particle[], x: number, y: number, rng: () => number = Math.random): number {
  let spawned = 0;
  for (let i = 0; i < pool.length && spawned < PARTICLES_PER_SPLASH; i++) {
    const p = pool[i];
    if (p.life > 0) continue;
    const angle = -Math.PI / 2 - RAIN_ANGLE + (rng() * 2 - 1) * SPLASH_SPREAD;
    const speed = 3 + rng() * 6;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.size = 0.5 + rng() * 2.5;
    p.life = 0.6 + rng() * 0.4; // varied lifespans, so particles never all expire together
    spawned++;
  }
  return spawned;
}

export function updateParticles(pool: Particle[], frames: number): void {
  const drag = Math.pow(SPLASH_DRAG, frames);
  for (let i = 0; i < pool.length; i++) {
    const p = pool[i];
    if (p.life <= 0) continue;
    p.vy += SPLASH_GRAVITY * frames;
    p.vx *= drag;
    p.x += p.vx * frames;
    p.y += p.vy * frames;
    p.life -= SPLASH_FADE * frames;
  }
}
