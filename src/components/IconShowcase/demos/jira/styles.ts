import type { ColumnId, Priority } from "./constants";

export const COLUMN_TONE: Record<ColumnId, { header: string; label: string }> = {
  todo: { header: "border-muted/30", label: "text-muted" },
  inprogress: { header: "border-warning/30", label: "text-warning" },
  done: { header: "border-success/30", label: "text-success" },
};
export const COLUMN_HEADER = "flex items-center gap-1.5 border-b-2 pb-1";

export const TICKET = "flex cursor-default flex-col gap-1.5 rounded-lg border border-hairline bg-card p-2.5";
export const TICKET_TITLE = "line-clamp-2 text-sm leading-tight text-body";
export const PRIORITY_DOT = "ml-auto size-1.5 rounded-full";
export const PRIORITY_TONE: Record<Priority, string> = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-muted",
};
export const MOVE_BUTTON = "rounded-sm bg-inset px-1.5 py-0.5 text-sm text-muted transition-colors hover:text-strong";
