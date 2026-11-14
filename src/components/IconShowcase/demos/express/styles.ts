import { CODE_BLOCK } from "../styles";
import type { MiddlewareTone } from "./constants";

interface ToneClasses {
  text: string;
  litRow: string;
  checkedBox: string;
}

export const TONE: Record<MiddlewareTone, ToneClasses> = {
  muted: { text: "text-muted", litRow: "border-muted bg-muted/10", checkedBox: "border-muted bg-muted/20" },
  info: { text: "text-info", litRow: "border-info bg-info/10", checkedBox: "border-info bg-info/20" },
  warning: { text: "text-warning", litRow: "border-warning bg-warning/10", checkedBox: "border-warning bg-warning/20" },
  highlight: { text: "text-highlight-text", litRow: "border-highlight bg-highlight/10", checkedBox: "border-highlight bg-highlight/20" },
  success: { text: "text-success", litRow: "border-success bg-success/10", checkedBox: "border-success bg-success/20" },
};

export const ROW = "flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors duration-200";
export const ROW_IDLE = "border-hairline bg-card";
export const CHECKBOX = "flex size-4 shrink-0 items-center justify-center rounded-sm border text-sm";
export const CHECKBOX_OFF = "border-faint";
export const MIDDLEWARE_CODE = "flex-1 font-mono text-sm";

export const SEND_BUTTON = "rounded-lg border border-line bg-inset py-2.5 text-sm font-semibold text-body transition-colors hover:text-strong";

export const RESPONSE = `${CODE_BLOCK} whitespace-pre rounded-lg border px-3 py-2`;
export const RESPONSE_OK = `${RESPONSE} border-success/30 text-success`;
export const RESPONSE_ERROR = `${RESPONSE} border-danger/30 text-danger`;
