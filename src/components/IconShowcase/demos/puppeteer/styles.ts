import type { RunState } from "./constants";

export const PUPPETEER_COLOR = "var(--color-puppeteer)";

export const EDITOR = "overflow-hidden font-mono text-sm";
export const EDITOR_BAR = "flex items-center gap-2 border-b border-puppeteer/15 bg-puppeteer/8 px-3 py-2";
export const RUN_STATE_TONE: Record<RunState, string> = {
  idle: "ml-auto text-muted",
  running: "ml-auto text-puppeteer-text",
  done: "ml-auto text-success",
};

export const SCRIPT_BODY = "space-y-1 p-3";
export const LINE = "flex gap-2 transition-opacity duration-300";
export const LINE_HIDDEN = `${LINE} opacity-25`;
export const LINE_SHOWN = LINE;
export const LINE_NUMBER = "shrink-0 text-muted select-none";
export const CODE_TONE = { pending: "text-faint", current: "text-puppeteer-text", executed: "text-muted" } as const;
export const COMMENT_CURRENT = "ml-2 animate-pulse text-puppeteer-text";
export const COMMENT_EXECUTED = "ml-2 text-success";

export const SCREENSHOT = "overflow-hidden rounded-lg border border-puppeteer/25";
export const SCREENSHOT_CAPTION = "border-b border-puppeteer/10 bg-puppeteer/5 px-3 py-1.5 text-sm text-muted";
export const SCREENSHOT_BODY = "flex min-h-20 items-center justify-center bg-sunken p-4";
export const SCREENSHOT_GLOBE = "mx-auto flex size-16 items-center justify-center rounded-full border-2 border-success bg-success/5";

export const CONTROL_BUTTON = "py-2.5 text-sm";
