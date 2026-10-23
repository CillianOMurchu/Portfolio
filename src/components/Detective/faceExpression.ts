// Picks the face's expression from how close the pointer is to its centre.

export type Expression = "neutral" | "curious" | "happy" | "sad";

/** How long the face sulks after the pointer leaves it. */
export const SULK_MS = 5000;

/** Face radius as a fraction of half the SVG's size (r=90 in a 200 viewBox). */
export const FACE_RADIUS_RATIO = 0.9;
/** "Close" means within this many face radii of the centre. */
export const NEAR_FACTOR = 2.5;

/** On the face → happy; near it → curious; otherwise neutral. */
export function getExpression(distance: number, radius: number): Exclude<Expression, "sad"> {
  if (distance <= radius) return "happy";
  if (distance <= radius * NEAR_FACTOR) return "curious";
  return "neutral";
}

/**
 * The expression after a pointer move, given what proximity alone says and the
 * current expression. Leaving the face after a blush starts a sulk (sad), which
 * holds until SULK_MS runs out (handled by the caller) or the pointer touches
 * the face again, which always blushes at once.
 */
export function nextExpression(proximity: Exclude<Expression, "sad">, current: Expression): Expression {
  if (proximity === "happy") return "happy";
  if (current === "happy" || current === "sad") return "sad";
  return proximity;
}

export interface Gaze {
  x: number;
  y: number;
}

/** Furthest the eyes move from rest, in viewBox units (eye radius is 7). */
export const MAX_GAZE = 9;
/** Pointer distance (viewBox units) at which the eyes are half-way to MAX_GAZE. */
export const GAZE_FALLOFF = 60;

/**
 * Where the eyes look for a pointer at (dx, dy) from the face centre, in
 * viewBox units: towards the pointer, easing out so they never leave the face.
 */
export function getGaze(dx: number, dy: number): Gaze {
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };
  const reach = (MAX_GAZE * distance) / (distance + GAZE_FALLOFF);
  return { x: (dx / distance) * reach, y: (dy / distance) * reach };
}
