// Pure rain-drop simulation: no DOM, deterministic when `rng` is injected.
// Coordinates are CSS pixels; a drop's (x, y) is the top of its streak.

export type Drop = { x: number; y: number; length: number; speed: number };

export const MIN_LENGTH = 10;
export const MAX_LENGTH = 25;
export const MIN_SPEED = 600; // px/s
export const MAX_SPEED = 1000; // px/s
export const MAX_DT = 0.05; // s — caps the step after a pause or slow frame

export function createDrops(count: number, width: number, height: number, rng: () => number = Math.random): Drop[] {
  const drops: Drop[] = new Array(Math.max(0, Math.floor(count)));
  for (let i = 0; i < drops.length; i++) {
    drops[i] = {
      x: rng() * width,
      y: rng() * height,
      length: MIN_LENGTH + rng() * (MAX_LENGTH - MIN_LENGTH),
      speed: MIN_SPEED + rng() * (MAX_SPEED - MIN_SPEED),
    };
  }
  return drops;
}

/** Advances every drop in place (no allocation), recycling ones that leave the viewport. */
export function updateDrops(
  drops: Drop[],
  dtSeconds: number,
  width: number,
  height: number,
  wind: number = 0,
  rng: () => number = Math.random,
): void {
  const dt = Math.min(Math.max(dtSeconds, 0), MAX_DT);
  const dx = wind * dt;

  for (let i = 0; i < drops.length; i++) {
    const drop = drops[i];
    drop.y += drop.speed * dt;
    drop.x += dx;

    if (drop.y > height || drop.x < 0 || drop.x > width) {
      drop.x = rng() * width;
      drop.y = -drop.length;
    }
  }
}
