import { Fragment, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gitlabSvg from "../../../assets/programming-icons/gitlab.svg";

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
  { id: "j1", name: "compile:ts", stage: "build", status: "pending", duration: "1m 12s" },
  { id: "j2", name: "unit:tests", stage: "test", status: "pending", duration: "2m 47s" },
  { id: "j3", name: "e2e:cypress", stage: "test", status: "pending", duration: "4m 03s" },
  { id: "j4", name: "eslint", stage: "lint", status: "pending", duration: "0m 18s" },
  { id: "j5", name: "deploy:staging", stage: "staging", status: "pending", duration: "1m 55s" },
  { id: "j6", name: "deploy:prod", stage: "production", status: "pending", duration: "2m 31s" },
];

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

function stageColor(jobs: Job[], stage: string): string {
  const sj = jobs.filter((j) => j.stage === stage);
  if (sj.some((j) => j.status === "failed")) return STATUS_COLOR.failed;
  if (sj.every((j) => j.status === "passed")) return STATUS_COLOR.passed;
  if (sj.every((j) => j.status === "skipped")) return STATUS_COLOR.skipped;
  if (sj.some((j) => j.status === "running")) return STATUS_COLOR.running;
  return STATUS_COLOR.pending;
}

function smilePoint(t: number, passed: boolean) {
  const p0 = passed ? { x: 15, y: 12 } : { x: 15, y: 43 };
  const p1 = passed ? { x: 70, y: 52 } : { x: 70, y: 3 };
  const p2 = passed ? { x: 125, y: 12 } : { x: 125, y: 43 };
  return {
    x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
    y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
  };
}

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
      timerRef.current.push(setTimeout(() => update(job.id, "running"), t + i * 80));
      t += 1200;
      const fails = job.id === "j5";
      timerRef.current.push(
        setTimeout(() => {
          update(job.id, fails ? "failed" : "passed");
          if (fails) {
            timerRef.current.forEach(clearTimeout);
            setJobs((prev) =>
              prev.map((j) => (["j6"].includes(j.id) ? { ...j, status: "skipped" } : j)),
            );
            setRunning(false);
          } else if (i === INITIAL_JOBS.length - 1) {
            setRunning(false);
          }
        }, t + i * 80),
      );
    });
  };

  const reset = () => {
    timerRef.current.forEach(clearTimeout);
    setJobs(INITIAL_JOBS);
    setRunning(false);
  };

  const overall = jobs.some((j) => j.status === "failed")
    ? "failed"
    : jobs.some((j) => j.status === "running")
      ? "running"
      : jobs.every((j) => j.status === "passed")
        ? "passed"
        : "pending";

  const isDone = !running && (overall === "passed" || overall === "failed");
  const pipelinePassed = overall === "passed";

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto" style={{ position: "relative", minHeight: 160 }}>
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
          const sc = stageColor(jobs, stage);
          return (
            <Fragment key={stage}>
              <div className="flex flex-col items-center gap-1 min-w-[72px]">
                <div
                  className="rounded px-2 py-1 text-center w-full"
                  style={{ background: `${sc}18`, border: `1px solid ${sc}44` }}
                >
                  <p className="text-xs font-semibold" style={{ color: sc }}>{stage}</p>
                  {stageJobs.map((j) => (
                    <p key={j.id} className="text-xs mt-0.5" style={{ color: STATUS_COLOR[j.status] }}>
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

      {/* Face overlay — appears when pipeline reaches a terminal state */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            key="face"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(13,17,23,0.97)",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              padding: "20px 0",
            }}
          >
            {/* Eyes — GitLab logos floating left and right */}
            <motion.div
              animate={{ x: [-5, 5] }}
              transition={{ repeat: Infinity, repeatType: "mirror", duration: 2.6, ease: "easeInOut" }}
              style={{ display: "flex", gap: 52, marginBottom: 14 }}
            >
              {[0, 1].map((i) => (
                <motion.img
                  key={i}
                  src={gitlabSvg}
                  initial={{ opacity: 0, y: -48, scale: 0.3 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.13, type: "spring", bounce: 0.55, duration: 0.6 }}
                  style={{ width: 38, height: 38, display: "block" }}
                />
              ))}
            </motion.div>

            {/* Nose — the tagline, distilled to a dot */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.52, type: "spring", bounce: 0.7 }}
              style={{ width: 10, height: 10, borderRadius: "50%", background: "#fc6d26", marginBottom: 18 }}
            />

            {/* Smile/frown — the pipeline curled into a curve */}
            <motion.svg
              width="140"
              height="55"
              viewBox="0 0 140 55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62 }}
              style={{ marginBottom: 18, overflow: "visible" }}
            >
              <motion.path
                d={pipelinePassed ? "M 15,12 Q 70,52 125,12" : "M 15,43 Q 70,3 125,43"}
                fill="none"
                stroke={pipelinePassed ? "#10b981" : "#ef4444"}
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.68, duration: 0.72, ease: "easeOut" }}
              />
              {/* Stage dots along the curve */}
              {STAGES.map((stage, i) => {
                const t = i / (STAGES.length - 1);
                const { x, y } = smilePoint(t, pipelinePassed);
                const sc = stageColor(jobs, stage);
                return (
                  <motion.circle
                    key={stage}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={sc}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    transition={{ delay: 1.05 + i * 0.09, type: "spring", bounce: 0.6 }}
                  />
                );
              })}
            </motion.svg>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.55 }}
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.15em",
                color: pipelinePassed ? "#10b981" : "#ef4444",
              }}
            >
              {pipelinePassed ? "deployed to production" : "pipeline blocked"}
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              onClick={reset}
              style={{
                marginTop: 20,
                fontSize: 10,
                fontFamily: "monospace",
                color: "#4b5563",
                background: "none",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.1em",
              }}
            >
              ↺ try again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
