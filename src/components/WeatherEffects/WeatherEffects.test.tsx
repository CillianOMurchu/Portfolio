// The Vitest environment is `node` (no DOM), so components are rendered to
// static markup; their canvas loops are covered by canvasScene.test.ts.
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type React from "react";
import CloudEffect from "./CloudEffect";
import FogEffect from "./FogEffect";
import RainEffect from "./RainEffect";
import StormEffect from "./StormEffect";
import SunEffect from "./SunEffect";

const EFFECTS: Array<[string, React.FC<{ className?: string }>]> = [
  ["RainEffect", RainEffect],
  ["SunEffect", SunEffect],
  ["CloudEffect", CloudEffect],
  ["FogEffect", FogEffect],
  ["StormEffect", StormEffect],
];

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal("window", {
    matchMedia: (query: string) => ({ matches: reduce && query === "(prefers-reduced-motion: reduce)" }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each(EFFECTS)("<%s />", (_name, Effect) => {
  it("renders a decorative, click-through, full-viewport canvas", () => {
    stubReducedMotion(false);
    const html = renderToStaticMarkup(<Effect />);
    expect(html).toMatch(/^<canvas /);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("fixed");
    expect(html).toContain("inset-0");
  });

  it("lets className override the default stacking", () => {
    stubReducedMotion(false);
    const html = renderToStaticMarkup(<Effect className="z-0" />);
    expect(html).toContain("z-0");
    expect(html).not.toContain("z-10");
  });

  it("renders nothing when prefers-reduced-motion is reduce", () => {
    stubReducedMotion(true);
    expect(renderToStaticMarkup(<Effect />)).toBe("");
  });
});
