// Fails if anything from the old (shadcn / Neon Emerald) visual system is left,
// or if raw colours appear outside the token file. Run: npm run audit:tokens
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const TOKEN_FILE = "src/index.css";

// Brand / syntax colours that are content, not theme: the IconShowcase demos
// mock other tools' UIs, and BrandIcons draws logos.
const RAW_COLOUR_EXEMPT = [/^src\/components\/IconShowcase\/demos\//, /^src\/data\/icon-demos\.ts$/, /^src\/components\/ui\/BrandIcons\.tsx$/, /^src\/components\/WeatherEffects\//, /^src\/components\/sphere\//];

const OLD_VARS = /var\(--(primary|primary-foreground|foreground|background|popover|popover-foreground|secondary|secondary-foreground|muted|muted-foreground|card|card-foreground|accent-foreground|accent-secondary|destructive|input|border|radius|glow-[a-z]+|code-bg|error)\)/g;
const OLD_UTILITIES =
  /\b(?:text|bg|border|ring|fill|stroke|shadow|from|to|via|outline|decoration)-(?:primary|primary-foreground|foreground|background|popover|popover-foreground|secondary|secondary-foreground|muted-foreground|card-foreground|accent-foreground|accent-secondary|destructive|input|error|code-bg)\b|\bglow-(?:primary|secondary)\b|\bfont-heading\b|\bdrop-shadow-rim\b|\btext-base\b/g;
const OLD_FONTS = /\bGeist\b|@fontsource/g;
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/g;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const files = [...walk(join(ROOT, "src")), join(ROOT, "index.html")]
  .map((path) => relative(ROOT, path))
  .filter((path) => /\.(tsx?|css|html)$/.test(path) && !path.endsWith(".test.ts") && !path.endsWith(".test.tsx"));

const findings = [];
for (const file of files) {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  const checkRawColour = file !== TOKEN_FILE && file !== "index.html" && !RAW_COLOUR_EXEMPT.some((re) => re.test(file));
  lines.forEach((line, i) => {
    const hits = [
      ...line.matchAll(OLD_VARS),
      ...line.matchAll(OLD_UTILITIES),
      ...line.matchAll(OLD_FONTS),
      ...(checkRawColour ? line.matchAll(RAW_COLOUR) : []),
    ].map((match) => match[0]);
    if (hits.length) findings.push(`${file}:${i + 1}  ${[...new Set(hits)].join(", ")}`);
  });
}

if (findings.length) {
  process.stderr.write(`${findings.length} leftover(s) from the old design system:\n${findings.join("\n")}\n`);
  process.exit(1);
}
process.stdout.write(`Design tokens clean (${files.length} files checked).\n`);
