export function getIconSize(screenWidth: number): number {
  if (screenWidth >= 1536) return 80;
  if (screenWidth >= 1280) return 70;
  if (screenWidth >= 1024) return 60;
  if (screenWidth >= 768) return 50;
  return 40;
}
