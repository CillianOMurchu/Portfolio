export interface Swatch {
  name: string;
  /** Bright shade: fills, and text in dark mode. */
  primary: string;
  /** Deeper shade: gradient end, and text in light mode. */
  secondary: string;
}

/** The user-pickable $primary values — demo content, not site styling. */
export const SWATCHES: Swatch[] = [
  { name: "Emerald", primary: "#10b981", secondary: "#059669" },
  { name: "Sky", primary: "#38bdf8", secondary: "#0284c7" },
  { name: "Violet", primary: "#8b5cf6", secondary: "#6d28d9" },
  { name: "Rose", primary: "#f43f5e", secondary: "#be123c" },
];

export const RADIUS_RANGE = { min: 0, max: 24, initial: 8 };
export const FONT_SIZE_RANGE = { min: 11, max: 20, initial: 14 };
export const SUBTITLE_SIZE_OFFSET = 2;

export const scssSource = (swatch: Swatch, radius: number, fontSize: number) => `$primary: ${swatch.primary};
$secondary: ${swatch.secondary};
$radius: ${radius}px;
$font-size: ${fontSize}px;

.btn { background: $primary; border-radius: $radius; font-size: $font-size; }
.badge { background: rgba($primary, 0.2); color: $primary; }
.card { border-color: rgba($primary, 0.3); }`;
