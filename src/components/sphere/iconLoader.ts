export function loadIconModules() {
  const svgModules = import.meta.glob("../../assets/programming-icons/*.svg", {
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
