// Node environment (no DOM): rendered to static markup. The open menu is Radix's
// and isn't exercised here; the trigger, options and effect switch are.
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WeatherEffect from "./WeatherEffect";
import WeatherPicker from "./WeatherPicker";
import { getWeatherOption, isWeatherId, WEATHER_OPTIONS } from "./weatherOptions";

// Replace each effect with a marker so the switch's choice is visible in the markup.
vi.mock("./SunEffect", () => ({ default: () => <i data-effect="sun" /> }));
vi.mock("./CloudEffect", () => ({ default: () => <i data-effect="cloud" /> }));
vi.mock("./FogEffect", () => ({ default: () => <i data-effect="fog" /> }));
vi.mock("./RainEffect", () => ({ default: () => <i data-effect="rain" /> }));
vi.mock("./StormEffect", () => ({ default: () => <i data-effect="storm" /> }));

describe("weatherOptions", () => {
  it("offers off plus the five effects, with unique ids", () => {
    const ids = WEATHER_OPTIONS.map((o) => o.id);
    expect(ids).toEqual(["off", "sunny", "cloudy", "foggy", "rainy", "stormy"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("recognises valid ids only", () => {
    expect(isWeatherId("stormy")).toBe(true);
    expect(isWeatherId("snowy")).toBe(false);
    expect(isWeatherId("")).toBe(false);
  });

  it("looks up an option by id", () => {
    expect(getWeatherOption("foggy").label).toBe("Foggy");
  });
});

describe("<WeatherEffect />", () => {
  it.each([
    ["sunny", "sun"],
    ["cloudy", "cloud"],
    ["foggy", "fog"],
    ["rainy", "rain"],
    ["stormy", "storm"],
  ] as const)("renders the %s effect", (weather, marker) => {
    expect(renderToStaticMarkup(<WeatherEffect weather={weather} />)).toBe(`<i data-effect="${marker}"></i>`);
  });

  it("renders nothing when off", () => {
    expect(renderToStaticMarkup(<WeatherEffect weather="off" />)).toBe("");
  });
});

describe("<WeatherPicker />", () => {
  it("labels the trigger with the current choice", () => {
    const html = renderToStaticMarkup(<WeatherPicker value="rainy" onChange={() => {}} />);
    expect(html).toContain('aria-label="Weather effect: Rainy"');
    expect(html).toContain('aria-haspopup="menu"');
  });

  it("uses the outline style when off and the filled style when on", () => {
    expect(renderToStaticMarkup(<WeatherPicker value="off" onChange={() => {}} />)).toContain('data-variant="outline"');
    expect(renderToStaticMarkup(<WeatherPicker value="sunny" onChange={() => {}} />)).toContain('data-variant="default"');
  });
});
