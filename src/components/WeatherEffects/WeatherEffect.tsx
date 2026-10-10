// Renders the effect for a weather id ("off" renders nothing).
import React from "react";
import CloudEffect from "./CloudEffect";
import FogEffect from "./FogEffect";
import RainEffect from "./RainEffect";
import StormEffect from "./StormEffect";
import SunEffect from "./SunEffect";
import type { WeatherId } from "./weatherOptions";

const WeatherEffect: React.FC<{ weather: WeatherId }> = ({ weather }) => {
  switch (weather) {
    case "sunny":
      return <SunEffect />;
    case "cloudy":
      return <CloudEffect />;
    case "foggy":
      return <FogEffect />;
    case "rainy":
      return <RainEffect />;
    case "stormy":
      return <StormEffect />;
    case "off":
      return null;
  }
};

export default WeatherEffect;
