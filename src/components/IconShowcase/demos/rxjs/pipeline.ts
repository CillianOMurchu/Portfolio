import type { OperatorId } from "./constants";

interface PipelineResult {
  value: number;
  runningTotal: number;
}

/** Runs filter → map → scan; returns null when filter drops the value. */
export function applyOperators(
  value: number,
  activeOps: ReadonlySet<OperatorId>,
  runningTotal: number,
): PipelineResult | null {
  if (activeOps.has("filter") && value % 2 !== 0) return null;
  const mapped = activeOps.has("map") ? value * 2 : value;
  if (!activeOps.has("scan")) return { value: mapped, runningTotal };
  const total = runningTotal + mapped;
  return { value: total, runningTotal: total };
}
