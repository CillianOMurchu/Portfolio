import { CHIP_OFF } from "../styles";
import type { Runtime } from "./constants";

export const RUST_COLOR = "var(--color-rust)";

export const EFFORT = "font-mono text-sm text-rust-text";

const INPUT_CHIP = "rounded-sm border px-3 py-1 text-sm transition-colors";
export const INPUT_ON = `${INPUT_CHIP} border-rust bg-rust/20 text-rust-text`;
export const INPUT_OFF = `${INPUT_CHIP} ${CHIP_OFF}`;

export const RUNTIME_TONE: Record<Runtime, { text: string; bar: string }> = {
  rust: { text: "text-rust-text", bar: "bg-rust" },
  js: { text: "text-javascript-text", bar: "bg-javascript" },
};
export const BAR_TRACK = "h-2 overflow-hidden rounded-full bg-inset";
export const BAR_FILL = "h-full rounded-full transition-all duration-700";
export const BAR_RUNNING = "opacity-60";

export const SPEEDUP_PANEL = "rounded-lg border border-rust/25 bg-rust/8 px-4 py-3 text-center";
export const SPEEDUP_VALUE = "text-2xl font-bold text-rust-text";

export const RUN_BUTTON =
  "rounded-lg border border-rust/35 bg-rust/15 py-2.5 text-sm font-semibold text-rust-text transition-colors " +
  "disabled:cursor-default disabled:text-faint";
