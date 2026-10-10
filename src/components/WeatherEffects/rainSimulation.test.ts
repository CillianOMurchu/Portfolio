import { describe, it, expect } from "vitest";
import {
  createDrops,
  updateDrops,
  MAX_DT,
  MAX_LENGTH,
  MAX_SPEED,
  MIN_LENGTH,
  MIN_SPEED,
  type Drop,
} from "./rainSimulation";

/** Deterministic PRNG (mulberry32) so runs are reproducible. */
function seededRng(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 800;
const H = 600;

const drop = (overrides: Partial<Drop> = {}): Drop => ({ x: 100, y: 100, length: 20, speed: 800, ...overrides });

// ─── createDrops ──────────────────────────────────────────────────────────────

describe("createDrops", () => {
  it("returns the requested count", () => {
    expect(createDrops(0, W, H)).toHaveLength(0);
    expect(createDrops(250, W, H)).toHaveLength(250);
  });

  it("keeps every drop within bounds and the length/speed ranges", () => {
    for (const d of createDrops(500, W, H, seededRng(1))) {
      expect(d.x).toBeGreaterThanOrEqual(0);
      expect(d.x).toBeLessThanOrEqual(W);
      expect(d.y).toBeGreaterThanOrEqual(0);
      expect(d.y).toBeLessThanOrEqual(H);
      expect(d.length).toBeGreaterThanOrEqual(MIN_LENGTH);
      expect(d.length).toBeLessThanOrEqual(MAX_LENGTH);
      expect(d.speed).toBeGreaterThanOrEqual(MIN_SPEED);
      expect(d.speed).toBeLessThanOrEqual(MAX_SPEED);
    }
  });

  it("is deterministic with a seeded rng", () => {
    expect(createDrops(50, W, H, seededRng(42))).toEqual(createDrops(50, W, H, seededRng(42)));
    expect(createDrops(50, W, H, seededRng(42))).not.toEqual(createDrops(50, W, H, seededRng(7)));
  });

  it("maps rng output onto the ranges", () => {
    expect(createDrops(1, W, H, () => 0)[0]).toEqual({ x: 0, y: 0, length: MIN_LENGTH, speed: MIN_SPEED });
    expect(createDrops(1, W, H, () => 0.5)[0]).toEqual({ x: 400, y: 300, length: 17.5, speed: 800 });
  });
});

// ─── updateDrops ──────────────────────────────────────────────────────────────

describe("updateDrops", () => {
  it("moves drops down by speed * dt", () => {
    const drops = [drop({ y: 100, speed: 800 }), drop({ y: 50, speed: 600 })];
    updateDrops(drops, 0.025, W, H);
    expect(drops[0].y).toBeCloseTo(120);
    expect(drops[1].y).toBeCloseTo(65);
    expect(drops[0].x).toBe(100);
  });

  it("applies wind horizontally", () => {
    const drops = [drop({ x: 400 }), drop({ x: 200 })];
    updateDrops(drops, 0.02, W, H, 100);
    expect(drops[0].x).toBeCloseTo(402);
    expect(drops[1].x).toBeCloseTo(202);

    updateDrops(drops, 0.02, W, H, -100);
    expect(drops[0].x).toBeCloseTo(400);
  });

  it("recycles drops leaving the bottom to just above the top, in place", () => {
    const drops = [drop({ y: H - 1, length: 20 }), drop({ y: 10 })];
    const refs = [...drops];

    updateDrops(drops, 0.01, W, H, 0, () => 0.25);

    expect(drops).toHaveLength(2);
    expect(drops[0]).toBe(refs[0]);
    expect(drops[1]).toBe(refs[1]);
    expect(drops[0]).toMatchObject({ x: 200, y: -20 });
    expect(drops[1].y).toBeCloseTo(18); // untouched by recycling
  });

  it("recycles drops blown off either side", () => {
    const left = [drop({ x: 1 })];
    updateDrops(left, 0.01, W, H, -500, () => 0.5);
    expect(left[0]).toMatchObject({ x: 400, y: -20 });

    const right = [drop({ x: W - 1 })];
    updateDrops(right, 0.01, W, H, 500, () => 0.5);
    expect(right[0]).toMatchObject({ x: 400, y: -20 });
  });

  it("clamps large dt so a long pause doesn't teleport drops", () => {
    const drops = [drop({ y: 0, speed: 1000, x: 400 })];
    updateDrops(drops, 5, W, H, 100);
    expect(drops[0].y).toBeCloseTo(1000 * MAX_DT);
    expect(drops[0].x).toBeCloseTo(400 + 100 * MAX_DT);
  });

  it("ignores negative dt", () => {
    const drops = [drop({ y: 100 })];
    updateDrops(drops, -1, W, H);
    expect(drops[0].y).toBe(100);
  });
});
