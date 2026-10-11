// Generates the Character overlay images from scripts/source/character.png:
// trims the transparent padding (so the figure sits flush on the screen edge),
// converts to greyscale and writes AVIF + WebP (with alpha) at three heights
// into src/assets/character/. Run with `npm run optimize:character`.
import { mkdir, stat } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = new URL("./source/character.png", import.meta.url);
const OUT_DIR = new URL("../src/assets/character/", import.meta.url);
const HEIGHTS = [720, 1080, 1440];

await mkdir(OUT_DIR, { recursive: true });

// trim() keys off the top-left pixel, which is fully transparent here.
const { data: trimmed, info } = await sharp(SOURCE.pathname)
  .trim({ threshold: 8 })
  .toBuffer({ resolveWithObject: true });
console.log(`trimmed: ${info.width}x${info.height}`);

for (const height of HEIGHTS) {
  const base = sharp(trimmed).resize({ height: Math.min(height, info.height) }).grayscale();
  const outputs = [
    ["avif", base.clone().avif({ quality: 45, effort: 9 })],
    ["webp", base.clone().webp({ quality: 68, alphaQuality: 80, effort: 6 })],
  ];
  for (const [ext, pipeline] of outputs) {
    const file = new URL(`character-${height}.${ext}`, OUT_DIR);
    const { width } = await pipeline.toFile(file.pathname);
    const { size } = await stat(file);
    console.log(`character-${height}.${ext}  ${width}x${height}  ${(size / 1024).toFixed(1)} KB`);
  }
}
