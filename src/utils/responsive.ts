/**
 * Calculates icon size based on screen width
 * @param screenWidth Current screen width in pixels
 * @returns Icon size in pixels
 */
export function getIconSize(screenWidth: number): number {
  if (screenWidth >= 1536) return 80; // 2xl screens
  if (screenWidth >= 1280) return 70; // xl screens
  if (screenWidth >= 1024) return 60; // lg screens
  if (screenWidth >= 768) return 50; // md screens
  return 40; // sm and mobile
}
