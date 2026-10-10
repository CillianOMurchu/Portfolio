import { describe, expect, it, vi } from "vitest";
import type { CreateTextureCanvas } from "./cloudScene";
import { DROP_COUNT, MAX_PARTICLES } from "./rainSimulation";
import { createSkyScene, fadeForFrames, resolveSky, skyBackground } from "./skyScene";
import { asContext, createStubContext, recordAssignments, seededRng } from "./testUtils";

const W = 1200;
const H = 800;
const FRAME = 1 / 60;

const stubTexture: CreateTextureCanvas = (size) =>
  ({ width: size, height: size, getContext: () => createStubContext() }) as unknown as OffscreenCanvas;

function runScene(options: Parameters<typeof createSkyScene>[0], frames = 3) {
  const ctx = createStubContext();
  const scene = createSkyScene(options, { rng: seededRng(1), createCanvas: stubTexture });
  scene.resize(W, H, asContext(ctx));
  for (let i = 0; i < frames; i++) {
    scene.update(FRAME);
    scene.draw(asContext(ctx));
  }
  return { ctx, scene };
}

describe("resolveSky", () => {
  it("defaults rain, lightning and clouds to 1 - weather", () => {
    expect(resolveSky({ weather: 0.25 })).toEqual({ weather: 0.25, rain: 0.75, lightning: 0.75, clouds: 0.75 });
  });

  it("keeps explicit values and clamps everything to 0–1", () => {
    expect(resolveSky({ weather: 2, rain: 0.3, lightning: -1, clouds: 5 })).toEqual({
      weather: 1,
      rain: 0.3,
      lightning: 0,
      clouds: 1,
    });
  });
});

describe("skyBackground", () => {
  it("is black for storm and warm amber-brown for sun, fading faster in a storm", () => {
    expect(skyBackground(0)).toEqual({ color: "rgb(0,0,0)", alpha: 0.4 });
    expect(skyBackground(1).color).toBe("rgb(45,28,0)");
    expect(skyBackground(1).alpha).toBeCloseTo(0.3);
  });

  it("rescales the per-frame fade for longer/shorter frames", () => {
    expect(fadeForFrames(0.4, 1)).toBeCloseTo(0.4);
    expect(fadeForFrames(0.4, 2)).toBeCloseTo(0.64);
    expect(fadeForFrames(0.4, 0)).toBe(0);
  });
});

describe("createSkyScene", () => {
  it("never clears; starts opaque, then paints a translucent background each frame", () => {
    const ctx = createStubContext();
    const scene = createSkyScene({ weather: 0 }, { rng: seededRng(2), createCanvas: stubTexture });
    expect(scene.clearEachFrame).toBe(false);

    const alphas = recordAssignments(ctx, "globalAlpha");
    scene.resize(W, H, asContext(ctx));
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, W, H);
    expect(alphas).toHaveLength(0); // opaque initial fill

    scene.update(FRAME);
    scene.draw(asContext(ctx));
    expect(ctx.clearRect).not.toHaveBeenCalled();
    expect(alphas).toContain(0.4);
  });

  it("full storm: all 1200 drops, clouds and no sun", () => {
    const { ctx } = runScene({ weather: 0 });
    expect(ctx.moveTo.mock.calls.length).toBeGreaterThanOrEqual(3 * DROP_COUNT); // rain streaks
    expect(ctx.drawImage).toHaveBeenCalled(); // clouds
    expect(ctx.createRadialGradient).not.toHaveBeenCalled(); // no sun
  });

  it("rain thins with weather: only floor(1200 * rain) drops are drawn", () => {
    const { ctx } = runScene({ weather: 0.5, lightning: 0, clouds: 0 }, 1);
    expect(ctx.moveTo).toHaveBeenCalledTimes(Math.floor(DROP_COUNT * 0.5));
  });

  it("full sun: no rain or clouds, sun gradient built once and drawn each frame", () => {
    const { ctx } = runScene({ weather: 1 }, 3);
    expect(ctx.moveTo).not.toHaveBeenCalled();
    expect(ctx.drawImage).not.toHaveBeenCalled();
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(1);
    // 1 initial fill + per frame: background + sun
    expect(ctx.fillRect).toHaveBeenCalledTimes(1 + 3 * 2);
  });

  it("overcast: clouds without rain or lightning", () => {
    const { ctx, scene } = runScene({ weather: 0.5, rain: 0, lightning: 0, clouds: 1 }, 600);
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.moveTo).not.toHaveBeenCalled();
    expect(ctx.stroke).not.toHaveBeenCalled(); // no bolts in 10 s
    expect(scene.clearEachFrame).toBe(false);
  });

  it("storms produce lightning bolts within a minute", () => {
    const { ctx } = runScene({ weather: 0, rain: 0 }, 60 * 60); // rain off: 1200 drops × 3600 frames of mock calls is too much
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.globalCompositeOperation).toBe("source-over"); // restored after lit clouds
  });

  it("first frame (dt = 0) doesn't fade or re-stamp clouds and sun", () => {
    const ctx = createStubContext();
    const scene = createSkyScene({ weather: 1 }, { rng: seededRng(3), createCanvas: stubTexture });
    scene.resize(W, H, asContext(ctx));
    ctx.fillRect.mockClear();
    scene.update(0);
    scene.draw(asContext(ctx));
    expect(ctx.fillRect).toHaveBeenCalledTimes(1); // background at alpha 0 only, no sun
  });

  it("splashes steadily at random rather than in synchronised bursts", () => {
    const ctx = createStubContext();
    const scene = createSkyScene({ weather: 0, lightning: 0, clouds: 0 }, { rng: seededRng(4), createCanvas: stubTexture });
    scene.resize(W, H, asContext(ctx));

    const live: number[] = [];
    for (let frame = 0; frame < 600; frame++) {
      vi.clearAllMocks(); // keep mock call logs small
      scene.update(FRAME);
      scene.draw(asContext(ctx));
      if (frame >= 120) live.push(ctx.fillRect.mock.calls.length - 1); // minus the background fill
    }

    // Never saturates the pool (saturation is what caused fill-up / empty-out pulses)…
    expect(Math.max(...live)).toBeLessThan(MAX_PARTICLES);
    // …and the live count stays close to its average instead of swinging between empty and full.
    const mean = live.reduce((a, b) => a + b, 0) / live.length;
    expect(mean).toBeGreaterThan(20);
    expect(Math.min(...live)).toBeGreaterThan(mean * 0.3);
    expect(Math.max(...live)).toBeLessThan(mean * 2);
  });
});
