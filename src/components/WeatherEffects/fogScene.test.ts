import { describe, expect, it } from "vitest";
import { BREATH_SPEED, createFogBanks, createFogScene, FOG_BANK_COUNT, fogBankAlpha, updateFog, type FogBank } from "./fogScene";
import { asContext, createStubContext, seededRng } from "./testUtils";

const W = 1600;
const H = 900;
const TAU = Math.PI * 2;

const bank = (overrides: Partial<FogBank> = {}): FogBank => ({
  x: 800,
  y: 600,
  rx: 400,
  ry: 100,
  speed: 10,
  phase: 0,
  ...overrides,
});

describe("createFogBanks", () => {
  it("creates wide, low banks, deterministically", () => {
    const banks = createFogBanks(20, W, H, 10, seededRng(1));
    expect(banks).toHaveLength(20);
    for (const b of banks) {
      expect(b.y).toBeGreaterThanOrEqual(H * 0.35);
      expect(b.rx).toBeGreaterThan(b.ry);
      expect(b.phase).toBeLessThan(TAU);
    }
    expect(createFogBanks(5, W, H, 10, seededRng(2))).toEqual(createFogBanks(5, W, H, 10, seededRng(2)));
  });
});

describe("updateFog", () => {
  it("drifts banks and advances their breathing", () => {
    const b = bank({ x: 800, speed: 10, phase: 0 });
    updateFog([b], 0.5, W);
    expect(b.x).toBe(805);
    expect(b.phase).toBeCloseTo(BREATH_SPEED * 0.5);
  });

  it("wraps at both edges and keeps phase within one turn", () => {
    const right = bank({ x: W + 399, rx: 400, speed: 10, phase: TAU - 0.0001 });
    const left = bank({ x: -399, rx: 400, speed: -10 });
    updateFog([right, left], 0.5, W);
    expect(right.x).toBe(-400);
    expect(right.phase).toBeLessThan(TAU);
    expect(left.x).toBe(W + 400);
  });
});

describe("fogBankAlpha", () => {
  it("breathes between 0.10 and 0.34 at density 1", () => {
    expect(fogBankAlpha(bank({ phase: Math.PI / 2 }), 1)).toBeCloseTo(0.34);
    expect(fogBankAlpha(bank({ phase: (3 * Math.PI) / 2 }), 1)).toBeCloseTo(0.1);
  });

  it("scales with density and stays within 0–1", () => {
    expect(fogBankAlpha(bank({ phase: Math.PI / 2 }), 0.5)).toBeCloseTo(0.17);
    expect(fogBankAlpha(bank(), 0)).toBe(0);
    expect(fogBankAlpha(bank({ phase: Math.PI / 2 }), 10)).toBe(1);
    expect(fogBankAlpha(bank(), -1)).toBe(0);
  });
});

describe("createFogScene", () => {
  it("draws the haze once plus one glow per bank, with gradients made only on resize", () => {
    const ctx = createStubContext();
    const scene = createFogScene({ density: 1, wind: 10, color: [200, 208, 216] }, seededRng(3));
    scene.resize(W, H, asContext(ctx));
    scene.update(0.016);
    scene.draw(asContext(ctx));
    scene.draw(asContext(ctx));

    expect(ctx.createLinearGradient).toHaveBeenCalledTimes(1);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(1);
    expect(ctx.fillRect).toHaveBeenCalledTimes(2 * (1 + FOG_BANK_COUNT));
    expect(ctx.fillRect).toHaveBeenNthCalledWith(1, 0, 0, W, H);
    expect(ctx.save.mock.calls.length).toBe(ctx.restore.mock.calls.length);
  });
});
