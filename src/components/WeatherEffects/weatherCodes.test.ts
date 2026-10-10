import { describe, expect, it } from "vitest";
import { skyForWeatherCode } from "./weatherCodes";

describe("skyForWeatherCode", () => {
  it("clear sky by day is full sun with nothing else", () => {
    expect(skyForWeatherCode(0, true)).toEqual({ id: "sunny", sky: { weather: 1, clouds: 0, rain: 0, lightning: 0 } });
  });

  it("partly cloudy is a dimmer sun", () => {
    expect(skyForWeatherCode(2, true)).toEqual({ id: "sunny", sky: { weather: 0.6, clouds: 0, rain: 0, lightning: 0 } });
  });

  it("clear nights show nothing", () => {
    for (const code of [0, 1, 2]) expect(skyForWeatherCode(code, false)).toEqual({ id: "off" });
  });

  it("overcast, fog, snow and unknown codes show nothing", () => {
    for (const code of [3, 45, 48, 71, 73, 75, 77, 85, 86, 42]) {
      expect(skyForWeatherCode(code, true)).toEqual({ id: "off" });
    }
  });

  it("grades rain by intensity, without lightning", () => {
    const rain = [51, 61, 63, 65].map((code) => skyForWeatherCode(code, true));
    expect(rain.every((r) => r.id === "rainy" && r.sky?.lightning === 0)).toBe(true);
    const amounts = rain.map((r) => r.sky?.rain ?? 0);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
    expect(amounts[3]).toBe(1);
  });

  it("keeps rain at night, without the sun", () => {
    expect(skyForWeatherCode(63, false)).toMatchObject({ id: "rainy", sky: { weather: 0, rain: 0.75 } });
  });

  it("thunderstorms are dark, rainy and electric", () => {
    for (const code of [95, 96, 99]) {
      const { id, sky } = skyForWeatherCode(code, true);
      expect(id).toBe("stormy");
      expect(sky?.weather).toBe(0);
      expect(sky?.lightning).toBeGreaterThan(0.5);
    }
  });
});
