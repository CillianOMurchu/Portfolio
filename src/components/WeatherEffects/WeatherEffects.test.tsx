// The Vitest environment is `node` (no DOM), so components are rendered to
// static markup; their canvas loops are covered by the scene and driver tests.
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import SkyEffect from "./SkyEffect";

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal("window", {
    matchMedia: (query: string) => ({ matches: reduce && query === "(prefers-reduced-motion: reduce)" }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("<SkyEffect />", () => {
  it("renders a decorative, click-through canvas behind its parent's content", () => {
    stubReducedMotion(false);
    const html = renderToStaticMarkup(<SkyEffect weather={0} />);
    expect(html).toMatch(/^<canvas /);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("absolute");
    expect(html).toContain("-z-10");
    expect(html).not.toContain("fixed");
    expect(html).not.toMatch(/(^|\s)z-10/);
  });

  it("renders nothing when prefers-reduced-motion is reduce", () => {
    stubReducedMotion(true);
    expect(renderToStaticMarkup(<SkyEffect weather={0} />)).toBe("");
  });
});
