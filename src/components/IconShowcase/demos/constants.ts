// Theme-aware: these resolve to the marble tokens (see src/index.css). The demo
// stage is a dark-mode scope, so they take the dark values.
export const CODE_BG = "var(--surface-sunken)";
export const RAISED_BG = "var(--surface-overlay)";

export const PASS_COLOR = "var(--success)";
export const FAIL_COLOR = "var(--danger)";
export const WARN_COLOR = "var(--warning)";
export const BODY_TEXT = "var(--text-body)";
export const SECONDARY_TEXT = "var(--text-muted)";
export const MUTED_COLOR = "var(--text-muted)";
export const DARK_MUTED = "color-mix(in srgb, var(--text-muted) 70%, transparent)";
export const SECONDARY_ACCENT = "var(--info)";

export const SUBTLE_BORDER = "var(--border-hairline)";
export const GHOST_BG = "var(--surface-card)";

/** Translucent version of a (possibly var()-based) colour, e.g. tint(PASS_COLOR, 15). */
export const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`;
