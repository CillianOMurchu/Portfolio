// WCAG contrast check for the light and dark themes in src/index.css.
// Text pairs need 4.5:1 (AA body text); borders, focus and accent fills need 3:1 (non-text, WCAG 1.4.11).
// Translucent tokens are composited over the surface they sit on. Exits 1 if any pair fails.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(`${selector} {\n  /*`);
  const alt = start === -1 ? css.indexOf(`${selector} {`) : start;
  const body = css.slice(alt, css.indexOf("\n}", alt));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
}

const light = block(":root");
const dark = { ...light, ...block('[data-theme="dark"]') };

function resolve(vars, name, seen = 0) {
  const v = vars[name];
  if (!v) throw new Error(`--${name} is not defined`);
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  return ref && seen < 10 ? resolve(vars, ref[1], seen + 1) : v;
}

function parse(value) {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)).concat(1);
  const rgba = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const [r, g, b, a = 1] = rgba[1].split(",").map(Number);
    return [r, g, b, a];
  }
  throw new Error(`Can't parse colour ${value}`);
}

const over = ([r, g, b, a], [R, G, B]) => [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a), 1];
const lum = (c) => {
  const [r, g, b] = c.slice(0, 3).map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const SURFACES = ["surface-page", "surface-card", "surface-sunken", "surface-overlay"];
const TEXT = ["text-strong", "text-body", "text-muted", "text-faint", "accent-text", "highlight-text", "danger", "success"];
const NON_TEXT = ["border-default", "border-strong", "border-focus", "accent", "highlight"];
const PAIRS = [
  ...SURFACES.flatMap((bg) => TEXT.map((fg) => [fg, bg, 4.5])),
  ...["surface-page", "surface-card"].flatMap((bg) => NON_TEXT.map((fg) => [fg, bg, 3])),
  ["accent-text", "accent-soft", 4.5],
  ["highlight-text", "highlight-soft", 4.5],
  ["text-strong", "accent-soft", 4.5],
  ["text-on-accent", "accent", 4.5],
  ["text-inverse", "surface-inverse", 4.5],
  ["selection-fg", "selection-bg", 4.5],
];

let failed = 0;
for (const [theme, vars] of [["light", light], ["dark", dark]]) {
  console.log(`\n${theme}`);
  const page = parse(resolve(vars, "surface-page"));
  for (const [fg, bg, min] of PAIRS) {
    const back = over(parse(resolve(vars, bg)), page);
    const r = ratio(over(parse(resolve(vars, fg)), back), back);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${r.toFixed(2).padStart(5)}  ${fg} on ${bg} (min ${min})`);
  }
}
console.log(failed ? `\n${failed} pair(s) below WCAG AA.` : "\nAll pairs meet WCAG AA.");
process.exit(failed ? 1 : 0);
