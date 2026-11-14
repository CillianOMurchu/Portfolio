import type { LineKind } from "./constants";

export const NODE_COLOR = "var(--color-node)";

export const TERMINAL = "max-h-[220px] min-h-[180px] overflow-y-auto p-4 font-mono text-sm leading-5";
export const LINE_TONE: Record<LineKind, string> = {
  input: "text-node-text",
  output: "text-body",
  error: "text-danger",
};

export const COMMAND_BUTTON =
  "truncate rounded-sm border px-3 py-2 text-left font-mono text-sm transition-colors " +
  "border-node/35 bg-node/10 text-node-text hover:bg-node/20 " +
  "disabled:cursor-default disabled:border-hairline disabled:bg-card disabled:text-faint";
