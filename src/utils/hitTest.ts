import type { ProjectedIcon } from "../types/sphere";

/**
 * Finds the topmost icon at given screen coordinates
 * @param x Screen X coordinate
 * @param y Screen Y coordinate
 * @param icons Array of projected icons
 * @returns The icon at that position, or null
 */
export function findIconAt(
  x: number,
  y: number,
  icons: ProjectedIcon[],
): ProjectedIcon | null {
  // Front-to-back (highest z first) so nearest icon wins
  const sorted = [...icons].sort((a, b) => b.z - a.z);

  for (const icon of sorted) {
    const half = icon.scaledIconSize / 2;
    if (
      x >= icon.x2d - half &&
      x <= icon.x2d + half &&
      y >= icon.y2d - half &&
      y <= icon.y2d + half
    ) {
      return icon;
    }
  }

  return null;
}

/**
 * Calculates normalized distance to the nearest icon
 * @param x Screen X coordinate
 * @param y Screen Y coordinate
 * @param icons Array of projected icons
 * @param slowdownRadius Distance at which slowdown begins (default 100px)
 * @returns Normalized distance (0 = touching icon, 1 = far away)
 */
export function getDistanceToNearestIcon(
  x: number,
  y: number,
  icons: ProjectedIcon[],
  slowdownRadius = 100,
): number {
  if (icons.length === 0) return 1;

  let minDistance = Infinity;

  for (const icon of icons) {
    const dx = x - icon.x2d;
    const dy = y - icon.y2d;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Distance to icon edge (not center)
    const distanceToEdge = Math.max(0, distance - icon.scaledIconSize / 2);
    minDistance = Math.min(minDistance, distanceToEdge);
  }

  return Math.min(minDistance / slowdownRadius, 1);
}
