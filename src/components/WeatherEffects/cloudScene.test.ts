import { describe, expect, it, vi } from "vitest";
import {
  cloudLayerAlpha,
  createCloudLayers,
  drawCloudLayers,
  layerAlpha,
  layerBrightness,
  layerSpeed,
  LAYERS,
  MAX_CLOUD_SIZE,
  MIN_CLOUD_SIZE,
  paintCloudTexture,
  updateCloudLayers,
  type CloudLayer,
  type CreateTextureCanvas,
} from "./cloudScene";
import { asContext, createStubContext, recordAssignments, seededRng } from "./testUtils";

const W = 1600;
const H = 900;

function stubTextureFactory() {
  const contexts: ReturnType<typeof createStubContext>[] = [];
  const create = vi.fn((size: number) => {
    const ctx = createStubContext();
    contexts.push(ctx);
    return { width: size, height: size, getContext: () => ctx } as unknown as OffscreenCanvas;
  }) satisfies CreateTextureCanvas;
  return { create, contexts };
}

describe("layer parameters", () => {
  it("follow depth: farther layers are slower, darker and fainter", () => {
    expect(layerSpeed(0.3)).toBeCloseTo(0.225);
    expect(layerSpeed(1)).toBeCloseTo(0.4);
    expect(layerBrightness(0.6)).toBeCloseTo(34);
    expect(layerAlpha(0.3)).toBeCloseTo(0.79);
    expect(layerAlpha(1)).toBeCloseTo(1);
  });
});

describe("paintCloudTexture", () => {
  it("paints 3 radial gradients with blue-tinted grey stops", () => {
    const ctx = createStubContext();
    paintCloudTexture(asContext(ctx), 400, 30, () => 0.5);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(3);
    expect(ctx.fillRect).toHaveBeenCalledTimes(3);
    const gradient = ctx.createRadialGradient.mock.results[0].value as { addColorStop: ReturnType<typeof vi.fn> };
    expect(gradient.addColorStop.mock.calls).toEqual([
      [0, "rgba(55,55,60,0.2)"],
      [0.5, "rgba(30,30,45,0.12)"],
      [1, "rgba(20,20,30,0)"],
    ]);
  });
});

describe("createCloudLayers", () => {
  it("builds 3 layers of 5–6 evenly spaced, pre-rendered clouds", () => {
    const { create, contexts } = stubTextureFactory();
    const layers = createCloudLayers(W, H, seededRng(1), create);

    expect(layers.map((l) => l.depth)).toEqual(LAYERS.map((l) => l.depth));
    const total = layers.reduce((n, l) => n + l.clouds.length, 0);
    expect(create).toHaveBeenCalledTimes(total);
    expect(contexts.every((c) => c.createRadialGradient.mock.calls.length === 3)).toBe(true);

    layers.forEach((layer, i) => {
      expect(layer.clouds.length).toBeGreaterThanOrEqual(5);
      expect(layer.clouds.length).toBeLessThanOrEqual(6);
      const spacing = W / layer.clouds.length;
      layer.clouds.forEach((cloud, j) => {
        expect(cloud.x).toBeCloseTo((j + 0.5) * spacing);
        expect(Math.abs(cloud.y - H * LAYERS[i].y)).toBeLessThanOrEqual(40);
        expect(cloud.size).toBeGreaterThanOrEqual(MIN_CLOUD_SIZE);
        expect(cloud.size).toBeLessThanOrEqual(MAX_CLOUD_SIZE);
      });
    });
  });
});

describe("updateCloudLayers", () => {
  it("scrolls by speed per frame and wraps at the width", () => {
    const layer: CloudLayer = { depth: 1, speed: 0.4, alpha: 1, offset: W - 0.2, clouds: [] };
    updateCloudLayers([layer], 1, W);
    expect(layer.offset).toBeCloseTo(0.2);
  });
});

describe("drawCloudLayers", () => {
  const texture = {} as OffscreenCanvas;
  const layer = (offset: number): CloudLayer => ({
    depth: 1,
    speed: 0.4,
    alpha: 0.8,
    offset,
    clouds: [{ x: 100, y: 200, size: 200, texture }],
  });

  it("draws visible copies of the set only, and wraps seamlessly", () => {
    const ctx = createStubContext();
    drawCloudLayers(asContext(ctx), [layer(0)], W, 1, 0);
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
    expect(ctx.drawImage).toHaveBeenCalledWith(texture, 0, 100);

    ctx.drawImage.mockClear();
    drawCloudLayers(asContext(ctx), [layer(W - 50)], W, 1, 0); // straddles the right edge
    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
    expect(ctx.drawImage).toHaveBeenCalledWith(texture, W - 50, 100);
    expect(ctx.drawImage).toHaveBeenCalledWith(texture, -50, 100);
  });

  it("scales opacity by the cloud amount and skips at zero", () => {
    const ctx = createStubContext();
    const alphas = recordAssignments(ctx, "globalAlpha");
    drawCloudLayers(asContext(ctx), [layer(0)], W, 0.5, 0);
    expect(alphas[0]).toBeCloseTo(0.4);
    expect(ctx.globalCompositeOperation).toBe("source-over");

    ctx.drawImage.mockClear();
    drawCloudLayers(asContext(ctx), [layer(0)], W, 0, 0);
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });

  it("lights clouds additively during lightning", () => {
    const ctx = createStubContext();
    const ops = recordAssignments(ctx, "globalCompositeOperation");
    drawCloudLayers(asContext(ctx), [layer(0)], W, 1, 1);
    expect(ops).toEqual(["lighter", "source-over"]);
    expect(cloudLayerAlpha(layer(0), 1, 1)).toBe(1);
    expect(cloudLayerAlpha(layer(0), 0.5, 0.5)).toBeCloseTo(0.6);
  });
});
