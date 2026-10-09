// Drawing an SVG <img> at a different size every frame makes the browser
// re-rasterise its paths each time. Rasterise each icon once per target size
// and draw the bitmap instead.
export function createIconRasterizer() {
  const cache = new Map<string, HTMLCanvasElement>();
  let cachedSize = 0;

  return function getIconRaster(name: string, img: HTMLImageElement, size: number): CanvasImageSource {
    if (size !== cachedSize) {
      cache.clear();
      cachedSize = size;
    }
    let raster = cache.get(name);
    if (!raster) {
      raster = document.createElement("canvas");
      raster.width = size;
      raster.height = size;
      raster.getContext("2d")?.drawImage(img, 0, 0, size, size);
      cache.set(name, raster);
    }
    return raster;
  };
}
