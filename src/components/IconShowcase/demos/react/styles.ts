export const REACT_COLOR = "var(--color-react)";

export const TREE_PANEL = "p-4 font-mono text-sm";
export const NODE_ROW = "mb-1 flex items-center gap-2 rounded-sm border px-2 py-1 transition-colors duration-150";
export const NODE_FLASHING = `${NODE_ROW} border-react/50 bg-react/18`;
export const NODE_IDLE = `${NODE_ROW} border-transparent`;
export const NODE_DEPTH = ["", "ml-5"] as const;
export const NODE_LABEL = { memoized: "text-muted", rendering: "text-react-text" } as const;
export const RERENDER_BADGE = "ml-auto text-sm text-react-text";

export const STATE_BUTTON =
  "flex-1 rounded-lg border border-react/30 bg-react/10 py-2 text-sm text-react-text transition-colors hover:bg-react/20";
