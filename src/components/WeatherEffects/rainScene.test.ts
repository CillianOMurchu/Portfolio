import { describe, expect, it } from "vitest";
import { bucketAlpha, bucketOf, DEPTH_BUCKETS, drawRain, drawSplashes, LIGHTNING_RAIN_ALPHA, streakLength } from "./rainScene";
import { createDrops, createParticlePool, type Drop } from "./rainSimulation";
import { asContext, createStubContext, recordAssignments, seededRng } from "./testUtils";

describe("depth buckets", () => {
  it("cover z in [0, 1) and give opacity ≈ z * 0.5", () => {
    expect(bucketOf(0)).toBe(0);
    expect(bucketOf(0.999)).toBe(DEPTH_BUCKETS - 1);
    expect(bucketOf(1)).toBe(DEPTH_BUCKETS - 1);
    expect(bucketAlpha(0)).toBeCloseTo(0.5 / DEPTH_BUCKETS / 2);
    expect(bucketAlpha(DEPTH_BUCKETS - 1)).toBeLessThan(0.5);
  });

  it("makes nearer drops longer", () => {
    const near: Drop = { x: 0, y: 0, vx: 0, vy: 10, speed: 10, z: 0.9 };
    expect(streakLength(near)).toBeCloseTo(21);
    expect(streakLength({ ...near, z: 0.1 })).toBeCloseTo(13);
  });
});

describe("drawRain", () => {
  it("draws every active drop as a 4-corner streak with one fill per depth bucket", () => {
    const ctx = createStubContext();
    const drops = createDrops(300, 800, 600, seededRng(1));
    drawRain(asContext(ctx), drops, 200, false);

    expect(ctx.fill).toHaveBeenCalledTimes(DEPTH_BUCKETS);
    expect(ctx.moveTo).toHaveBeenCalledTimes(200);
    expect(ctx.lineTo).toHaveBeenCalledTimes(200 * 3);
    expect(ctx.globalAlpha).toBe(1); // restored
  });

  it("draws a streak forward along the velocity, 1.2px wide", () => {
    const ctx = createStubContext();
    const d: Drop = { x: 100, y: 50, vx: 0, vy: 10, speed: 10, z: 0.5 };
    drawRain(asContext(ctx), [d], 1, false);
    expect(ctx.moveTo).toHaveBeenCalledWith(100.6, 50);
    expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 100.6, 67);
    expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 99.4, 67);
    expect(ctx.lineTo).toHaveBeenNthCalledWith(3, 99.4, 50);
  });

  it("jumps to 0.8 opacity during lightning", () => {
    const ctx = createStubContext();
    const alphas = recordAssignments(ctx, "globalAlpha");
    drawRain(asContext(ctx), createDrops(50, 800, 600, seededRng(2)), 50, true);
    expect(alphas.slice(0, DEPTH_BUCKETS).every((a) => a === LIGHTNING_RAIN_ALPHA)).toBe(true);
  });

  it("draws nothing with no active drops", () => {
    const ctx = createStubContext();
    drawRain(asContext(ctx), createDrops(10, 800, 600), 0, false);
    expect(ctx.fill).not.toHaveBeenCalled();
  });
});

describe("drawSplashes", () => {
  it("draws live particles only, faded by life", () => {
    const ctx = createStubContext();
    const pool = createParticlePool(5);
    Object.assign(pool[1], { x: 10, y: 20, size: 2, life: 0.5 });
    const alphas = recordAssignments(ctx, "globalAlpha");
    drawSplashes(asContext(ctx), pool);
    expect(ctx.fillRect).toHaveBeenCalledTimes(1);
    expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 2, 2);
    expect(alphas[0]).toBe(0.5);
  });
});
