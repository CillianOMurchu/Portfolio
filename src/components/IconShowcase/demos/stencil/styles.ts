import type { Size, Variant } from "./constants";

export const STENCIL_COLOR = "var(--color-stencil)";

export const STAGE = "flex justify-center rounded-xl border border-stencil/20 bg-card py-6";

const BADGE = "inline-flex items-center gap-2 rounded-lg border-2 font-semibold transition-all duration-200";
export const BADGE_VARIANT: Record<Variant, string> = {
  solid: `${BADGE} border-transparent bg-(--badge) text-on-accent`,
  outline: `${BADGE} border-(--badge) bg-transparent text-(--badge)`,
  ghost: `${BADGE} border-transparent bg-(--badge)/10 text-(--badge)`,
};
export const BADGE_SIZE: Record<Size, { badge: string; icon: string }> = {
  sm: { badge: "px-3 py-1.5 text-xs", icon: "size-6" },
  md: { badge: "px-4.5 py-2.5 text-sm", icon: "size-8" },
  lg: { badge: "px-6 py-3.5 text-md", icon: "size-10" },
};
export const BADGE_GLOW =
  "shadow-[0_0_12px_color-mix(in_srgb,var(--badge)_40%,transparent),0_0_24px_color-mix(in_srgb,var(--badge)_20%,transparent)]";
export const BADGE_ICON = "shrink-0 rounded-md bg-current/15";

export const CONTROL_LABEL = "text-sm tracking-wider text-muted uppercase";
export const OPTION = "flex-1 rounded-sm border py-1 text-sm transition-colors";
export const OPTION_ON = `${OPTION} border-stencil bg-stencil/20 text-stencil-text`;
export const OPTION_OFF = `${OPTION} border-hairline bg-card text-muted hover:text-body`;

export const COLOR_SWATCH = "size-6 rounded-full border-2 bg-(--swatch) transition-transform";
export const COLOR_SWATCH_ON = `${COLOR_SWATCH} scale-120 border-strong`;
export const COLOR_SWATCH_OFF = `${COLOR_SWATCH} border-transparent`;

export const GLOW_CHECKBOX = "accent-stencil";
export const LABEL_INPUT = "rounded-sm border border-hairline bg-card px-2 py-1.5 font-mono text-sm text-body outline-hidden";
export const MARKUP_PANEL = "whitespace-pre p-3 font-mono text-sm leading-5 text-muted";
