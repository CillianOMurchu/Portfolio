import type { ProjectedIcon } from './types';

export function findIconAt(
  x: number,
  y: number,
  icons: ProjectedIcon[],
): ProjectedIcon | null {
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
    const distanceToEdge = Math.max(0, distance - icon.scaledIconSize / 2);
    minDistance = Math.min(minDistance, distanceToEdge);
  }

  return Math.min(minDistance / slowdownRadius, 1);
}
