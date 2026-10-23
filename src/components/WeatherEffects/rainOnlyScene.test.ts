import { describe, expect, it } from "vitest";
import { DROP_COUNT } from "./rainSimulation";
import { createRainOnlyScene } from "./rainOnlyScene";
import { asContext, createStubContext, seededRng } from "./testUtils";

describe("createRainOnlyScene", () => {
  it("clears each frame (transparent) and never paints a background", () => {
    const ctx = createStubContext();
    const scene = createRainOnlyScene(0.1, seededRng(1));
    expect(scene.clearEachFrame).not.toBe(false);
    scene.resize(800, 600, asContext(ctx));
    scene.update(0.016);
    scene.draw(asContext(ctx));
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });

  it("draws a streak for each active drop", () => {
    const ctx = createStubContext();
    const scene = createRainOnlyScene(0.1, seededRng(2));
    scene.resize(800, 600, asContext(ctx));
    scene.update(0.016);
    scene.draw(asContext(ctx));
    expect(ctx.moveTo).toHaveBeenCalledTimes(Math.floor(DROP_COUNT * 0.1));
  });

  it("clamps density to 0–1", () => {
    const ctx = createStubContext();
    const none = createRainOnlyScene(-1, seededRng(3));
    none.resize(800, 600, asContext(ctx));
    none.update(0.016);
    none.draw(asContext(ctx));
    expect(ctx.moveTo).not.toHaveBeenCalled();
  });
});
