import { Fragment, useRef, useState } from "react";

interface Job {
  id: string;
  name: string;
  stage: string;
  status: "pending" | "running" | "passed" | "failed" | "skipped";
  duration?: string;
  log?: string;
}

const STAGES = ["build", "test", "lint", "staging", "production"];

const INITIAL_JOBS: Job[] = [
  {
    id: "j1",
    name: "compile:ts",
    stage: "build",
    status: "pending",
    duration: "1m 12s",
  },
  {
    id: "j2",
    name: "unit:tests",
    stage: "test",
    status: "pending",
    duration: "2m 47s",
  },
  {
    id: "j3",
    name: "e2e:cypress",
    stage: "test",
    status: "pending",
    duration: "4m 03s",
  },
  {
    id: "j4",
    name: "eslint",
    stage: "lint",
    status: "pending",
    duration: "0m 18s",
  },
  {
    id: "j5",
    name: "deploy:staging",
    stage: "staging",
    status: "pending",
    duration: "1m 55s",
  },
  {
    id: "j6",
    name: "deploy:prod",
    stage: "production",
    status: "pending",
    duration: "2m 31s",
  },
];

export default function GitLabDemo() {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [running, setRunning] = useState(false);
  const [pipelineId] = useState(Math.floor(Math.random() * 900) + 100);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const update = (id: string, status: Job["status"]) =>
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));

  const runPipeline = () => {
    timerRef.current.forEach(clearTimeout);
    setJobs(INITIAL_JOBS);
    setRunning(true);
    let t = 0;

    INITIAL_JOBS.forEach((job, i) => {
      t += 600;
      timerRef.current.push(
        setTimeout(() => update(job.id, "running"), t + i * 80),
      );
      t += 1200;
      const fails = job.id === "j5";
      timerRef.current.push(
        setTimeout(
          () => {
            update(job.id, fails ? "failed" : "passed");
            if (fails) {
              timerRef.current.forEach(clearTimeout);
              setJobs((prev) =>
                prev.map((j) =>
                  ["j6"].includes(j.id) ? { ...j, status: "skipped" } : j,
                ),
              );
              setRunning(false);
            } else if (i === INITIAL_JOBS.length - 1) {
              setRunning(false);
            }
          },
          t + i * 80,
        ),
      );
    });
  };

  const reset = () => {
    timerRef.current.forEach(clearTimeout);
    setJobs(INITIAL_JOBS);
    setRunning(false);
  };

  const STATUS_COLOR: Record<Job["status"], string> = {
    pending: "#6b7280",
    running: "#f59e0b",
    passed: "#10b981",
    failed: "#ef4444",
    skipped: "#4b5563",
  };
  const STATUS_ICON: Record<Job["status"], string> = {
    pending: "○",
    running: "◌",
    passed: "✓",
    failed: "✗",
    skipped: "⊘",
  };

  const overall = jobs.some((j) => j.status === "failed")
    ? "failed"
    : jobs.some((j) => j.status === "running")
      ? "running"
      : jobs.every((j) => j.status === "passed")
        ? "passed"
        : "pending";

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: STATUS_COLOR[overall] }}>
            ● Pipeline #{pipelineId}
          </span>
          <span className="text-xs text-gray-500">main → production</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runPipeline}
            disabled={running}
            className="text-xs px-3 py-1 rounded transition-all"
            style={{
              background: "rgba(252,109,38,0.15)",
              border: "1px solid rgba(252,109,38,0.3)",
              color: running ? "#4b5563" : "#fc6d26",
              cursor: running ? "default" : "pointer",
            }}
          >
            {running ? "Running…" : "▶ Run"}
          </button>
          <button
            onClick={reset}
            className="text-xs px-3 py-1 rounded"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#6b7280",
            }}
          >
            ↺
          </button>
        </div>
      </div>

      <div className="flex gap-1 items-center overflow-x-auto pb-1">
        {STAGES.map((stage, i) => {
          const stageJobs = jobs.filter((j) => j.stage === stage);
          const stageStatus = stageJobs.some((j) => j.status === "failed")
            ? "failed"
            : stageJobs.some((j) => j.status === "running")
              ? "running"
              : stageJobs.every((j) => j.status === "passed")
                ? "passed"
                : stageJobs.every((j) => j.status === "skipped")
                  ? "skipped"
                  : "pending";
          return (
            <Fragment key={stage}>
              <div className="flex flex-col items-center gap-1 min-w-[72px]">
                <div
                  className="rounded px-2 py-1 text-center w-full"
                  style={{
                    background: `${STATUS_COLOR[stageStatus]}18`,
                    border: `1px solid ${STATUS_COLOR[stageStatus]}44`,
                  }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: STATUS_COLOR[stageStatus] }}
                  >
                    {stage}
                  </p>
                  {stageJobs.map((j) => (
                    <p
                      key={j.id}
                      className="text-xs mt-0.5"
                      style={{ color: STATUS_COLOR[j.status] }}
                    >
                      {STATUS_ICON[j.status]} {j.name}
                    </p>
                  ))}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="text-gray-700 text-xs shrink-0">→</div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
