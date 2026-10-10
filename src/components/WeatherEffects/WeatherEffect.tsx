// Renders the sky for a weather id ("off" renders nothing), using the picker
// preset unless `sky` (e.g. from skyForWeatherCode) is given.
import React from "react";
import type { SkyOptions } from "./skyScene";
import SkyEffect from "./SkyEffect";
import { SKY_PRESETS, type WeatherId } from "./weatherOptions";

interface WeatherEffectProps {
  weather: WeatherId;
  sky?: SkyOptions;
}

const WeatherEffect: React.FC<WeatherEffectProps> = ({ weather, sky }) => {
  if (weather === "off") return null;
  return <SkyEffect {...(sky ?? SKY_PRESETS[weather])} />;
};

export default WeatherEffect;
