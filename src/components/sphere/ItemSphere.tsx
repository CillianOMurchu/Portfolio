import React, { useRef } from "react";
import { usePreloadImages } from "./usePreloadImages";
import { useSphereCanvas } from "./useSphereCanvas";
import type { ItemSphereProps, SphereState } from "./types";
import { generateFibonacciSphere } from "./fibonacciSphere";
import { loadIconModules } from "./iconLoader";
import { useOrbOrigin } from "../../context/OrbOriginContext";

const { svgModules, iconNames } = loadIconModules();
const positions = generateFibonacciSphere(iconNames.length);

const svgUrlMap: Record<string, string> = {};
Object.entries(svgModules).forEach(([path, url]) => {
  const match = path.match(/\/([^/]+)\.svg$/);
  if (match) svgUrlMap[match[1]] = url as string;
});

let globalMountTime: number | null = null;
const persistentState: SphereState = {
  rx: Math.PI * 0.14,
  rz: 0,
  vx: 0.01,
  vy: 0.015,
  baseVx: 0.01,
  baseVy: 0.015,
};

function getPersistentMountTime(): number {
  if (globalMountTime === null) {
    globalMountTime = performance.now();
  }
  return globalMountTime;
}

export const ItemSphere: React.FC<ItemSphereProps> = ({ onIconClick, visible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setHoveredIcon, setClickedIcon, clickedIcon } = useOrbOrigin();

  const imagesRef = usePreloadImages(iconNames, svgModules);
  const mountTime = getPersistentMountTime();

  const handleIconClick = (name: string, screenX: number, screenY: number) => {
    setClickedIcon({ name, screenX, screenY, svgUrl: svgUrlMap[name] ?? "" });
    onIconClick?.(name, screenX, screenY);
  };

  useSphereCanvas({
    canvasRef,
    containerRef,
    positions,
    iconNames,
    images: imagesRef.current,
    persistentState,
    mountTime,
    onIconClick: handleIconClick,
    onIconHover: setHoveredIcon,
    visible,
    highlightedIcon: clickedIcon?.name ?? null,
  });

  return (
    <div
      className="sphere"
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: -1,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
            borderRadius: "50%",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};

export default ItemSphere;
