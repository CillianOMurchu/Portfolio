/**
 * Decorative clouds drifting across the top half of the screen, on a single
 * click-through canvas. Renders nothing under reduced motion.
 *
 * Usage:
 *   <CloudEffect />
 *   <CloudEffect coverage={1.5} wind={-30} color={[180, 190, 205]} />
 */
import React, { useCallback } from "react";
import { createCloudScene } from "./cloudScene";
import EffectCanvas from "./EffectCanvas";
import type { RGB } from "./paint";

const DEFAULT_CLOUD_COLOR: RGB = [210, 218, 230];

interface CloudEffectProps {
  /** Cloud-count multiplier; 1 ≈ 8 clouds on a 1920px-wide screen (max 16). */
  coverage?: number;
  /** Drift speed in px/s; positive moves right. */
  wind?: number;
  /** Cloud colour as [r, g, b]. */
  color?: RGB;
  className?: string;
}

const CloudEffect: React.FC<CloudEffectProps> = ({ coverage = 1, wind = 15, color = DEFAULT_CLOUD_COLOR, className }) => {
  const [r, g, b] = color; // depend on the values, so an inline array doesn't restart the scene
  const createScene = useCallback(
    () => createCloudScene({ coverage, wind, color: [r, g, b] }),
    [coverage, wind, r, g, b],
  );
  return <EffectCanvas createScene={createScene} className={className} />;
};

export default CloudEffect;
