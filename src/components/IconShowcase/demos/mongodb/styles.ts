import { CHIP, CHIP_OFF, TAG } from "../styles";

export const MONGODB_COLOR = "var(--color-mongodb)";

export const QUERY_PANEL = "px-3 py-2 font-mono text-sm";
export const QUERY_TEXT = "text-mongodb-text";

export const FILTER_ON = `${CHIP} border-mongodb bg-mongodb/20 text-mongodb-text`;
export const FILTER_OFF = `${CHIP} ${CHIP_OFF}`;

export const DOCUMENT_LIST = "flex max-h-64 flex-col gap-2 overflow-y-auto";
export const DOCUMENT_CARD = "w-full rounded-lg border bg-mongodb/5 p-3 text-left transition-colors";
export const DOCUMENT_OPEN = `${DOCUMENT_CARD} border-mongodb`;
export const DOCUMENT_CLOSED = `${DOCUMENT_CARD} border-mongodb/15 hover:border-mongodb/40`;
export const DOCUMENT_YEAR = "text-sm text-mongodb-text";
export const DOCUMENT_JSON = "mt-2 whitespace-pre-wrap text-left font-mono text-sm text-muted";

export const STACK_TAG = TAG;
export const STACK_TAG_MATCH = `${TAG} text-mongodb-text`;
