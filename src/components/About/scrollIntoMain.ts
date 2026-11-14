// Pages scroll inside App's fixed <main>, whose box is exactly the visible area
// between the navbar and footer. Scroll it just enough to show all of `el`; if
// `el` is taller than the view, line its top up with the top instead.
//
// `box` lets a caller pass where `el` *will* be (e.g. a panel that is still
// opening), so the scroll can start straight away instead of after the layout settles.
const GAP = 24;
const DURATION_MS = 320;

export interface Box {
  top: number;
  bottom: number;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// A short eased scroll driven per frame. Unlike scrollBy({ behavior: "smooth" }),
// it keeps going while the page is still growing (the browser clamps each frame).
function animateScroll(main: HTMLElement, delta: number) {
  const start = main.scrollTop;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    main.scrollTop = start + delta;
    return;
  }
  const startedAt = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - startedAt) / DURATION_MS);
    main.scrollTop = start + delta * easeOutCubic(t);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function scrollIntoMain(el: HTMLElement, box: Box = el.getBoundingClientRect()): void {
  const main = el.closest("main");
  if (!main) return;

  const view = main.getBoundingClientRect();
  const aboveTop = box.top - GAP - view.top; // < 0: top is hidden above
  const belowBottom = box.bottom + GAP - view.bottom; // > 0: bottom is hidden below

  const delta = aboveTop < 0 ? aboveTop : belowBottom > 0 ? Math.min(belowBottom, aboveTop) : 0;
  if (Math.abs(delta) < 2) return;
  animateScroll(main, delta);
}
