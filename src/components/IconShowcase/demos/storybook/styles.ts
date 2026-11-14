import type { Tone } from "./constants";

export const WORKSPACE = "overflow-hidden rounded-lg border border-storybook/20";
export const WORKSPACE_GRID = "grid min-h-60 grid-cols-[140px_1fr]";

export const SIDEBAR = "flex flex-col border-r border-hairline bg-sunken";
export const SIDEBAR_TITLE = "border-b border-hairline px-3 py-2 text-sm tracking-wider text-muted uppercase";
export const COMPONENT_ITEM = "w-full px-3 py-1.5 text-left text-sm transition-colors";
export const COMPONENT_OPEN = `${COMPONENT_ITEM} bg-storybook/8 text-storybook-text`;
export const COMPONENT_CLOSED = `${COMPONENT_ITEM} text-muted hover:text-body`;
export const STORY_ITEM = "w-full py-1 pr-3 pl-6 text-left text-sm transition-colors";
export const STORY_ACTIVE = `${STORY_ITEM} bg-storybook/6 text-storybook-text`;
export const STORY_IDLE = `${STORY_ITEM} text-muted hover:text-body`;

export const CANVAS = "flex flex-1 items-center justify-center border-b border-hairline bg-card p-6";
export const ARGS_PANEL = "bg-sunken p-3 font-mono text-sm";
export const ARG_NAME = "text-highlight-text";
export const ARG_VALUE_TONE = { boolean: "text-success", string: "text-warning", other: "text-react-text" } as const;

const PREVIEW_BUTTON = "rounded-sm px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40";
export const BUTTON_VARIANT = {
  primary: `${PREVIEW_BUTTON} bg-success text-on-accent`,
  secondary: `${PREVIEW_BUTTON} border border-success text-success`,
} as const;

export const BADGE_TONE: Record<Tone, string> = {
  success: "border-success/35 bg-success/14 text-success",
  warning: "border-warning/35 bg-warning/14 text-warning",
  muted: "border-muted/35 bg-muted/14 text-muted",
  react: "border-react/35 bg-react/14 text-react-text",
};
export const BADGE = "rounded-full border px-3 py-1.5 text-sm font-medium";

export const CARD = "w-48 rounded-xl border bg-card p-4";
export const CARD_TONE: Record<Tone, { border: string; text: string }> = {
  success: { border: "border-success/20", text: "text-success" },
  warning: { border: "border-warning/20", text: "text-warning" },
  muted: { border: "border-muted/20", text: "text-muted" },
  react: { border: "border-react/20", text: "text-react-text" },
};
