// Node environment (no DOM): rendered to static markup. The open menu is Radix's
// and isn't exercised here; the trigger, options and effect switch are.
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import WeatherEffect from "./WeatherEffect";
import WeatherPicker from "./WeatherPicker";
import type { SkyOptions } from "./skyScene";
import { getWeatherOption, isWeatherId, SKY_PRESETS, WEATHER_OPTIONS } from "./weatherOptions";

// Replace the sky with a marker so the switch's choice (and sky settings) show in the markup.
vi.mock("./SkyEffect", () => ({
  default: (props: SkyOptions) => <i data-effect="sky" data-sky={JSON.stringify(props)} />,
}));

const skyMarker = (sky: SkyOptions) => `<i data-effect="sky" data-sky="${JSON.stringify(sky).replace(/"/g, "&quot;")}"></i>`;

describe("weatherOptions", () => {
  it("offers off plus sunny, rainy and stormy, with unique ids", () => {
    const ids = WEATHER_OPTIONS.map((o) => o.id);
    expect(ids).toEqual(["off", "sunny", "rainy", "stormy"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("recognises valid ids only", () => {
    expect(isWeatherId("stormy")).toBe(true);
    expect(isWeatherId("snowy")).toBe(false);
    expect(isWeatherId("cloudy")).toBe(false);
    expect(isWeatherId("foggy")).toBe(false);
    expect(isWeatherId("")).toBe(false);
  });

  it("looks up an option by id", () => {
    expect(getWeatherOption("stormy").label).toBe("Stormy");
  });
});

describe("<WeatherEffect />", () => {
  it.each(["sunny", "rainy", "stormy"] as const)("renders the sky with the %s preset", (weather) => {
    expect(renderToStaticMarkup(<WeatherEffect weather={weather} />)).toBe(skyMarker(SKY_PRESETS[weather]));
  });

  it("uses explicit sky settings (e.g. from the weather API) over the preset", () => {
    const sky = { weather: 0.1, rain: 0.4, lightning: 0, clouds: 1 };
    expect(renderToStaticMarkup(<WeatherEffect weather="rainy" sky={sky} />)).toBe(skyMarker(sky));
  });

  it("renders nothing when off", () => {
    expect(renderToStaticMarkup(<WeatherEffect weather="off" />)).toBe("");
  });
});

describe("SKY_PRESETS", () => {
  it("runs from storm (0) to sun (1), with rainy having no lightning", () => {
    expect(SKY_PRESETS.stormy.weather).toBe(0);
    expect(SKY_PRESETS.sunny.weather).toBe(1);
    expect(SKY_PRESETS.rainy.lightning).toBe(0);
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
