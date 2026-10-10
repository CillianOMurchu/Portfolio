// Sun: a soft golden-hour glow spreading from the top-left corner, drawn last.
//
// The sky canvas is never cleared, so the glow is re-stamped every frame on top
// of its own faded previous frame. Each stop's per-frame alpha is solved so the
// glow settles at exactly its target opacity instead of building up past it.

/** [offset, r, g, b, target opacity at full sun]. */
export const SUN_STOPS = [
  [0, 255, 214, 140, 0.26],
  [0.3, 255, 180, 90, 0.12],
  [0.65, 255, 130, 50, 0.04],
  [1, 255, 100, 30, 0],
] as const;

export function sunLayout(width: number, height: number): { x: number; y: number; radius: number } {
  return { x: 0, y: 0, radius: Math.hypot(width, height) * 0.85 };
}

/**
 * Per-frame alpha that settles at `target` when the canvas is faded by `fade` (0–1) before each stamp:
 * x = x(1 - fade)(1 - t) + t  ⇒  t = target·fade / (1 - target·(1 - fade)).
 */
export function stampAlpha(target: number, fade: number): number {
  if (fade >= 1 || target <= 0) return target;
  return (target * fade) / (1 - target * (1 - fade));
}

/** Built once per size/weather (not per frame). `weather` 0–1 scales the glow; `fade` is the sky's per-frame fade. */
export function createSunGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  weather: number,
  fade: number,
): CanvasGradient {
  const { x, y, radius } = sunLayout(width, height);
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  for (const [offset, r, g, b, target] of SUN_STOPS) {
    const alpha = stampAlpha(target * weather, fade);
    gradient.addColorStop(offset, `rgba(${r},${g},${b},${Number(alpha.toFixed(4))})`);
  }
  return gradient;
}

export function drawSun(ctx: CanvasRenderingContext2D, gradient: CanvasGradient, width: number, height: number): void {
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
