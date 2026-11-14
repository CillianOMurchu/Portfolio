import { CODE_BLOCK, FIELD, PANEL, PANEL_HEADER } from "../styles";
import type { Method } from "./constants";

export const METHOD_SELECT = "min-w-19 rounded-sm border px-2 py-2 text-sm font-semibold outline-hidden";
export const METHOD_TONE: Record<Method, string> = {
  GET: "border-success/35 bg-success/14 text-success",
  POST: "border-warning/35 bg-warning/14 text-warning",
  PUT: "border-info/35 bg-info/14 text-info",
  DELETE: "border-danger/35 bg-danger/14 text-danger",
};

export const URL_FIELD = `${FIELD} flex flex-1 items-center px-2`;
export const URL_HOST = "font-mono text-sm text-muted";
export const URL_PATH = "ml-0.5 flex-1 bg-transparent font-mono text-sm text-body outline-hidden";

export const SEND_BUTTON =
  "rounded-sm border border-postman/40 bg-postman/20 px-4 text-sm font-semibold text-postman-text transition-colors disabled:bg-postman/10 disabled:text-muted";

export const HEADERS_PANEL = PANEL;
export const HEADER_ROW = "flex items-center gap-3 px-3 py-1.5 text-sm odd:bg-sunken";

export const RESPONSE_PANEL = "overflow-hidden rounded-lg border";
export const RESPONSE_OK = `${RESPONSE_PANEL} border-success/25`;
export const RESPONSE_ERROR = `${RESPONSE_PANEL} border-danger/25`;
export const RESPONSE_HEADER = `${PANEL_HEADER} flex items-center gap-2 px-3 py-1.5 text-sm`;
export const RESPONSE_BODY = `${CODE_BLOCK} max-h-40 overflow-x-auto px-3 py-2`;
