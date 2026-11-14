export const JEST_COLOR = "var(--color-jest)";

export const TEST_PANEL = "p-4 font-mono text-sm leading-6";
export const TEST_ROW = "mb-1 ml-4 flex items-start gap-2";
export const TEST_ICON = { pass: "shrink-0 text-success", fail: "shrink-0 text-danger" } as const;
export const TEST_DESCRIPTION = { pass: "text-muted", fail: "text-danger" } as const;
export const TEST_DURATION = "ml-auto shrink-0 text-sm text-muted";
export const FAILURE_NOTE = "mb-1 ml-4 text-danger";

export const RUN_MORE_BUTTON =
  "rounded-sm border border-jest/30 bg-jest/10 px-3 py-1 text-sm text-jest-text transition-colors hover:bg-jest/20";
