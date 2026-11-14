import type { ElementId } from "./constants";

export const FIGMA_COLOR = "var(--color-figma)";

export const CANVAS = "flex flex-col gap-3 rounded-lg border border-hairline bg-inset p-4";
export const INSPECTOR = "overflow-hidden rounded-lg border border-hairline bg-sunken";
export const INSPECTOR_TITLE = "border-b border-hairline bg-inset px-3 py-2 text-sm text-muted";
export const INSPECTOR_VALUE = "text-body";
export const INSPECTOR_TYPE = "text-info";
export const FILL_SWATCH = "inline-block size-3 rounded-xs border border-hairline bg-(--fill)";

const ELEMENT = "min-h-7 min-w-10 cursor-pointer outline-2 outline-offset-2 transition-all";
export const ELEMENT_SELECTED = `${ELEMENT} outline-focus`;
export const ELEMENT_IDLE = `${ELEMENT} outline-transparent`;

/** Each element's look, matching its DesignElement values in constants.ts. */
export const ELEMENT_LOOK: Record<ElementId, string> = {
  "hero-btn": "rounded-[6px] bg-success px-5 py-2.5 text-sm font-semibold text-on-accent",
  "nav-link": "px-3.5 py-1 text-sm font-normal text-success underline-offset-4 hover:underline",
  card: "rounded-[12px] border border-hairline bg-card px-6 py-5 text-md font-medium text-strong",
  badge: "rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success",
};

export const EXPORT_PANEL = "p-3 font-mono text-sm leading-5";
export const EXPORT_PROPERTY = "text-info";
export const EXPORT_VALUE = "text-figma-text";
