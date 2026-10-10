/**
 * Decorative fog: a haze thickening towards the bottom plus slowly drifting
 * fog banks, on a single click-through canvas. Renders nothing under reduced motion.
 *
 * Usage:
 *   <FogEffect />
 *   <FogEffect density={0.6} wind={-8} className="z-0" />
 */
import React, { useCallback } from "react";
import EffectCanvas from "./EffectCanvas";
import { createFogScene } from "./fogScene";
import type { RGB } from "./paint";

const DEFAULT_FOG_COLOR: RGB = [200, 208, 216];

interface FogEffectProps {
  /** Opacity multiplier, 0–1. */
  density?: number;
  /** Drift speed in px/s; positive moves right. */
  wind?: number;
  /** Fog colour as [r, g, b]. */
  color?: RGB;
  className?: string;
}

const FogEffect: React.FC<FogEffectProps> = ({ density = 1, wind = 10, color = DEFAULT_FOG_COLOR, className }) => {
  const [r, g, b] = color; // depend on the values, so an inline array doesn't restart the scene
  const createScene = useCallback(() => createFogScene({ density, wind, color: [r, g, b] }), [density, wind, r, g, b]);
  return <EffectCanvas createScene={createScene} className={className} />;
};

export default FogEffect;
