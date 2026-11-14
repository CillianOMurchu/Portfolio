export const VARIANTS = ["solid", "outline", "ghost"] as const;
export type Variant = (typeof VARIANTS)[number];

export const SIZES = ["sm", "md", "lg"] as const;
export type Size = (typeof SIZES)[number];

/** Badge colours offered to the user; each maps to a theme token so it reads well in light and dark. */
export const BADGE_COLORS = [
  { name: "stencil", token: "var(--color-stencil-text)" },
  { name: "success", token: "var(--color-success)" },
  { name: "warning", token: "var(--color-warning)" },
  { name: "danger", token: "var(--color-danger)" },
  { name: "highlight", token: "var(--color-highlight-text)" },
  { name: "info", token: "var(--color-info)" },
] as const;
export type BadgeColor = (typeof BADGE_COLORS)[number]["name"];

export const DEFAULT_LABEL = "Cillian";
export const FALLBACK_LABEL = "Badge";
export const MAX_LABEL_LENGTH = 16;

export const badgeMarkup = (variant: Variant, size: Size, color: BadgeColor, hasGlow: boolean, label: string) => `<cillian-badge
  variant="${variant}"
  size="${size}"
  color="${color}"${hasGlow ? "\n  glow" : ""}
>
  ${label}
</cillian-badge>`;
