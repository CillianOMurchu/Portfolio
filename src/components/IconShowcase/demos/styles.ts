/** Token-based classes shared by every demo. Brand-specific classes live in each demo's styles.ts. */

export const PANEL = "overflow-hidden rounded-lg border border-hairline";
export const PANEL_HEADER = "border-b border-hairline bg-sunken";
export const SURFACE = "border border-hairline bg-card";
export const FIELD = "rounded-sm border border-hairline bg-card outline-hidden";
export const CODE_BLOCK = "bg-sunken font-mono text-sm text-body";

export const CHIP = "rounded-full border px-3 py-1 text-sm transition-colors";
export const CHIP_OFF = "border-hairline bg-card text-muted hover:text-body";
export const TAG = "rounded-sm bg-inset px-1.5 py-0.5 text-sm text-muted";

export const STATUS_TONE = {
  pass: "text-success",
  fail: "text-danger",
  warn: "text-warning",
  muted: "text-muted",
} as const;
