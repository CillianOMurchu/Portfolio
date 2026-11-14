// Colour values for the few places that need a colour as a string (inline styles, props).
// They point at the semantic tokens in src/index.css, so they follow the site's light/dark theme.
// Prefer Tailwind token classes (text-success, bg-card, …) and each demo's styles.ts everywhere else.
export const CODE_BG = "var(--surface-sunken)";
export const GHOST_BG = "var(--surface-card)";
export const SUBTLE_BORDER = "var(--border-hairline)";

export const PASS_COLOR = "var(--success)";
export const FAIL_COLOR = "var(--danger)";
export const MUTED_COLOR = "var(--text-muted)";
export const DARK_MUTED = "var(--text-faint)";

/** Translucent version of a (possibly var()-based) colour, e.g. tint(PASS_COLOR, 15). */
export const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;
