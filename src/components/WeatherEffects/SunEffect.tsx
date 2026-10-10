/**
 * Decorative sunshine: a warm glow in the top-right corner with slowly rotating
 * rays, on a single click-through canvas. Renders nothing under reduced motion.
 *
 * Usage:
 *   <SunEffect />
 *   <SunEffect intensity={0.6} color={[255, 170, 80]} className="z-0" />
 */
import React, { useCallback } from "react";
import EffectCanvas from "./EffectCanvas";
import type { RGB } from "./paint";
import { createSunScene } from "./sunScene";

const DEFAULT_SUN_COLOR: RGB = [255, 210, 120];

interface SunEffectProps {
  /** Opacity multiplier, 0–1. */
  intensity?: number;
  /** Glow colour as [r, g, b]. */
  color?: RGB;
  className?: string;
}

const SunEffect: React.FC<SunEffectProps> = ({ intensity = 1, color = DEFAULT_SUN_COLOR, className }) => {
  const [r, g, b] = color; // depend on the values, so an inline array doesn't restart the scene
  const createScene = useCallback(() => createSunScene({ intensity, color: [r, g, b] }), [intensity, r, g, b]);
  return <EffectCanvas createScene={createScene} className={className} />;
};

export default SunEffect;
