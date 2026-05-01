import type { Position3D } from "../types/sphere";

/**
 * Applies 3D rotation transformations to a point
 * @param pos Original 3D position
 * @param rx Rotation around X axis (radians)
 * @param rz Rotation around Z axis (radians)
 * @returns Rotated 3D position
 */
export function rotatePoint(
  pos: Position3D,
  rx: number,
  rz: number,
): Position3D {
  const { x, y, z } = pos;

  // Rotate around X axis
  const y1 = y * Math.cos(rx) - z * Math.sin(rx);
  const z1 = y * Math.sin(rx) + z * Math.cos(rx);

  // Rotate around Z axis
  const x2 = x * Math.cos(rz) - z1 * Math.sin(rz);
  const z2 = x * Math.sin(rz) + z1 * Math.cos(rz);

  return { x: x2, y: y1, z: z2 };
}
