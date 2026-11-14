export interface StreamEvent {
  id: number;
  value: number;
  /** The source value before the operators ran — only set on result events. */
  from?: number;
}

export const OPERATORS = [
  { id: "map", label: "map(x => x * 2)", explanation: "reshapes each value" },
  { id: "filter", label: "filter(x => x % 2 === 0)", explanation: "lets only some through" },
  { id: "scan", label: "scan((acc, x) => acc + x, 0)", explanation: "accumulates a running result" },
] as const;

export type OperatorId = (typeof OPERATORS)[number]["id"];

export const EMIT_INTERVAL_MS = 1600;
export const MAX_SOURCE_VALUE = 9;

/** Width of one event bubble (28px) plus the gap after it (8px). */
export const EVENT_SLOT_PX = 36;
export const DEFAULT_CAPACITY = 6;

/** Delay before a result bubble swaps its source value for the transformed one. */
export const VALUE_SWAP_DELAY_MS = 900;
