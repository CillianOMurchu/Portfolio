// Turns each scripts/source/logos/<name>.png (a logo on a white square) into
// src/assets/about/logo-<name>.webp: trims the white margin and scales to
// HEIGHT px (2× the 32px it's shown at in the work history rows).
// Run with `npm run optimize:logos`.
import { readdir } from "node:fs/promises";
import sharp from "sharp";

const SOURCE_DIR = new URL("./source/logos/", import.meta.url);
const OUT_DIR = new URL("../src/assets/about/", import.meta.url);
const HEIGHT = 64;

for (const file of (await readdir(SOURCE_DIR)).filter((name) => name.endsWith(".png"))) {
  const name = file.replace(/\.png$/, "");
  // trim() keys off the top-left pixel: the white background.
  const trimmed = await sharp(new URL(file, SOURCE_DIR).pathname).trim({ threshold: 12 }).toBuffer();
  const info = await sharp(trimmed)
    .resize({ height: HEIGHT })
    .webp({ quality: 90 })
    .toFile(new URL(`logo-${name}.webp`, OUT_DIR).pathname);
  console.log(`logo-${name}.webp: ${info.width}x${info.height}`);
}
