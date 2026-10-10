// Clouds: three parallax layers of soft textures, each pre-rendered once to an
// offscreen canvas (3 overlapping radial gradients) and then just drawImage'd.
// Layers scroll right and wrap; lightning brightens them additively.

export type Ctx2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export type TextureCanvas = HTMLCanvasElement | OffscreenCanvas;
export type CreateTextureCanvas = (size: number) => TextureCanvas;

export type CloudSprite = { x: number; y: number; size: number; texture: TextureCanvas };
export type CloudLayer = { depth: number; speed: number; alpha: number; offset: number; clouds: CloudSprite[] };

export const LAYERS = [
  { depth: 0.3, y: 0.1 },
  { depth: 0.6, y: 0.2 },
  { depth: 1.0, y: 0.3 },
] as const;
export const MIN_CLOUD_SIZE = 200;
export const MAX_CLOUD_SIZE = 600;
const Y_JITTER = 40;
const LIGHTNING_GLOW = 0.4;

export const layerSpeed = (depth: number) => 0.15 + depth * 0.25; // px/frame
export const layerBrightness = (depth: number) => 25 + depth * 15;
export const layerAlpha = (depth: number) => 0.7 + depth * 0.3;

export const createTextureCanvas: CreateTextureCanvas = (size) => {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(size, size);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
};

const rgba = (r: number, g: number, b: number, a: number) =>
  `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;

/** Paints one soft cloud: 3 radial gradients jittered ±15% from the centre, slightly blue-tinted grey. */
export function paintCloudTexture(ctx: Ctx2D, size: number, brightness: number, rng: () => number): void {
  const b = brightness;
  for (let i = 0; i < 3; i++) {
    const cx = size / 2 + (rng() * 2 - 1) * 0.15 * size;
    const cy = size / 2 + (rng() * 2 - 1) * 0.15 * size;
    const radius = size * (0.4 + rng() * 0.2);
    const alpha = 0.15 + rng() * 0.1;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, rgba(b + 25, b + 25, b + 30, alpha));
    gradient.addColorStop(0.5, rgba(b, b, b + 15, alpha * 0.6));
    gradient.addColorStop(1, rgba(b - 10, b - 10, b, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
}

export function createCloudLayers(
  width: number,
  height: number,
  rng: () => number = Math.random,
  createCanvas: CreateTextureCanvas = createTextureCanvas,
): CloudLayer[] {
  return LAYERS.map(({ depth, y }) => {
    const count = 5 + Math.floor(rng() * 2);
    const spacing = width / count;
    const clouds: CloudSprite[] = [];

    for (let i = 0; i < count; i++) {
      const size = Math.round(MIN_CLOUD_SIZE + rng() * (MAX_CLOUD_SIZE - MIN_CLOUD_SIZE));
      const texture = createCanvas(size);
      const ctx = texture.getContext("2d") as Ctx2D | null;
      if (ctx) paintCloudTexture(ctx, size, layerBrightness(depth), rng);
      clouds.push({ x: (i + 0.5) * spacing, y: height * y + (rng() * 2 - 1) * Y_JITTER, size, texture });
    }

    return { depth, speed: layerSpeed(depth), alpha: layerAlpha(depth), offset: 0, clouds };
  });
}

/** Scrolls every layer in place, wrapping its offset at the screen width. */
export function updateCloudLayers(layers: CloudLayer[], frames: number, width: number): void {
  if (width <= 0) return;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    layer.offset = (layer.offset + layer.speed * frames) % width;
  }
}

/** Opacity of a layer for the current cloud amount, boosted while lightning is lit. */
export function cloudLayerAlpha(layer: CloudLayer, amount: number, lightningIntensity: number): number {
  return Math.min(1, layer.alpha * amount + lightningIntensity * LIGHTNING_GLOW);
}

/** Draws back to front; each set is drawn at -width, 0 and +width so the wrap is seamless. Off-screen clouds are skipped. */
export function drawCloudLayers(
  ctx: CanvasRenderingContext2D,
  layers: CloudLayer[],
  width: number,
  amount: number,
  lightningIntensity: number,
): void {
  if (amount <= 0) return;
  const lit = lightningIntensity > 0;
  if (lit) ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    ctx.globalAlpha = cloudLayerAlpha(layer, amount, lit ? lightningIntensity : 0);
    for (let loop = -1; loop <= 1; loop++) {
      for (let j = 0; j < layer.clouds.length; j++) {
        const cloud = layer.clouds[j];
        const left = cloud.x + layer.offset + loop * width - cloud.size / 2;
        if (left >= width || left + cloud.size <= 0) continue;
        ctx.drawImage(cloud.texture, left, cloud.y - cloud.size / 2);
      }
    }
  }

  ctx.globalAlpha = 1;
  if (lit) ctx.globalCompositeOperation = "source-over";
}
