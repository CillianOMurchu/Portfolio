// Generates the IconShowcase brand tokens in src/index.css (between the brand-tokens markers).
// Each brand gets --brand-<name> (raw brand colour, for tints and glows) and --brand-<name>-text,
// the brand colour darkened (light theme) or lightened (dark theme) until it reaches 4.5:1 on every
// surface. Neutral brands (white/near-black logos) alias the theme's text colour instead.
// Run after changing BRANDS or the surface tokens: `npm run brand:tokens`.
import { readFileSync, writeFileSync } from "node:fs";

const BRANDS = {
  angular: "#dd0031",
  figma: "#f24e1e",
  firebase: "#ffca28",
  gitlab: "#fc6d26",
  javascript: "#f7df1e",
  jest: "#c21325",
  jira: "#0052cc",
  mongodb: "#47a248",
  node: "#68a063",
  postman: "#ef5b25",
  puppeteer: "#00d8a2",
  react: "#61dafb",
  rust: "#ce4a00",
  rxjs: "#b7178c",
  sass: "#cc6699",
  stencil: "#4c50bf",
  storybook: "#ff4785",
  tailwind: "#38bdf8",
  typescript: "#3178c6",
};
const NEUTRAL_BRANDS = ["cypress", "express", "github"];

const MIN_CONTRAST = 4.6;
const SURFACES = ["surface-page", "surface-card", "surface-sunken", "surface-overlay", "surface-inset"];
const CSS_PATH = new URL("../src/index.css", import.meta.url);
const START = "/* brand-tokens:start */";
const END = "/* brand-tokens:end */";

const css = readFileSync(CSS_PATH, "utf8");

function block(selector) {
  const start = css.indexOf(`${selector} {`);
  const body = css.slice(start, css.indexOf("\n}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));
}

function resolve(vars, name) {
  const ref = vars[name].match(/^var\(--([\w-]+)\)$/);
  return ref ? resolve(vars, ref[1]) : vars[name];
}

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
const mix = (rgb, target, amount) => rgb.map((c, i) => c + (target[i] - c) * amount);

function luminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function readableVariant(hex, surfaces, towards) {
  const base = toRgb(hex);
  for (let amount = 0; amount <= 1; amount += 0.01) {
    const candidate = mix(base, towards, amount);
    if (surfaces.every((surface) => contrast(candidate, surface) >= MIN_CONTRAST)) return toHex(candidate);
  }
  throw new Error(`No readable variant for ${hex}`);
}

function themeLines(vars, towards) {
  const surfaces = SURFACES.map((name) => toRgb(resolve(vars, name)));
  const brandLines = Object.entries(BRANDS).flatMap(([name, hex]) => [
    `  --brand-${name}: ${hex};`,
    `  --brand-${name}-text: ${readableVariant(hex, surfaces, towards)};`,
  ]);
  const neutralLines = NEUTRAL_BRANDS.flatMap((name) => [
    `  --brand-${name}: var(--text-strong);`,
    `  --brand-${name}-text: var(--text-strong);`,
  ]);
  return [...brandLines, ...neutralLines];
}

const light = block(":root");
const dark = { ...light, ...block('[data-theme="dark"]') };
const utilityLines = [...Object.keys(BRANDS), ...NEUTRAL_BRANDS].flatMap((name) => [
  `  --color-${name}: var(--brand-${name});`,
  `  --color-${name}-text: var(--brand-${name}-text);`,
]);
const generated = [themeLines(light, [0, 0, 0]), themeLines(dark, [255, 255, 255]), utilityLines];

const parts = css.split(START);
if (parts.length !== generated.length + 1) throw new Error(`Expected ${generated.length} brand-token markers`);
const output = parts
  .map((part, i) => (i === 0 ? part : `${START}\n${generated[i - 1].join("\n")}\n  ${part.slice(part.indexOf(END))}`))
  .join("");

writeFileSync(CSS_PATH, output);
console.log(`Wrote ${Object.keys(BRANDS).length + NEUTRAL_BRANDS.length} brand tokens per theme.`);
