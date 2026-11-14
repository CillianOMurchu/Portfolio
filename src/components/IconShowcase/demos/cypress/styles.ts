import { PANEL, PANEL_HEADER } from "../styles";
import type { StepStatus } from "./constants";

export const BROWSER = `${PANEL} bg-sunken`;
export const BROWSER_BAR = `${PANEL_HEADER} flex items-center gap-2 px-3 py-2`;
export const BROWSER_VIEW = "flex min-h-20 items-center justify-center px-4 py-6 text-center";
export const BROWSER_TEXT = { running: "text-sm text-success", idle: "text-sm text-muted" } as const;

export const RUNNER = `${PANEL} bg-sunken font-mono text-sm`;
export const RUNNER_HEADER = "flex items-center justify-between border-b border-hairline px-3 py-2";
export const STEP_LIST = "max-h-44 overflow-y-auto";
export const STEP_ROW = "flex min-w-0 items-center gap-2 px-3 py-1";

interface StepClasses {
  row: string;
  icon: string;
  command: string;
  target: string;
}

export const STEP_TONE: Record<StepStatus, StepClasses> = {
  pending: { row: STEP_ROW, icon: "shrink-0 text-faint", command: "text-faint", target: "text-faint" },
  running: { row: `${STEP_ROW} bg-warning/6`, icon: "shrink-0 text-warning", command: "text-info", target: "text-warning" },
  passed: { row: STEP_ROW, icon: "shrink-0 text-success", command: "text-info", target: "text-muted" },
};
export const STEP_TEXT = "min-w-0 flex-1 truncate";

export const CONTROL_BUTTON = "py-2 text-sm";
