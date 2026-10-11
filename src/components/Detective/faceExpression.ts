// Picks the face's expression from how close the pointer is to its centre.

export type Expression = "neutral" | "curious" | "happy";

/** Face radius as a fraction of half the SVG's size (r=90 in a 200 viewBox). */
export const FACE_RADIUS_RATIO = 0.9;
/** "Close" means within this many face radii of the centre. */
export const NEAR_FACTOR = 1.6;

/** On the face → happy; near it → curious; otherwise neutral. */
export function getExpression(distance: number, radius: number): Expression {
  if (distance <= radius) return "happy";
  if (distance <= radius * NEAR_FACTOR) return "curious";
  return "neutral";
}
