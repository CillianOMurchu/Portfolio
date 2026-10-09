// Theme-aware: these resolve to the active palette's tokens (see src/index.css).
export const CODE_BG = "var(--code-bg)";
export const RAISED_BG = "var(--popover)";

export const PASS_COLOR = "var(--success)";
export const FAIL_COLOR = "var(--error)";
export const WARN_COLOR = "var(--warning)";
export const BODY_TEXT = "var(--secondary-foreground)";
export const SECONDARY_TEXT = "var(--muted-foreground)";
export const MUTED_COLOR = "color-mix(in srgb, var(--muted-foreground) 75%, transparent)";
export const DARK_MUTED = "color-mix(in srgb, var(--muted-foreground) 50%, transparent)";
export const SECONDARY_ACCENT = "var(--accent-secondary)";

export const SUBTLE_BORDER = "rgba(255,255,255,0.08)";
export const GHOST_BG = "rgba(255,255,255,0.04)";

/** Translucent version of a (possibly var()-based) colour, e.g. tint(PASS_COLOR, 15). */
export const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;
