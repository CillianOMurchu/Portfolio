/**
 * Decorative full-viewport rain, drawn on a single canvas. Clicks pass through it,
 * and it renders nothing when the user prefers reduced motion.
 *
 * Usage:
 *   <RainEffect />                                  // light rain
 *   <RainEffect intensity={2} wind={-120} />        // heavier, blowing left
 *   <RainEffect color="rgba(255,255,255,0.4)" className="z-0" />
 */
import React, { useCallback } from "react";
import EffectCanvas from "./EffectCanvas";
import { createRainScene } from "./rainScene";

const DEFAULT_RAIN_COLOR = "rgba(174,194,224,0.5)";

interface RainEffectProps {
  /** Drops per 10,000 px² of viewport (capped at 500 drops in total). Default 1 ≈ 207 drops at 1080p. */
  intensity?: number;
  /** Horizontal drift in px/s; positive blows right. */
  wind?: number;
  /** Any canvas strokeStyle colour. */
  color?: string;
  className?: string;
}

const RainEffect: React.FC<RainEffectProps> = ({ intensity = 1, wind = 0, color = DEFAULT_RAIN_COLOR, className }) => {
  const createScene = useCallback(() => createRainScene({ intensity, wind, color }), [intensity, wind, color]);
  return <EffectCanvas createScene={createScene} className={className} />;
};

export default RainEffect;
