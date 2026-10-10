// Shared drawing helpers. Soft shapes (sun glow, cloud puffs, fog banks) all
// reuse one radius-1 radial gradient per scene, positioned with translate +
// scale, so nothing allocates gradients inside the animation loop.

export type RGB = readonly [number, number, number];

export function rgba([r, g, b]: RGB, alpha: number): string {
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Radial gradient of radius 1 at the origin; `stops` are [offset, alpha] pairs of `color`. */
export function createUnitGlow(
  ctx: CanvasRenderingContext2D,
  color: RGB,
  stops: ReadonlyArray<readonly [number, number]>,
): CanvasGradient {
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const [offset, alpha] of stops) gradient.addColorStop(offset, rgba(color, alpha));
  return gradient;
}

/** Fills a unit glow as an ellipse centred on (x, y) with radii (rx, ry) at `alpha`. */
export function fillGlow(
  ctx: CanvasRenderingContext2D,
  glow: CanvasGradient,
  x: number,
  y: number,
  rx: number,
  ry: number,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = glow;
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}
