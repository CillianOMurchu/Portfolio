import { describe, expect, it } from "vitest";
import { createSunScene, PULSE_PERIOD, RAY_COUNT, ROTATION_SPEED, sunLayout, sunPulse, updateSun } from "./sunScene";
import { asContext, createStubContext } from "./testUtils";

const COLOR = [255, 210, 120] as const;

describe("updateSun", () => {
  it("advances time and rotation", () => {
    const state = { time: 0, rotation: 0 };
    updateSun(state, 0.5);
    expect(state.time).toBe(0.5);
    expect(state.rotation).toBeCloseTo(ROTATION_SPEED * 0.5);
  });

  it("keeps rotation within one turn", () => {
    const state = { time: 0, rotation: Math.PI * 2 - 0.001 };
    updateSun(state, 1);
    expect(state.rotation).toBeGreaterThanOrEqual(0);
    expect(state.rotation).toBeLessThan(Math.PI * 2);
  });
});

describe("sunPulse", () => {
  it("breathes between 0.7 and 1 once per period", () => {
    expect(sunPulse(0)).toBeCloseTo(0.85);
    expect(sunPulse(PULSE_PERIOD / 4)).toBeCloseTo(1);
    expect(sunPulse((3 * PULSE_PERIOD) / 4)).toBeCloseTo(0.7);
    expect(sunPulse(PULSE_PERIOD)).toBeCloseTo(sunPulse(0));
  });
});

describe("sunLayout", () => {
  it("puts the sun top-right with a radius relative to the screen", () => {
    expect(sunLayout(1000, 800)).toEqual({ x: 850, y: 80, radius: Math.hypot(1000, 800) * 0.35 });
  });
});

describe("createSunScene", () => {
  it("draws nothing before it has been sized", () => {
    const ctx = createStubContext();
    createSunScene({ color: COLOR, intensity: 1 }).draw(asContext(ctx));
    expect(ctx.fill).not.toHaveBeenCalled();
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });

  it("draws all rays with one fill, plus the glow, and restores state", () => {
    const ctx = createStubContext();
    const scene = createSunScene({ color: COLOR, intensity: 1 });
    scene.resize(1000, 800, asContext(ctx));
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2); // created once, not per frame

    scene.update(0.016);
    scene.draw(asContext(ctx));
    scene.draw(asContext(ctx));

    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(2);
    expect(ctx.fill).toHaveBeenCalledTimes(2);
    expect(ctx.moveTo).toHaveBeenCalledTimes(RAY_COUNT * 2);
    expect(ctx.fillRect).toHaveBeenCalledTimes(2); // the glow
    expect(ctx.save.mock.calls.length).toBe(ctx.restore.mock.calls.length);
  });

  it("clamps opacity to 1 for high intensity", () => {
    const ctx = createStubContext();
    const scene = createSunScene({ color: COLOR, intensity: 5 });
    scene.resize(1000, 800, asContext(ctx));
    scene.draw(asContext(ctx));
    expect(ctx.globalAlpha).toBeLessThanOrEqual(1);
  });
});
