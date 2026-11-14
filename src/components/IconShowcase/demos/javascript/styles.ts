export const JAVASCRIPT_COLOR = "var(--color-javascript)";

export const ACCENT_TEXT = "text-javascript-text";
export const PROMPT_PANEL = "px-4 py-3 text-center font-mono";

export const OPTION = "rounded-lg border py-3 font-mono text-sm transition-colors";
export const OPTION_TONE = {
  open: `${OPTION} border-hairline bg-card text-body hover:border-javascript/50`,
  idle: `${OPTION} cursor-default border-hairline bg-card text-faint`,
  correct: `${OPTION} cursor-default border-success bg-success/15 text-success`,
  wrong: `${OPTION} cursor-default border-danger bg-danger/15 text-danger`,
} as const;
export type OptionTone = keyof typeof OPTION_TONE;

export const EXPLANATION = "rounded-lg border border-javascript/25 bg-javascript/8 px-4 py-3 text-sm leading-relaxed text-body";
export const ACCENT_BUTTON =
  "rounded-lg border border-javascript/40 bg-javascript/15 py-2 text-sm text-javascript-text transition-colors hover:bg-javascript/25";

export const FINAL_SCORE = "text-4xl font-bold";
export const FINAL_SCORE_TONE = { great: "text-javascript-text", okay: "text-warning" } as const;
