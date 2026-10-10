import { describe, expect, it } from "vitest";
import {
  cloudCountFor,
  createCloud,
  createClouds,
  createCloudScene,
  MAX_CLOUDS,
  updateClouds,
  type Cloud,
} from "./cloudScene";
import { asContext, createStubContext, seededRng } from "./testUtils";

const W = 1920;
const H = 1080;

const cloud = (overrides: Partial<Cloud> = {}): Cloud => ({
  x: 500,
  y: 100,
  speed: 20,
  halfWidth: 200,
  alpha: 0.2,
  puffs: [{ dx: 0, dy: 0, r: 100 }],
  ...overrides,
});

describe("cloudCountFor", () => {
  it("scales with width and coverage, and is capped", () => {
    expect(cloudCountFor(1920, 1)).toBe(8);
    expect(cloudCountFor(1920, 0.5)).toBe(4);
    expect(cloudCountFor(1920, 0)).toBe(0);
    expect(cloudCountFor(1920, 10)).toBe(MAX_CLOUDS);
  });
});

describe("createCloud", () => {
  it("builds 5–7 puffs whose extent fits within halfWidth", () => {
    const rng = seededRng(1);
    for (let i = 0; i < 50; i++) {
      const c = createCloud(W, H, 15, rng);
      expect(c.puffs.length).toBeGreaterThanOrEqual(5);
      expect(c.puffs.length).toBeLessThanOrEqual(7);
      for (const p of c.puffs) expect(Math.abs(p.dx) + p.r).toBeLessThanOrEqual(c.halfWidth + 1e-9);
      expect(c.y).toBeGreaterThanOrEqual(H * 0.05);
      expect(c.y).toBeLessThanOrEqual(H * 0.5);
      expect(c.alpha).toBeGreaterThanOrEqual(0.18);
      expect(c.alpha).toBeLessThanOrEqual(0.32);
    }
  });

  it("drifts with the wind's direction at 0.6–1.4× its speed", () => {
    const rng = seededRng(2);
    const right = createCloud(W, H, 20, rng);
    const left = createCloud(W, H, -20, rng);
    expect(right.speed).toBeGreaterThanOrEqual(12);
    expect(right.speed).toBeLessThanOrEqual(28);
    expect(left.speed).toBeLessThan(0);
  });
});

describe("createClouds", () => {
  it("returns the requested count, deterministically with a seeded rng", () => {
    expect(createClouds(6, W, H, 15, seededRng(3))).toHaveLength(6);
    expect(createClouds(6, W, H, 15, seededRng(3))).toEqual(createClouds(6, W, H, 15, seededRng(3)));
  });
});

describe("updateClouds", () => {
  it("moves clouds by speed * dt", () => {
    const clouds = [cloud({ x: 500, speed: 20 }), cloud({ x: 500, speed: -10 })];
    updateClouds(clouds, 0.5, W, H, () => 0.5);
    expect(clouds[0].x).toBe(510);
    expect(clouds[1].x).toBe(495);
  });

  it("wraps a cloud leaving the right edge back to the left, in place", () => {
    const c = cloud({ x: W + 199, speed: 20, halfWidth: 200 });
    const clouds = [c];
    updateClouds(clouds, 0.1, W, H, () => 0.5);
    expect(clouds[0]).toBe(c);
    expect(c.x).toBe(-200);
    expect(c.y).toBeCloseTo(H * 0.275); // 0.05 + 0.5 * 0.45
  });

  it("wraps a cloud leaving the left edge back to the right", () => {
    const c = cloud({ x: -199, speed: -20, halfWidth: 200 });
    updateClouds([c], 0.1, W, H, () => 0.5);
    expect(c.x).toBe(W + 200);
  });

  it("leaves still clouds alone", () => {
    const c = cloud({ x: W + 1000, speed: 0 });
    updateClouds([c], 1, W, H, () => 0.5);
    expect(c.x).toBe(W + 1000);
  });
});

describe("createCloudScene", () => {
  it("draws one glow per puff and restores state", () => {
    const ctx = createStubContext();
    const scene = createCloudScene({ coverage: 1, wind: 15, color: [210, 218, 230] }, seededRng(4));
    scene.resize(W, H, asContext(ctx));
    scene.update(0.016);
    scene.draw(asContext(ctx));

    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(1);
    expect(ctx.fillRect.mock.calls.length).toBeGreaterThanOrEqual(8 * 5);
    expect(ctx.fillRect.mock.calls.length).toBeLessThanOrEqual(8 * 7);
    expect(ctx.save.mock.calls.length).toBe(ctx.restore.mock.calls.length);
  });

  it("draws nothing before it has been sized", () => {
    const ctx = createStubContext();
    createCloudScene({ coverage: 1, wind: 15, color: [1, 2, 3] }).draw(asContext(ctx));
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });
});
