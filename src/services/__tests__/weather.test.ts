import { describe, it, expect, vi } from "vitest";
import { buildWeatherUrl, getCurrentWeather } from "../weather";

const LAT = 36.72;
const LON = -4.42;

function mockFetch(body: unknown, init: { ok?: boolean; status?: number; statusText?: string } = {}) {
  const { ok = true, status = 200, statusText = "OK" } = init;
  return vi.fn<typeof fetch>().mockResolvedValue({
    ok,
    status,
    statusText,
    json: () => Promise.resolve(body),
  } as Response);
}

const sample = (is_day: number) => ({
  latitude: LAT,
  longitude: LON,
  current_units: { time: "iso8601", interval: "seconds", weather_code: "wmo code", is_day: "" },
  current: { time: "2026-10-10T12:00", interval: 900, weather_code: 3, is_day },
});

describe("getCurrentWeather", () => {
  it("maps a daytime response (is_day: 1 -> true)", async () => {
    const result = await getCurrentWeather(LAT, LON, mockFetch(sample(1)));
    expect(result).toEqual({ weatherCode: 3, isDay: true });
  });

  it("maps a night-time response (is_day: 0 -> false)", async () => {
    const result = await getCurrentWeather(LAT, LON, mockFetch(sample(0)));
    expect(result).toEqual({ weatherCode: 3, isDay: false });
  });

  it("builds the correct URL", async () => {
    const fetchFn = mockFetch(sample(1));
    await getCurrentWeather(LAT, LON, fetchFn);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const url = new URL(String(fetchFn.mock.calls[0][0]));
    expect(url.origin + url.pathname).toBe("https://api.open-meteo.com/v1/forecast");
    expect(url.searchParams.get("latitude")).toBe("36.72");
    expect(url.searchParams.get("longitude")).toBe("-4.42");
    expect(url.searchParams.get("current")).toBe("weather_code,is_day");
    expect(buildWeatherUrl(LAT, LON)).toBe(String(fetchFn.mock.calls[0][0]));
  });

  it("passes the abort signal through to fetch", async () => {
    const fetchFn = mockFetch(sample(1));
    const controller = new AbortController();
    await getCurrentWeather(LAT, LON, fetchFn, controller.signal);
    expect(fetchFn.mock.calls[0][1]).toEqual({ signal: controller.signal });
  });

  it("rejects with a descriptive error on a non-OK response", async () => {
    const fetchFn = mockFetch({}, { ok: false, status: 500, statusText: "Internal Server Error" });
    await expect(getCurrentWeather(LAT, LON, fetchFn)).rejects.toThrow(
      "Weather request failed: 500 Internal Server Error",
    );
  });

  it("propagates network failures", async () => {
    const networkError = new TypeError("Failed to fetch");
    const fetchFn = vi.fn<typeof fetch>().mockRejectedValue(networkError);
    await expect(getCurrentWeather(LAT, LON, fetchFn)).rejects.toBe(networkError);
  });

  it("rejects when 'current' is missing", async () => {
    await expect(getCurrentWeather(LAT, LON, mockFetch({ latitude: LAT }))).rejects.toThrow(
      "Malformed weather response: missing 'current'",
    );
  });

  it("rejects when 'current.weather_code' is missing", async () => {
    await expect(getCurrentWeather(LAT, LON, mockFetch({ current: { is_day: 1 } }))).rejects.toThrow(
      "missing 'current.weather_code'",
    );
  });

  it("rejects when 'current.is_day' is missing", async () => {
    await expect(getCurrentWeather(LAT, LON, mockFetch({ current: { weather_code: 3 } }))).rejects.toThrow(
      "missing 'current.is_day'",
    );
  });
});
