/**
 * Full sky behind the page content: storm-dark or golden-hour background, parallax
 * clouds, lightning, angled rain with splashes, and a sun glow, on one opaque canvas.
 * The parent must create a stacking context (e.g. `isolate`) so `-z-10` stays
 * behind its content. Renders nothing under reduced motion.
 *
 * Usage:
 *   <SkyEffect weather={0} />                                // thunderstorm
 *   <SkyEffect weather={0.2} lightning={0} />                // rain, no lightning
 *   <SkyEffect {...skyForWeatherCode(code, isDay).sky} />    // from the weather API
 */
import React, { useCallback } from "react";
import { cn } from "../../lib/utils";
import EffectCanvas from "./EffectCanvas";
import { createSkyScene, type SkyOptions } from "./skyScene";

interface SkyEffectProps extends SkyOptions {
  className?: string;
}

const SkyEffect: React.FC<SkyEffectProps> = ({ weather, rain, lightning, clouds, className }) => {
  const createScene = useCallback(
    () => createSkyScene({ weather, rain, lightning, clouds }),
    [weather, rain, lightning, clouds],
  );
  return <EffectCanvas createScene={createScene} className={cn("absolute -z-10", className)} />;
};

export default SkyEffect;
