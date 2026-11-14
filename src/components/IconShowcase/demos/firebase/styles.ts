import type { PresenceStatus } from "./constants";

export const FIREBASE_COLOR = "var(--color-firebase)";

export const CONSOLE = "overflow-hidden rounded-lg border border-firebase/25 font-mono text-sm";
export const CONSOLE_PATH = "flex items-center gap-2 border-b border-firebase/15 bg-firebase/8 px-3 py-2";
export const PATH_COLLECTION = "text-firebase-text";
export const PATH_SEGMENT = "text-info";
export const PATH_DOCUMENT = "text-success";
export const CONSOLE_BODY = "space-y-0.5 bg-sunken p-3";

export const LIVE_DOT = "size-1.5 rounded-full";
export const LIVE_DOT_ON = `${LIVE_DOT} bg-success shadow-[0_0_6px_var(--color-success)]`;
export const LIVE_DOT_OFF = `${LIVE_DOT} bg-faint`;

export const FIELD_ROW = "flex items-center justify-between rounded-sm border px-2 py-1 transition-colors duration-300";
export const FIELD_UPDATED = `${FIELD_ROW} border-firebase/30 bg-firebase/12`;
export const FIELD_IDLE = `${FIELD_ROW} border-transparent`;
export const FIELD_KEY = "font-mono text-sm text-info";
export const FIELD_VALUE = "font-mono text-sm text-strong";
export const UPDATED_BADGE = "ml-1 text-sm text-firebase-text";
export const STATUS_TONE: Record<PresenceStatus, string> = {
  online: "text-success",
  away: "text-warning",
  offline: "text-muted",
};

export const LISTENER_CODE = "px-3 py-2 font-mono text-sm";
export const LISTENER_FN = "text-highlight-text";

export const LISTEN_BUTTON = "rounded-lg border py-2.5 text-sm font-semibold transition-colors";
export const LISTEN_ON = `${LISTEN_BUTTON} border-firebase/40 bg-firebase/12 text-firebase-text`;
export const LISTEN_OFF = `${LISTEN_BUTTON} border-firebase/20 bg-firebase/6 text-muted hover:text-body`;
