/**
 * Decorative thunderstorm: heavy wind-blown rain with occasional lightning,
 * on a single click-through canvas. Renders nothing under reduced motion.
 * Lightning stays well under WCAG's three-flashes-per-second limit (see lightningScene.ts).
 *
 * Usage:
 *   <StormEffect />
 *   <StormEffect intensity={3} wind={200} />
 */
import React, { useCallback } from "react";
import { composeScenes } from "./canvasScene";
import EffectCanvas from "./EffectCanvas";
import { createLightningScene } from "./lightningScene";
import { createRainScene } from "./rainScene";

const DEFAULT_STORM_RAIN_COLOR = "rgba(160,180,210,0.55)";

interface StormEffectProps {
  /** Rain drops per 10,000 px² of viewport (capped at 500 drops in total). */
  intensity?: number;
  /** Horizontal drift of the rain in px/s; positive blows right. */
  wind?: number;
  /** Rain colour, any canvas strokeStyle. */
  color?: string;
  className?: string;
}

const StormEffect: React.FC<StormEffectProps> = ({
  intensity = 2.5,
  wind = -150,
  color = DEFAULT_STORM_RAIN_COLOR,
  className,
}) => {
  // Lightning first so the rain is drawn over the flash.
  const createScene = useCallback(
    () => composeScenes(createLightningScene(), createRainScene({ intensity, wind, color })),
    [intensity, wind, color],
  );
  return <EffectCanvas createScene={createScene} className={className} />;
};

export default StormEffect;
