import type { MilestoneTone } from "./constants";

export const GRAPH_PANEL = "overflow-x-auto rounded-lg border border-hairline bg-sunken p-3";
/** Always rendered at a fixed height so hovering a milestone never shifts the layout under the cursor. */
export const MILESTONE_LABEL = "mt-2 h-5 truncate text-sm leading-5";
export const CELL = "size-[9px] rounded-xs transition-colors";
/** Activity levels 0–4, from empty to busiest, tinted from the theme's success colour. */
export const ACTIVITY_LEVEL = ["bg-inset", "bg-success/25", "bg-success/50", "bg-success/75", "bg-success"] as const;

interface MilestoneClasses {
  cell: string;
  text: string;
}

export const MILESTONE_TONE: Record<MilestoneTone, MilestoneClasses> = {
  success: { cell: "cursor-pointer bg-success shadow-[0_0_6px_var(--color-success)]", text: "text-success" },
  react: { cell: "cursor-pointer bg-react shadow-[0_0_6px_var(--color-react)]", text: "text-react-text" },
  highlight: { cell: "cursor-pointer bg-highlight shadow-[0_0_6px_var(--color-highlight)]", text: "text-highlight-text" },
  warning: { cell: "cursor-pointer bg-warning shadow-[0_0_6px_var(--color-warning)]", text: "text-warning" },
};

export const COMMIT_ROW = "w-full rounded-lg border px-3 py-2 text-left transition-colors";
export const COMMIT_OPEN = `${COMMIT_ROW} border-line bg-inset`;
export const COMMIT_CLOSED = `${COMMIT_ROW} border-hairline bg-card hover:bg-inset`;
export const COMMIT_HASH = "font-mono text-sm text-success";
export const COMMIT_MESSAGE = "flex-1 truncate text-sm text-body";
