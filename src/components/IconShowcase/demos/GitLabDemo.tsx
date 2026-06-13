import { Fragment, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gitlabSvg from "../../../assets/programming-icons/gitlab.svg";
import DemoButton from "./components/DemoButton";
import { PASS_COLOR, FAIL_COLOR, WARN_COLOR, MUTED_COLOR, DARK_MUTED } from "./constants";

interface Job {
  id: string;
  name: string;
  stage: string;
  status: "pending" | "running" | "passed" | "failed" | "skipped";
  duration?: string;
  log?: string;
}

const GITLAB_ACCENT = "#fc6d26";

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
  pending: MUTED_COLOR,
  running: WARN_COLOR,
  passed: PASS_COLOR,
  failed: FAIL_COLOR,
  skipped: DARK_MUTED,
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

  const runPipeline = (shouldFail: boolean = false) => {
    timerRef.current.forEach(clearTimeout);
    setJobs(INITIAL_JOBS);
    setRunning(true);
    let t = 0;

    INITIAL_JOBS.forEach((job, i) => {
      t += 600;
      timerRef.current.push(setTimeout(() => update(job.id, "running"), t + i * 80));
      t += 1200;
      const fails = shouldFail && job.id === "j5";
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
    <div className="gitlab-pipeline-container">
      <div className="gitlab-details-row">
        <div className="gitlab-pipeline-info">
          <span className="gitlab-pipeline-status" style={{ color: STATUS_COLOR[overall] }}>
            ● Pipeline #{pipelineId}
          </span>
          <span className="gitlab-pipeline-branch text-gray-500">main → production</span>
        </div>
        <div className="gitlab-actions">
          <DemoButton color={PASS_COLOR} disabled={running} onClick={() => runPipeline(false)} className="px-3 py-1 text-xs">
            {running ? "Running…" : "✓ Success"}
          </DemoButton>
          <DemoButton color={FAIL_COLOR} disabled={running} onClick={() => runPipeline(true)} className="px-3 py-1 text-xs">
            ✗ Failure
          </DemoButton>
          <DemoButton variant="ghost" onClick={reset} className="px-3 py-1 text-xs">↺</DemoButton>
        </div>
      </div>

      <div className="gitlab-stages-row">
        {STAGES.map((stage, i) => {
          const stageJobs = jobs.filter((j) => j.stage === stage);
          const sc = stageColor(jobs, stage);
          return (
            <Fragment key={stage}>
              <div className="gitlab-stage-box">
                <div
                  className="gitlab-stage-header"
                  style={{ background: `${sc}18`, border: `1px solid ${sc}44` }}
                >
                  <p className="text-xs font-semibold" style={{ color: sc }}>{stage}</p>
                  {stageJobs.map((j) => (
                    <p key={j.id} className="gitlab-job-name" style={{ color: STATUS_COLOR[j.status] }}>
                      {STATUS_ICON[j.status]} {j.name}
                    </p>
                  ))}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="gitlab-stage-separator">→</div>
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
              style={{ width: 10, height: 10, borderRadius: "50%", background: GITLAB_ACCENT, marginBottom: 18 }}
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
                stroke={pipelinePassed ? PASS_COLOR : FAIL_COLOR}
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
                color: pipelinePassed ? PASS_COLOR : FAIL_COLOR,
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
                color: DARK_MUTED,
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
