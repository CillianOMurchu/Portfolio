export type Phase = "idle" | "rust" | "js" | "done";
export type Runtime = "rust" | "js";

export interface BenchmarkResult {
  rust: number;
  js: number;
}

/** Simulated fibonacci(n) timings in milliseconds. */
export const BENCHMARKS: Record<number, BenchmarkResult> = {
  10: { rust: 0.001, js: 0.003 },
  20: { rust: 0.002, js: 0.15 },
  30: { rust: 0.003, js: 8.7 },
  35: { rust: 0.004, js: 98 },
  40: { rust: 0.005, js: 1100 },
  42: { rust: 0.006, js: 4300 },
};
export const INPUTS = Object.keys(BENCHMARKS).map(Number);
export const DEFAULT_INPUT = 30;

export const RUNTIMES: { id: Runtime; label: string }[] = [
  { id: "rust", label: "🦀 Rust (WASM)" },
  { id: "js", label: "🟨 JavaScript" },
];

export const RUST_FINISH_MS = 600;
export const JS_FINISH_MS = 1600;

export const WARM_INPUT = 35;
export const HOT_INPUT = 40;
export const EFFORT_LABEL = {
  hot: "🔥 borrow checker sweating",
  warm: "⚡ warming up",
  trivial: "✓ trivial",
} as const;

export const MIN_BAR_PERCENT = 4;
export const RUNNING_BAR_PERCENT = 15;

export const BUTTON_LABEL: Record<Phase, string> = {
  idle: "▶ cargo run",
  rust: "Running…",
  js: "Running…",
  done: "▶ run again",
};
