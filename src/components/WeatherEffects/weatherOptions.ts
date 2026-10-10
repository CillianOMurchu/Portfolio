// The weather effects the picker offers, in menu order.
import { Cloud, CloudFog, CloudLightning, CloudOff, CloudRain, Sun, type LucideIcon } from "lucide-react";

export const WEATHER_OPTIONS = [
  { id: "off", label: "Off", icon: CloudOff },
  { id: "sunny", label: "Sunny", icon: Sun },
  { id: "cloudy", label: "Cloudy", icon: Cloud },
  { id: "foggy", label: "Foggy", icon: CloudFog },
  { id: "rainy", label: "Rainy", icon: CloudRain },
  { id: "stormy", label: "Stormy", icon: CloudLightning },
] as const satisfies ReadonlyArray<{ id: string; label: string; icon: LucideIcon }>;

export type WeatherId = (typeof WEATHER_OPTIONS)[number]["id"];

export function isWeatherId(value: string): value is WeatherId {
  return WEATHER_OPTIONS.some((option) => option.id === value);
}

export function getWeatherOption(id: WeatherId) {
  return WEATHER_OPTIONS.find((option) => option.id === id) ?? WEATHER_OPTIONS[0];
}
