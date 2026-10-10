import { describe, expect, it } from "vitest";
import {
  BOLT_FADE,
  BOLT_STEPS,
  buildBoltPath,
  createBolt,
  createLightning,
  drawBolts,
  drawFlash,
  MAX_FLASH_ALPHA,
  MIN_STRIKE_GAP,
  updateLightning,
} from "./lightningScene";
import { asContext, createStubContext, recordAssignments, seededRng } from "./testUtils";

const W = 1200;
const H = 800;

/** rng that returns the given values in order, then `fallback`. */
function sequence(values: number[], fallback = 0.5): () => number {
  let i = 0;
  return () => (i < values.length ? values[i++] : fallback);
}

describe("buildBoltPath", () => {
  it("interpolates start → end in 10 steps with ±30px jitter and 1–3× widths", () => {
    const { points, widths } = buildBoltPath(100, 0, 300, 500, 1, seededRng(1));
    expect(points).toHaveLength((BOLT_STEPS + 1) * 2);
    expect(widths).toHaveLength(BOLT_STEPS);
    expect([points[0], points[1]]).toEqual([100, 0]);
    for (let i = 0; i <= BOLT_STEPS; i++) {
      const t = i / BOLT_STEPS;
      expect(Math.abs(points[i * 2] - (100 + 200 * t))).toBeLessThanOrEqual(30 + 1e-3);
      expect(points[i * 2 + 1]).toBeCloseTo(500 * t);
    }
    for (const w of widths) {
      expect(w).toBeGreaterThanOrEqual(1);
      expect(w).toBeLessThanOrEqual(3);
    }
  });
});

describe("createBolt", () => {
  it("runs from the top edge to 20–60% down, ±200px across", () => {
    const rng = seededRng(2);
    for (let n = 0; n < 50; n++) {
      const bolt = createBolt(W, H, rng);
      const endX = bolt.points[BOLT_STEPS * 2];
      const endY = bolt.points[BOLT_STEPS * 2 + 1];
      expect(bolt.points[1]).toBe(0);
      expect(endY).toBeGreaterThanOrEqual(H * 0.2 - 1e-3);
      expect(endY).toBeLessThanOrEqual(H * 0.6 + 1e-3);
      expect(Math.abs(endX - bolt.points[0])).toBeLessThanOrEqual(230 + 1e-3);
      expect(bolt.brightness).toBeGreaterThanOrEqual(0.5);
      expect(bolt.life).toBe(1);
    }
  });

  it("sometimes branches from 60% along, thinner and heading down", () => {
    const rng = seededRng(3);
    const bolts = Array.from({ length: 100 }, () => createBolt(W, H, rng));
    const branched = bolts.filter((b) => b.branch);
    expect(branched.length).toBeGreaterThan(20);
    expect(branched.length).toBeLessThan(80);
    for (const b of branched) {
      expect(b.branch!.points[0]).toBe(b.points[12]);
      expect(b.branch!.points[1]).toBe(b.points[13]);
      expect(b.branch!.points[BOLT_STEPS * 2 + 1]).toBeGreaterThan(b.points[13] + 49);
      for (const w of b.branch!.widths) expect(w).toBeLessThanOrEqual(1.8 + 1e-6);
    }
  });
});

describe("updateLightning", () => {
  it("never strikes at zero frequency", () => {
    const state = createLightning();
    for (let i = 0; i < 1000; i++) updateLightning(state, 1, 0, W, H, () => 0);
    expect(state.active).toBe(false);
    expect(state.bolts).toHaveLength(0);
  });

  it("starts a strike with a 8–20 frame timer and full intensity", () => {
    const state = createLightning();
    updateLightning(state, 1, 1, W, H, () => 0);
    expect(state.active).toBe(true);
    expect(state.intensity).toBeCloseTo(1 - 0.06);
    expect(state.timer).toBeCloseTo(8 - 1);
    expect(state.bolts).toHaveLength(1);
  });

  it("can double-strike ~80 ms later", () => {
    const state = createLightning();
    // strike roll, timer, bolt (start, end x, end y, 10 jitter + widths…), branch roll, brightness, double-strike roll
    updateLightning(state, 1, 1, W, H, sequence([0], 0.1));
    expect(state.doubleStrikeIn).toBeGreaterThan(0);
    for (let i = 0; i < 5; i++) updateLightning(state, 1, 1, W, H, () => 0.5);
    expect(state.bolts).toHaveLength(2);
  });

  it("fades intensity, ends the strike, and waits out a cooldown", () => {
    const state = createLightning();
    updateLightning(state, 1, 1, W, H, () => 0); // strike, timer 8
    for (let i = 0; i < 10; i++) updateLightning(state, 1, 1, W, H, () => 0.99);
    expect(state.active).toBe(false);
    expect(state.intensity).toBe(0);

    for (let i = 0; i < MIN_STRIKE_GAP - 5; i++) updateLightning(state, 1, 1, W, H, () => 0);
    expect(state.active).toBe(false); // still cooling down despite rng 0
  });

  it("ages bolts by 0.12 per frame and drops dead ones", () => {
    const state = createLightning();
    state.bolts.push(createBolt(W, H, () => 0.5));
    updateLightning(state, 1, 0, W, H);
    expect(state.bolts[0].life).toBeCloseTo(1 - BOLT_FADE);
    for (let i = 0; i < 10; i++) updateLightning(state, 1, 0, W, H);
    expect(state.bolts).toHaveLength(0);
  });

  it("never flashes more than three times in any one second (WCAG 2.3.1)", () => {
    const rng = seededRng(42);
    const state = createLightning();
    const strikes: number[] = [];
    for (let frame = 0; frame < 60 * 600; frame++) {
      updateLightning(state, 1, 1, W, H, rng);
      // A bolt added this frame has aged exactly one frame.
      for (const bolt of state.bolts) if (bolt.life === 1 - BOLT_FADE) strikes.push(frame / 60);
    }
    expect(strikes.length).toBeGreaterThan(100); // ~10 minutes of storm
    for (let i = 3; i < strikes.length; i++) expect(strikes[i] - strikes[i - 3]).toBeGreaterThan(1);
  });
});

describe("drawing", () => {
  it("flashes faintly only when flagged", () => {
    const ctx = createStubContext();
    const state = createLightning();
    drawFlash(asContext(ctx), state, W, H);
    expect(ctx.fillRect).not.toHaveBeenCalled();

    const alphas = recordAssignments(ctx, "globalAlpha");
    Object.assign(state, { flash: true, intensity: 0.9 });
    drawFlash(asContext(ctx), state, W, H);
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, W, H);
    expect(alphas[0]).toBeCloseTo(0.9 * MAX_FLASH_ALPHA);
  });

  it("strokes each segment twice: wide glow, then white core", () => {
    const ctx = createStubContext();
    const widths = recordAssignments(ctx, "lineWidth");
    const bolt = { ...createBolt(W, H, sequence([0.5, 0.5, 0.5], 0.5)), branch: null };
    drawBolts(asContext(ctx), [bolt]);

    expect(ctx.stroke).toHaveBeenCalledTimes(BOLT_STEPS * 2);
    expect(widths[0]).toBeCloseTo(bolt.widths[0] * 10);
    expect(widths[1]).toBeCloseTo(bolt.widths[0] * 1.5);
    expect(ctx.shadowBlur).toBe(20);
    expect(ctx.save).toHaveBeenCalledTimes(1);
    expect(ctx.restore).toHaveBeenCalledTimes(1);
  });
});
