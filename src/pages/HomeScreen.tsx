import React, { useEffect, useState } from "react";
import HeroTitle from "../components/HeroTitle/HeroTitle";
import IconShowcase from "../components/IconShowcase/IconShowcase";
import WeatherEffect from "../components/WeatherEffects/WeatherEffect";
import { skyForWeatherCode, type WeatherScene } from "../components/WeatherEffects/weatherCodes";
import ItemSphere from "../components/sphere/ItemSphere";
import ToggleSphere from "../components/sphere/ToggleSphere";
import { useOrbOrigin } from "../context/OrbOriginContext";
import { getVisitorLocation } from "../services/location";
import { getCurrentWeather } from "../services/weather";

const HomeScreen: React.FC = () => {
  const { showSphere } = useOrbOrigin();
  const [scene, setScene] = useState<WeatherScene>({ id: "off" });

  useEffect(() => {
    const controller = new AbortController();
    getVisitorLocation(fetch, controller.signal)
      .then(async (location) => {
        const { weatherCode, isDay } = await getCurrentWeather(location.latitude, location.longitude, fetch, controller.signal);
        setScene(skyForWeatherCode(weatherCode, isDay));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // StrictMode unmount / navigation away
        console.error("Failed to load weather:", error);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="relative isolate h-full w-full bg-linear-135 from-background to-card">
      <div className="absolute top-4 right-4 z-20 flex items-start gap-3 md:top-6 md:right-6">
        <ToggleSphere />
      </div>

      <WeatherEffect weather={scene.id} sky={scene.sky} />

      <div className={`fixed inset-0 z-1 transition-opacity duration-400 ${showSphere ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <ItemSphere visible={showSphere} />
      </div>

      <HeroTitle />
      <IconShowcase />
    </div>
  );
};

export default HomeScreen;
