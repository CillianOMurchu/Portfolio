// Open-Meteo current-weather lookup (free, no API key).

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export interface CurrentWeather {
  weatherCode: number;
  isDay: boolean;
}

interface OpenMeteoResponse {
  current?: {
    weather_code?: unknown;
    is_day?: unknown;
  };
}

export function buildWeatherUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "weather_code,is_day",
  });
  return `${OPEN_METEO_URL}?${params.toString()}`;
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  fetchFn: typeof fetch = fetch,
  signal?: AbortSignal,
): Promise<CurrentWeather> {
  const response = await fetchFn(buildWeatherUrl(lat, lon), { signal });

  if (!response.ok) {
    throw new Error(`Weather request failed: ${response.status} ${response.statusText}`.trim());
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data?.current;

  if (!current) {
    throw new Error("Malformed weather response: missing 'current'");
  }
  if (typeof current.weather_code !== "number") {
    throw new Error("Malformed weather response: missing 'current.weather_code'");
  }
  if (typeof current.is_day !== "number") {
    throw new Error("Malformed weather response: missing 'current.is_day'");
  }

  return { weatherCode: current.weather_code, isDay: current.is_day === 1 };
}
