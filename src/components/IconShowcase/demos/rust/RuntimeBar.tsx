import { MIN_BAR_PERCENT, RUNNING_BAR_PERCENT, type Runtime } from "./constants";
import { BAR_FILL, BAR_RUNNING, BAR_TRACK, RUNTIME_TONE } from "./styles";

interface RuntimeBarProps {
  runtime: Runtime;
  label: string;
  timeMs: number | null;
  slowestMs: number;
  isRunning: boolean;
}

function formatDuration(ms: number) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  return ms < 1000 ? `${ms.toFixed(1)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function barPercent(timeMs: number | null, slowestMs: number, isRunning: boolean) {
  if (timeMs !== null) return Math.max(MIN_BAR_PERCENT, Math.min(100, (timeMs / slowestMs) * 100));
  return isRunning ? RUNNING_BAR_PERCENT : 0;
}

function readout(timeMs: number | null, isRunning: boolean) {
  if (isRunning) return "calculating…";
  return timeMs !== null ? formatDuration(timeMs) : "—";
}

export default function RuntimeBar({ runtime, label, timeMs, slowestMs, isRunning }: RuntimeBarProps) {
  const tone = RUNTIME_TONE[runtime];
  const readoutTone = timeMs !== null ? tone.text : "text-faint";
  const fillClass = `${BAR_FILL} ${tone.bar} ${isRunning ? BAR_RUNNING : ""}`;

  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1 flex justify-between">
        <span className={tone.text}>{label}</span>
        <span className={readoutTone}>{readout(timeMs, isRunning)}</span>
      </div>
      <div className={BAR_TRACK}>
        <div className={fillClass} style={{ width: `${barPercent(timeMs, slowestMs, isRunning)}%` }} />
      </div>
    </div>
  );
}
