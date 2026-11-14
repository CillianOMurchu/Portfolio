import type { JobStatus } from "./constants";

interface StatusClasses {
  text: string;
  box: string;
  fill: string;
  stroke: string;
}

export const STATUS_TONE: Record<JobStatus, StatusClasses> = {
  pending: { text: "text-muted", box: "border-muted/25 bg-muted/8", fill: "fill-muted", stroke: "stroke-muted" },
  running: { text: "text-warning", box: "border-warning/25 bg-warning/10", fill: "fill-warning", stroke: "stroke-warning" },
  passed: { text: "text-success", box: "border-success/25 bg-success/10", fill: "fill-success", stroke: "stroke-success" },
  failed: { text: "text-danger", box: "border-danger/25 bg-danger/10", fill: "fill-danger", stroke: "stroke-danger" },
  skipped: { text: "text-faint", box: "border-faint/25 bg-faint/8", fill: "fill-faint", stroke: "stroke-faint" },
};

export const HEADER =
  "flex min-w-0 flex-col items-stretch gap-3 rounded-lg border border-hairline bg-card p-2.5 " +
  "sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3";
export const PIPELINE_TITLE = "text-xs font-semibold whitespace-nowrap";
export const BRANCH = "text-xs whitespace-nowrap text-muted";
export const HEADER_BUTTON = "px-3 py-1 text-sm";

export const STAGE_ROW = "flex max-w-full flex-wrap items-start justify-center gap-3 pb-1 md:gap-2";
export const STAGE_COLUMN =
  "flex max-w-[90px] min-w-[90px] shrink-0 grow-0 basis-[calc(50%-0.375rem)] flex-col items-center gap-2 md:max-w-[100px] md:min-w-[80px] md:basis-auto";
export const STAGE_BOX = "w-full min-w-[90px] rounded-md border p-1.5 text-center md:min-w-[80px] md:p-2";
export const STAGE_ARROW = "hidden h-full items-center px-1 text-muted md:flex";
export const JOB_LINE = "mt-0.5 max-w-full text-xs wrap-break-word";

export const FACE_OVERLAY = "absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg bg-page/97 py-5";
export const FACE_EYES = "mb-3.5 flex gap-13";
export const FACE_EYE = "block size-9.5";
export const FACE_NOSE = "mb-4.5 size-2.5 rounded-full bg-gitlab";
export const FACE_MOUTH = "mb-4.5 overflow-visible";
export const OUTCOME = "font-mono text-xs tracking-[0.15em]";
export const TRY_AGAIN = "mt-5 font-mono text-xs tracking-widest text-faint hover:text-muted";

/* ---------- Motion presets ---------- */

export const FADE = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.45 } };
export const EYES_DRIFT = {
  animate: { x: [-5, 5] },
  transition: { repeat: Infinity, repeatType: "mirror" as const, duration: 2.6, ease: "easeInOut" as const },
};
export const eyeDrop = (index: number) => ({
  initial: { opacity: 0, y: -48, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { delay: 0.1 + index * 0.13, type: "spring", bounce: 0.55, duration: 0.6 },
}) as const;
export const NOSE_POP = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay: 0.52, type: "spring", bounce: 0.7 },
} as const;
export const MOUTH_FADE = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.62 } };
export const MOUTH_DRAW = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { delay: 0.68, duration: 0.72, ease: "easeOut" },
} as const;
export const stageDotPop = (index: number) => ({
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 0.9, scale: 1 },
  transition: { delay: 1.05 + index * 0.09, type: "spring", bounce: 0.6 },
}) as const;
export const delayedFade = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay } });
export const OUTCOME_DELAY_S = 1.55;
export const TRY_AGAIN_DELAY_S = 2;
