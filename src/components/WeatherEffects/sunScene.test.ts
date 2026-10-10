import { describe, expect, it, vi } from "vitest";
import { createSunGradient, drawSun, stampAlpha, SUN_STOPS, sunLayout } from "./sunScene";
import { asContext, createStubContext } from "./testUtils";

describe("sunLayout", () => {
  it("spreads the glow from the top-left corner across most of the screen", () => {
    const { x, y, radius } = sunLayout(1200, 900);
    expect([x, y]).toEqual([0, 0]);
    expect(radius).toBeCloseTo(1500 * 0.85);
  });
});

describe("stampAlpha", () => {
  it("settles at exactly the target opacity when re-stamped onto a fading canvas", () => {
    for (const [target, fade] of [[0.26, 0.3], [0.12, 0.4], [0.5, 0.1]]) {
      const t = stampAlpha(target, fade);
      let x = 0;
      for (let frame = 0; frame < 500; frame++) x = x * (1 - fade) * (1 - t) + t;
      expect(x).toBeCloseTo(target, 6);
      expect(t).toBeLessThan(target); // a naive re-stamp at `target` would overshoot
    }
  });

  it("is the target itself when nothing persists, and 0 for 0", () => {
    expect(stampAlpha(0.3, 1)).toBe(0.3);
    expect(stampAlpha(0, 0.3)).toBe(0);
  });
});

describe("createSunGradient", () => {
  it("is centred on the top-left corner with stamp alphas scaled by weather", () => {
    const ctx = createStubContext();
    createSunGradient(asContext(ctx), 1200, 900, 0.5, 0.3);
    const [x0, y0, r0, x1, y1, r1] = ctx.createRadialGradient.mock.calls[0] as number[];
    expect([x0, y0, r0, x1, y1]).toEqual([0, 0, 0, 0, 0]);
    expect(r1).toBeCloseTo(1275);

    const gradient = ctx.createRadialGradient.mock.results[0].value as { addColorStop: ReturnType<typeof vi.fn> };
    const stops = gradient.addColorStop.mock.calls as [number, string][];
    expect(stops.map(([offset]) => offset)).toEqual(SUN_STOPS.map(([offset]) => offset));
    const firstAlpha = Number(stops[0][1].match(/,([\d.]+)\)$/)?.[1]);
    expect(firstAlpha).toBeCloseTo(stampAlpha(SUN_STOPS[0][4] * 0.5, 0.3), 3);
    expect(stops[3][1]).toBe("rgba(255,100,30,0)");
  });

  it("is gentle: no stop targets more than 30% opacity", () => {
    expect(Math.max(...SUN_STOPS.map((stop) => stop[4]))).toBeLessThanOrEqual(0.3);
  });
});

describe("drawSun", () => {
  it("fills the whole canvas with the gradient", () => {
    const ctx = createStubContext();
    const gradient = {} as CanvasGradient;
    drawSun(asContext(ctx), gradient, 1000, 800);
    expect(ctx.fillStyle).toBe(gradient);
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 1000, 800);
  });
});
