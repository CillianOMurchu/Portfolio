// Pages scroll inside App's fixed <main>, whose box is exactly the visible area
// between the navbar and footer. Scroll it just enough to show all of `el`; if
// `el` is taller than the view, line its top up with the top instead.
const GAP = 24;

export function scrollIntoMain(el: HTMLElement): void {
  const main = el.closest("main");
  if (!main) return;

  const view = main.getBoundingClientRect();
  const box = el.getBoundingClientRect();
  const aboveTop = box.top - GAP - view.top; // < 0: top is hidden above
  const belowBottom = box.bottom + GAP - view.bottom; // > 0: bottom is hidden below

  const delta = aboveTop < 0 ? aboveTop : belowBottom > 0 ? Math.min(belowBottom, aboveTop) : 0;
  if (delta === 0) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  main.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
}
