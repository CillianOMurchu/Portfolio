import { describe, expect, it } from "vitest";
import {
  createLightning,
  createLightningScene,
  generateBolt,
  MAX_BOLT_POINTS,
  MAX_FLASH_ALPHA,
  MAX_INTERVAL,
  MIN_INTERVAL,
  strike,
  updateLightning,
} from "./lightningScene";
import { asContext, createStubContext, seededRng } from "./testUtils";

const W = 1200;
const H = 800;
const FRAME = 1 / 60;

describe("generateBolt", () => {
  it("writes a jagged bolt from the top edge down into the buffer", () => {
    const out = new Float32Array(MAX_BOLT_POINTS * 2);
    const rng = seededRng(1);
    for (let n = 0; n < 50; n++) {
      const points = generateBolt(out, W, H, rng);
      expect(points).toBeGreaterThanOrEqual(12);
      expect(points).toBeLessThanOrEqual(MAX_BOLT_POINTS);
      expect(out[1]).toBe(0);
      for (let i = 1; i < points; i++) expect(out[i * 2 + 1]).toBeGreaterThan(out[(i - 1) * 2 + 1]);
      expect(out[(points - 1) * 2 + 1]).toBeLessThanOrEqual(H * 0.8 + 1e-3);
    }
  });

  it("never overruns a small buffer", () => {
    const out = new Float32Array(10);
    expect(generateBolt(out, W, H, () => 0.99)).toBe(5);
  });
});

describe("updateLightning", () => {
  it("first strikes within 1.5–4 s", () => {
    const state = createLightning(() => 0.5);
    expect(state.untilNextStrike).toBeCloseTo(2.75);
    updateLightning(state, 2.7, W, H, () => 0.5);
    expect(state.flash).toBe(0);
    updateLightning(state, 0.1, W, H, () => 0.5);
    expect(state.flash).toBe(1);
    expect(state.boltPoints).toBeGreaterThan(1);
  });

  it("schedules the next strike MIN–MAX_INTERVAL later", () => {
    for (const r of [0, 0.5, 0.999]) {
      const state = createLightning(() => r);
      state.untilNextStrike = 0.001;
      updateLightning(state, FRAME, W, H, () => r);
      expect(state.untilNextStrike).toBeGreaterThanOrEqual(MIN_INTERVAL);
      expect(state.untilNextStrike).toBeLessThanOrEqual(MAX_INTERVAL);
    }
  });

  it("decays the flash and bolt between strikes", () => {
    const state = createLightning(() => 0.5);
    strike(state, W, H, () => 0.9); // 0.9 ≥ re-flash chance: no re-flash
    state.untilNextStrike = 100;
    updateLightning(state, 0.5, W, H, () => 0.5);
    expect(state.flash).toBeLessThan(0.1);
    expect(state.boltAlpha).toBeLessThan(0.2);
    expect(state.untilReflash).toBe(0);
  });

  it("can re-flash shortly after a strike", () => {
    const state = createLightning(() => 0.5);
    strike(state, W, H, () => 0.1); // < re-flash chance
    state.untilNextStrike = 100;
    expect(state.untilReflash).toBeGreaterThan(0);
    for (let t = 0; t < 0.3; t += FRAME) updateLightning(state, FRAME, W, H, () => 0.5);
    expect(state.untilReflash).toBeLessThanOrEqual(0);
    expect(state.flash).toBeGreaterThan(0.1); // re-flashed to 0.6, then decaying
  });

  it("never flashes more than three times in any one second (WCAG 2.3.1)", () => {
    const rng = seededRng(42);
    const state = createLightning(rng);
    const flashTimes: number[] = [];
    let previous = 0;
    for (let frame = 0; frame < 60 * 600; frame++) {
      updateLightning(state, FRAME, W, H, rng);
      if (state.flash > previous + 0.2) flashTimes.push(frame * FRAME);
      previous = state.flash;
    }
    expect(flashTimes.length).toBeGreaterThan(50); // ~10 minutes of storm
    for (let i = 3; i < flashTimes.length; i++) {
      expect(flashTimes[i] - flashTimes[i - 3]).toBeGreaterThan(1);
    }
  });
});

describe("createLightningScene", () => {
  it("draws nothing between strikes", () => {
    const ctx = createStubContext();
    const scene = createLightningScene(() => 0.5);
    scene.resize(W, H, asContext(ctx));
    scene.update(FRAME);
    scene.draw(asContext(ctx));
    expect(ctx.fillRect).not.toHaveBeenCalled();
    expect(ctx.stroke).not.toHaveBeenCalled();
  });

  it("draws a capped flash and a two-pass bolt during a strike", () => {
    const ctx = createStubContext();
    const alphas: number[] = [];
    let alpha = 1;
    Object.defineProperty(ctx, "globalAlpha", {
      get: () => alpha,
      set: (v: number) => {
        alpha = v;
        alphas.push(v);
      },
    });
    const scene = createLightningScene(() => 0.5);
    scene.resize(W, H, asContext(ctx));
    scene.update(3); // past the first strike (2.75 s)
    scene.draw(asContext(ctx));

    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, W, H);
    expect(alphas[0]).toBeLessThanOrEqual(MAX_FLASH_ALPHA);
    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.stroke).toHaveBeenCalledTimes(2);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });
});
