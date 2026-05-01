import React, { useRef } from "react";
import { usePreloadImages } from "../hooks/usePreloadImages";
import { useSphereCanvas } from "../hooks/useSphereCanvas";
import type { ItemSphereProps, SphereState } from "../types/sphere";
import { generateFibonacciSphere } from "../utils/fibonacciSphere";
import { loadIconModules } from "../utils/iconLoader";

const { svgModules, iconNames } = loadIconModules();

// Global persistent state (survives React strict mode double-mount)
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

export const ItemSphere: React.FC<ItemSphereProps> = ({ onIconClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const positions = generateFibonacciSphere(iconNames.length);
  const imagesRef = usePreloadImages(iconNames, svgModules);
  const mountTime = getPersistentMountTime();

  useSphereCanvas({
    canvasRef,
    containerRef,
    positions,
    iconNames,
    images: imagesRef.current,
    persistentState,
    mountTime,
    onIconClick,
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
