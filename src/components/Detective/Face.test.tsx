// Node environment (no DOM): rendered to static markup. Checks which variant of
// each feature is visible for each expression. Pointer tracking is covered by
// getExpression's tests.
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Face from "./Face";
import FaceView from "./FaceView";
import type { Expression } from "./faceExpression";

/** The element carrying `data-state="<state>"`, parsed just enough to read its classes. */
function classesOf(markup: string, attr: string): string {
  const match = markup.match(new RegExp(`<[^>]*${attr}[^>]*>`));
  if (!match) throw new Error(`no element with ${attr}`);
  const element = match[0];
  return element.match(/class="([^"]*)"/)?.[1] ?? "";
}

const render = (expression: Expression) => renderToStaticMarkup(<FaceView expression={expression} />);
const isShown = (markup: string, attr: string) => classesOf(markup, attr).includes("opacity-100");

describe("FaceView", () => {
  it("is labelled for assistive tech and exposes its expression", () => {
    const markup = render("curious");
    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="A round face"');
    expect(markup).toContain('data-expression="curious"');
  });

  it("neutral: open eyes, resting brows, line mouth, no blush", () => {
    const markup = render("neutral");
    expect(isShown(markup, 'data-state="open"')).toBe(true);
    expect(isShown(markup, 'data-state="closed"')).toBe(false);
    expect(markup).toContain('data-state="rest"');
    expect(isShown(markup, 'data-state="line"')).toBe(true);
    expect(isShown(markup, 'data-state="o"')).toBe(false);
    expect(isShown(markup, 'data-state="smile"')).toBe(false);
    expect(isShown(markup, 'data-part="cheeks"')).toBe(false);
  });

  it("curious: raised brows and an o mouth", () => {
    const markup = render("curious");
    expect(markup).toContain('data-state="raised"');
    expect(classesOf(markup, 'data-state="raised"')).toContain("-translate-y-");
    expect(isShown(markup, 'data-state="open"')).toBe(true);
    expect(isShown(markup, 'data-state="o"')).toBe(true);
    expect(isShown(markup, 'data-state="line"')).toBe(false);
    expect(isShown(markup, 'data-part="cheeks"')).toBe(false);
  });

  it("happy: closed eyes, smile and blushing cheeks", () => {
    const markup = render("happy");
    expect(isShown(markup, 'data-state="closed"')).toBe(true);
    expect(isShown(markup, 'data-state="open"')).toBe(false);
    expect(markup).toContain('data-state="rest"');
    expect(isShown(markup, 'data-state="smile"')).toBe(true);
    expect(isShown(markup, 'data-state="o"')).toBe(false);
    expect(isShown(markup, 'data-part="cheeks"')).toBe(true);
  });

  it("grows the features in after the circle, in order", () => {
    const markup = render("neutral");
    expect(classesOf(markup, 'data-part="eyes"')).toContain("delay-400");
    expect(classesOf(markup, 'data-part="brows"')).toContain("delay-600");
    expect(classesOf(markup, 'data-part="mouth"')).toContain("delay-800");
  });
});

describe("Face", () => {
  it("starts neutral", () => {
    expect(renderToStaticMarkup(<Face />)).toContain('data-expression="neutral"');
  });
});
