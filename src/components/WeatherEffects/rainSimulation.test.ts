import { describe, expect, it, vi } from "vitest";
import {
  createDrops,
  createParticlePool,
  GRAVITY,
  MAX_SPEED,
  MIN_SPEED,
  PARTICLES_PER_SPLASH,
  RAIN_ANGLE,
  respawnDrop,
  spawnSplash,
  SPAWN_Y,
  SPLASH_FADE,
  updateDrops,
  updateParticles,
  type Drop,
} from "./rainSimulation";
import { seededRng } from "./testUtils";

const W = 800;
const H = 600;
const COS = Math.cos(RAIN_ANGLE);
const SIN = Math.sin(RAIN_ANGLE);

const drop = (overrides: Partial<Drop> = {}): Drop => ({ x: 100, y: 100, vx: SIN * 10, vy: COS * 10, speed: 10, z: 0.5, ...overrides });

// ─── Drops ────────────────────────────────────────────────────────────────────

describe("createDrops", () => {
  it("creates the requested count, scattered over the whole height", () => {
    const drops = createDrops(500, W, H, seededRng(1));
    expect(drops).toHaveLength(500);
    const ys = drops.map((d) => d.y);
    expect(Math.min(...ys)).toBeLessThan(H * 0.1);
    expect(Math.max(...ys)).toBeGreaterThan(H * 0.9);
  });

  it("angles drops 5° from vertical with speed 10–25 and depth 0–1", () => {
    for (const d of createDrops(200, W, H, seededRng(2))) {
      expect(d.speed).toBeGreaterThanOrEqual(MIN_SPEED);
      expect(d.speed).toBeLessThanOrEqual(MAX_SPEED);
      expect(Math.atan2(d.vx, d.vy)).toBeCloseTo(RAIN_ANGLE);
      expect(d.z).toBeGreaterThanOrEqual(0);
      expect(d.z).toBeLessThan(1);
    }
  });

  it("is deterministic with a seeded rng", () => {
    expect(createDrops(50, W, H, seededRng(3))).toEqual(createDrops(50, W, H, seededRng(3)));
  });
});

describe("respawnDrop", () => {
  it("puts the drop just above the top, shifted left against the wind", () => {
    const d = drop({ y: 999 });
    respawnDrop(d, W, H, () => 0);
    expect(d.y).toBe(SPAWN_Y);
    expect(d.x).toBeCloseTo(-H * Math.tan(RAIN_ANGLE));
    expect(d.speed).toBe(MIN_SPEED);
  });
});

describe("updateDrops", () => {
  it("moves drops by velocity and adds gravity along the fall", () => {
    const d = drop({ x: 100, y: 100 });
    const vy0 = d.vy;
    updateDrops([d], 1, 1, W, H);
    expect(d.vy).toBeCloseTo(vy0 + GRAVITY * COS);
    expect(d.x).toBeCloseTo(100 + SIN * 10);
    expect(d.y).toBeCloseTo(100 + vy0 + GRAVITY * COS);
  });

  it("caps the fall speed", () => {
    const d = drop({ vy: MAX_SPEED * COS });
    updateDrops([d], 1, 10, W, H);
    expect(d.vy).toBeCloseTo(MAX_SPEED * COS);
  });

  it("only updates the first `active` drops", () => {
    const drops = [drop({ y: 100 }), drop({ y: 100 })];
    updateDrops(drops, 1, 1, W, H);
    expect(drops[0].y).toBeGreaterThan(100);
    expect(drops[1].y).toBe(100);
  });

  it("respawns drops past the bottom (calling onLand) or the right edge, in place", () => {
    const bottom = drop({ y: H - 1 });
    const right = drop({ x: W - 0.1, y: 100 });
    const drops = [bottom, right];
    const onLand = vi.fn();

    updateDrops(drops, 2, 1, W, H, () => 0.5, onLand);

    expect(drops[0]).toBe(bottom);
    expect(drops[1]).toBe(right);
    expect(onLand).toHaveBeenCalledTimes(1);
    expect(onLand).toHaveBeenCalledWith(bottom);
    expect(bottom.y).toBe(SPAWN_Y);
    expect(right.y).toBe(SPAWN_Y);
  });
});

// ─── Splashes ─────────────────────────────────────────────────────────────────

describe("splash particles", () => {
  it("spawns 10 particles fired upwards into free slots", () => {
    const pool = createParticlePool(30);
    expect(spawnSplash(pool, 50, H, seededRng(4))).toBe(PARTICLES_PER_SPLASH);
    const live = pool.filter((p) => p.life > 0);
    expect(live).toHaveLength(PARTICLES_PER_SPLASH);
    for (const p of live) {
      expect(p.vy).toBeLessThan(0);
      expect(Math.hypot(p.vx, p.vy)).toBeGreaterThanOrEqual(3 - 1e-9);
      expect(Math.hypot(p.vx, p.vy)).toBeLessThanOrEqual(9 + 1e-9);
      expect(p.size).toBeGreaterThanOrEqual(0.5);
      expect(p.size).toBeLessThanOrEqual(3);
      expect(p.life).toBeGreaterThanOrEqual(0.6);
      expect(p.life).toBeLessThanOrEqual(1);
    }
    expect(new Set(live.map((p) => p.life)).size).toBeGreaterThan(1); // staggered expiry
  });

  it("never allocates past the pool", () => {
    const pool = createParticlePool(15);
    expect(spawnSplash(pool, 0, 0)).toBe(10);
    expect(spawnSplash(pool, 0, 0)).toBe(5);
    expect(spawnSplash(pool, 0, 0)).toBe(0);
    expect(pool).toHaveLength(15);
  });

  it("applies gravity and drag, fades, and frees slots", () => {
    const pool = createParticlePool(1);
    Object.assign(pool[0], { x: 0, y: 0, vx: 2, vy: -5, life: 1 });
    updateParticles(pool, 1);
    expect(pool[0].vy).toBeCloseTo(-4.5);
    expect(pool[0].vx).toBeCloseTo(1.96);
    expect(pool[0].life).toBeCloseTo(1 - SPLASH_FADE);

    updateParticles(pool, 30);
    expect(pool[0].life).toBeLessThanOrEqual(0);
    expect(spawnSplash(pool, 0, 0)).toBe(1); // slot reused
  });
});
