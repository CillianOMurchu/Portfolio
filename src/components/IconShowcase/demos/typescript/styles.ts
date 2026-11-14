import type { Verdict } from "./constants";

export const TYPESCRIPT_COLOR = "var(--color-typescript)";

export const KEYWORD = "text-typescript-text";
export const PROPERTY_KEY = "text-info";
export const FIELD_ROW = "mb-2 ml-4 flex min-w-0 items-center gap-2 overflow-hidden";
export const VALUE_HINT = "min-w-0 truncate text-sm text-muted";

export const TYPE_SELECT = "rounded-sm border bg-overlay px-2 py-0.5 font-mono text-sm outline-hidden";
export const SELECT_TONE = {
  pending: "border-typescript/35 text-typescript-text",
  correct: "border-success/35 text-success",
  wrong: "border-danger/35 text-danger",
} as const;
export const RESULT_MARK = { correct: "text-success", wrong: "text-danger" } as const;

export const CHECK_BUTTON =
  "rounded-lg border py-2 text-sm font-semibold transition-colors " +
  "border-typescript bg-typescript/20 text-typescript-text " +
  "disabled:cursor-default disabled:border-hairline disabled:bg-card disabled:text-faint";

export const VERDICT_TONE: Record<Verdict, string> = {
  perfect: "text-success",
  close: "text-warning",
  poor: "text-danger",
};
export const SCORE = "text-lg font-bold";
export const RESET_LINK = "mt-3 text-sm text-typescript-text underline";
