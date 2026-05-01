import { useEffect, useRef } from "react";
import { preloadImages } from "../utils/iconLoader";

/**
 * Hook to preload icon images
 * @param iconNames Array of icon names
 * @param svgModules SVG module imports
 * @returns Ref containing loaded images
 */
export function usePreloadImages(
  iconNames: string[],
  svgModules: Record<string, string>,
) {
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    if (Object.keys(imagesRef.current).length === iconNames.length) return;
    imagesRef.current = preloadImages(iconNames, svgModules);
  }, [iconNames, svgModules]);

  return imagesRef;
}
