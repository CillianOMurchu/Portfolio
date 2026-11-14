import { EVENT_SLOT_PX } from "./constants";

export const STREAM_ROW = "flex w-full items-start gap-4";
export const STREAM_LABEL = "w-14 shrink-0 pt-1 text-right text-xs font-semibold text-body";
export const STREAM_TRACK = "relative h-7 min-w-0 flex-1 overflow-hidden";
export const STREAM_EMPTY = "absolute top-1/2 left-0 -translate-y-1/2 text-xs text-muted italic";
export const EVENT_BUBBLE =
  "absolute top-0 left-0 flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-current text-xs font-bold";
export const EVENT_TONE = { source: "text-rxjs", result: "text-success" } as const;

export const ACTIVE_OPERATOR_LIST = "flex flex-col gap-2 pl-18";
export const ACTIVE_OPERATOR = "flex items-center gap-2 text-xs font-medium text-rxjs-text";
export const ACTIVE_OPERATOR_DOT = "size-[3px] shrink-0 rounded-full bg-current";

export const OPERATOR_TOGGLE =
  "rounded-sm border px-3 py-2 text-left font-mono text-sm transition-colors focus-visible:shadow-focus focus-visible:outline-none";
export const OPERATOR_TOGGLE_ON = "border-rxjs/40 bg-rxjs/12 text-rxjs-text";
export const OPERATOR_TOGGLE_OFF = "border-hairline bg-card text-muted";

export const CONTROL_BUTTON = "py-2 text-sm";

export const INFO_TRIGGER =
  "inline-flex items-center gap-2 rounded-full border border-rxjs/30 bg-rxjs/8 px-4 py-2 text-sm font-medium text-body transition hover:-translate-y-px hover:border-rxjs/55 hover:bg-rxjs/16";
export const INFO_TRIGGER_ICON =
  "inline-flex size-[1.15rem] items-center justify-center rounded-full border border-rxjs-text/50 text-xs text-rxjs-text italic";
export const MODAL_BACKDROP = "fixed inset-0 z-10010 flex items-center justify-center bg-scrim p-6 backdrop-blur-sm";
export const MODAL_PANEL =
  "relative w-full max-w-120 rounded-[18px] border border-rxjs/35 bg-overlay px-7 pt-8 pb-7 text-center shadow-float " +
  "bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_srgb,var(--color-rxjs)_18%,transparent)_0%,transparent_55%)]";
export const MODAL_CLOSE =
  "absolute top-3.5 right-3.5 flex size-[1.9rem] items-center justify-center rounded-full border border-hairline bg-card text-sm text-muted transition-colors hover:text-strong";
export const MODAL_BADGE =
  "mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full border border-rxjs/40 bg-rxjs/14 text-2xl font-bold text-rxjs-text";
export const MODAL_TITLE = "mb-3.5 text-2xl font-extrabold tracking-tight text-strong";
export const MODAL_BODY = "mb-3.5 text-md leading-relaxed text-body [&_strong]:font-bold [&_strong]:text-rxjs-text";
export const MODAL_OPERATOR_LIST = "mt-5 flex flex-col gap-2 border-t border-hairline pt-5 text-left";
export const MODAL_OPERATOR_ROW = "flex items-center gap-3 text-md text-body";
export const MODAL_OPERATOR_CHIP =
  "min-w-16 shrink-0 rounded-md border border-rxjs/30 bg-rxjs/14 px-2.5 py-0.5 text-center font-mono text-sm font-bold text-rxjs-text";

export const VALUE_FLASH = "pointer-events-none absolute inset-0 rounded-full bg-current";
export const VALUE_DIGIT = "relative";

/* ---------- Motion presets ---------- */

const SPRING = { type: "spring", stiffness: 200, damping: 26 } as const;
const HIDDEN_BUBBLE = { opacity: 0, scale: 0.6 };

export const BUBBLE_MOTION = {
  initial: { x: -EVENT_SLOT_PX, ...HIDDEN_BUBBLE },
  transition: SPRING,
};
export const bubbleTarget = (slot: number, isOverflow: boolean) =>
  isOverflow
    ? { x: (slot + 1) * EVENT_SLOT_PX, ...HIDDEN_BUBBLE }
    : { x: slot * EVENT_SLOT_PX, opacity: 1, scale: 1 };
export const bubbleExit = (capacity: number) => ({ x: (capacity + 1) * EVENT_SLOT_PX, opacity: 0, scale: 0.5 });

const DIGIT_SLIDE_PX = 12;
export const FLASH_MOTION = {
  initial: { opacity: 0.45 },
  animate: { opacity: 0 },
  transition: { duration: 0.7, ease: "easeOut" },
} as const;
export const DIGIT_MOTION = {
  initial: { y: -DIGIT_SLIDE_PX, opacity: 0 },
  exit: { y: DIGIT_SLIDE_PX, opacity: 0, transition: { duration: 0.18 } },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;
export const DIGIT_SETTLED = { y: 0, opacity: 1, scale: 1, filter: "brightness(1)" };
export const DIGIT_BRIGHTENED = { y: 0, opacity: 1, scale: [1.5, 1], filter: ["brightness(2.2)", "brightness(1)"] };

export const MODAL_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};
export const MODAL_POP = {
  initial: { opacity: 0, scale: 0.92, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: 16 },
  transition: { type: "spring", stiffness: 280, damping: 26 },
} as const;
