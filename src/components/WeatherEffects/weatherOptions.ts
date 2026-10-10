// The weather effects the picker offers, in menu order.
import { CloudLightning, CloudOff, CloudRain, Sun, type LucideIcon } from "lucide-react";
import type { SkyOptions } from "./skyScene";

export const WEATHER_OPTIONS = [
  { id: "off", label: "Off", icon: CloudOff },
  { id: "sunny", label: "Sunny", icon: Sun },
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

/** Sky settings for the picker's options (0 = storm … 1 = sun). */
export const SKY_PRESETS: Record<Exclude<WeatherId, "off">, SkyOptions> = {
  sunny: { weather: 1 },
  rainy: { weather: 0.2, lightning: 0 },
  stormy: { weather: 0 },
};
