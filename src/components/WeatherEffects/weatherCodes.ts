// Maps Open-Meteo's WMO weather codes (+ is_day) onto the sky: which picker
// option it corresponds to, and fine-grained settings (light vs heavy rain,
// thunderstorm). Overcast, fog and snow have no effect ("off"). At night
// there's no sun, so clear skies are off too.
// https://open-meteo.com/en/docs#weather_variable_documentation

import type { SkyOptions } from "./skyScene";
import type { WeatherId } from "./weatherOptions";

export interface WeatherScene {
  id: WeatherId;
  /** Sky settings; absent when id is "off". */
  sky?: SkyOptions;
}

type Entry = { id: Exclude<WeatherId, "off">; sun: number; clouds: number; rain: number; lightning: number };
const entry = (id: Entry["id"], sun: number, clouds: number, rain = 0, lightning = 0): Entry => ({ id, sun, clouds, rain, lightning });

const CODES: Record<number, Entry> = {
  0: entry("sunny", 1, 0), // clear sky
  1: entry("sunny", 0.85, 0), // mainly clear
  2: entry("sunny", 0.6, 0), // partly cloudy
  51: entry("rainy", 0.3, 1, 0.2), // drizzle: light / moderate / dense
  53: entry("rainy", 0.3, 1, 0.3),
  55: entry("rainy", 0.25, 1, 0.4),
  56: entry("rainy", 0.3, 1, 0.2), // freezing drizzle
  57: entry("rainy", 0.25, 1, 0.4),
  61: entry("rainy", 0.25, 1, 0.5), // rain: slight / moderate / heavy
  63: entry("rainy", 0.15, 1, 0.75),
  65: entry("rainy", 0.05, 1, 1),
  66: entry("rainy", 0.2, 1, 0.5), // freezing rain
  67: entry("rainy", 0.05, 1, 1),
  80: entry("rainy", 0.3, 0.8, 0.5), // rain showers
  81: entry("rainy", 0.2, 0.9, 0.75),
  82: entry("rainy", 0.05, 1, 1),
  95: entry("stormy", 0, 1, 0.9, 0.8), // thunderstorm
  96: entry("stormy", 0, 1, 1, 1), // thunderstorm with hail
  99: entry("stormy", 0, 1, 1, 1),
};

/** Overcast (3), fog (45, 48), snow (71–77, 85, 86) and unknown codes: no effect. */
export function skyForWeatherCode(code: number, isDay: boolean): WeatherScene {
  const match = CODES[code];
  if (!match) return { id: "off" };
  const { id, sun, clouds, rain, lightning } = match;
  if (id === "sunny" && !isDay) return { id: "off" }; // a clear night: nothing to show
  return { id, sky: { weather: isDay ? sun : 0, clouds, rain, lightning } };
}
