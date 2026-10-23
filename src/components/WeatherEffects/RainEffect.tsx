/**
 * Constant light rain behind the page content, on a transparent canvas (the
 * sky scene's rain without its sky). The parent must create a stacking context
 * (e.g. `isolate`). Renders nothing under reduced motion.
 *
 * Usage:
 *   <RainEffect />                 // light drizzle
 *   <RainEffect density={0.3} />   // heavier
 */
import React, { useCallback } from "react";
import { cn } from "../../lib/utils";
import EffectCanvas from "./EffectCanvas";
import { createRainOnlyScene } from "./rainOnlyScene";

export const LIGHT_RAIN_DENSITY = 0.08;

interface RainEffectProps {
  /** Fraction (0–1) of the sky scene's 1200 drops. */
  density?: number;
  className?: string;
}

const RainEffect: React.FC<RainEffectProps> = ({ density = LIGHT_RAIN_DENSITY, className }) => {
  const createScene = useCallback(() => createRainOnlyScene(density), [density]);
  return <EffectCanvas createScene={createScene} className={cn("absolute -z-10", className)} />;
};

export default RainEffect;
