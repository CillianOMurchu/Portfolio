import { describe, expect, it } from "vitest";
import { createRainScene, dropCountFor, MAX_DROPS } from "./rainScene";
import { asContext, createStubContext, seededRng } from "./testUtils";

const OPTIONS = { intensity: 1, wind: 0, color: "rgba(174,194,224,0.5)" };

describe("dropCountFor", () => {
  it("scales with area and intensity", () => {
    expect(dropCountFor(800, 600, 1)).toBe(48);
    expect(dropCountFor(800, 600, 2)).toBe(96);
    expect(dropCountFor(800, 600, 0)).toBe(0);
    expect(dropCountFor(800, 600, -1)).toBe(0);
  });

  it("caps the total number of drops", () => {
    expect(dropCountFor(3840, 2160, 10)).toBe(MAX_DROPS);
  });
});

describe("createRainScene", () => {
  it("draws every drop in one path with a single stroke per frame", () => {
    const ctx = createStubContext();
    const scene = createRainScene(OPTIONS, seededRng(1));
    scene.resize(800, 600, asContext(ctx));
    scene.update(0.016);
    scene.draw(asContext(ctx));

    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.moveTo).toHaveBeenCalledTimes(48);
    expect(ctx.lineTo).toHaveBeenCalledTimes(48);
    expect(ctx.stroke).toHaveBeenCalledTimes(1);
    expect(ctx.strokeStyle).toBe(OPTIONS.color);
  });

  it("moves drops between frames", () => {
    const ctx = createStubContext();
    const scene = createRainScene(OPTIONS, seededRng(2));
    scene.resize(800, 600, asContext(ctx));
    scene.draw(asContext(ctx));
    const before = ctx.moveTo.mock.calls.map(([, y]) => y as number);

    ctx.moveTo.mockClear();
    scene.update(0.01);
    scene.draw(asContext(ctx));
    const after = ctx.moveTo.mock.calls.map(([, y]) => y as number);

    const moved = after.filter((y, i) => y > before[i]);
    expect(moved.length).toBeGreaterThan(0);
  });

  it("slants streaks with the wind", () => {
    const ctx = createStubContext();
    const scene = createRainScene({ ...OPTIONS, wind: 200 }, seededRng(3));
    scene.resize(800, 600, asContext(ctx));
    scene.draw(asContext(ctx));
    const [x0] = ctx.moveTo.mock.calls[0] as number[];
    const [x1] = ctx.lineTo.mock.calls[0] as number[];
    expect(x1).toBeGreaterThan(x0);
  });

  it("draws nothing when there are no drops", () => {
    const ctx = createStubContext();
    const scene = createRainScene({ ...OPTIONS, intensity: 0 });
    scene.resize(800, 600, asContext(ctx));
    scene.draw(asContext(ctx));
    expect(ctx.stroke).not.toHaveBeenCalled();
  });
});
