/**
 * Loads SVG icons from the assets directory
 * @returns Object mapping icon names to their URLs
 */
export function loadIconModules() {
  const svgModules = import.meta.glob("../assets/programming-icons/*.svg", {
    eager: true,
    as: "url",
  });

  const iconNames = Object.keys(svgModules)
    .map((path) => {
      const match = path.match(/\/([^/]+)\.svg$/);
      return match ? match[1] : "";
    })
    .filter(Boolean);

  return { svgModules, iconNames };
}

/**
 * Preloads icon images into memory
 * @param iconNames Array of icon names to load
 * @param svgModules Module object containing SVG URLs
 * @returns Record mapping icon names to loaded Image elements
 */
export function preloadImages(
  iconNames: string[],
  svgModules: Record<string, string>,
): Record<string, HTMLImageElement> {
  const images: Record<string, HTMLImageElement> = {};

  iconNames.forEach((name) => {
    const img = new window.Image();
    const svgPath = Object.keys(svgModules).find((p) =>
      p.endsWith(`/${name}.svg`),
    );
    if (svgPath) {
      img.src = svgModules[svgPath];
      images[name] = img;
    }
  });

  return images;
}
