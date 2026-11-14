import { Fragment, useState } from "react";
import { AnimatePresence } from "framer-motion";
import DemoButton from "../components/DemoButton";
import { useTimers } from "../components/useTimers";
import { FAIL_COLOR, PASS_COLOR } from "../constants";
import {
  BRANCH_LABEL, JOBS, MIN_PIPELINE_ID, PENDING_STATUSES, PIPELINE_ID_RANGE, STAGES, STATUS_ICON, type JobStatus,
  type JobStatuses,
} from "./constants";
import PipelineFace from "./PipelineFace";
import { overallStatus, scheduleJobs, skipJobsAfter, stageStatus } from "./pipeline";
import {
  BRANCH, HEADER, HEADER_BUTTON, JOB_LINE, PIPELINE_TITLE, STAGE_ARROW, STAGE_BOX, STAGE_COLUMN, STAGE_ROW, STATUS_TONE,
} from "./styles";

function StageBoxes({ statuses }: { statuses: JobStatuses }) {
  return (
    <div className={STAGE_ROW}>
      {STAGES.map((stage, index) => {
        const tone = STATUS_TONE[stageStatus(statuses, stage)];
        const isLast = index === STAGES.length - 1;
        return (
          <Fragment key={stage}>
            <div className={STAGE_COLUMN}>
              <div className={`${STAGE_BOX} ${tone.box}`}>
                <p className={`text-sm font-semibold ${tone.text}`}>{stage}</p>
                {JOBS.filter(job => job.stage === stage).map(job => (
                  <p key={job.id} className={`${JOB_LINE} ${STATUS_TONE[statuses[job.id]].text}`}>
                    {STATUS_ICON[statuses[job.id]]} {job.name}
                  </p>
                ))}
              </div>
            </div>
            {!isLast && <div className={STAGE_ARROW}>→</div>}
          </Fragment>
        );
      })}
    </div>
  );
}

export default function GitLabDemo() {
  const [statuses, setStatuses] = useState<JobStatuses>(PENDING_STATUSES);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineId] = useState(() => Math.floor(Math.random() * PIPELINE_ID_RANGE) + MIN_PIPELINE_ID);
  const { schedule, clearAll } = useTimers();

  const overall = overallStatus(statuses);
  const isFinished = !isRunning && (overall === "passed" || overall === "failed");

  const setJobStatus = (jobId: string, status: JobStatus) => setStatuses(current => ({ ...current, [jobId]: status }));

  const resetPipeline = () => {
    clearAll();
    setStatuses(PENDING_STATUSES);
    setIsRunning(false);
  };

  const failJob = (jobId: string) => {
    clearAll();
    setStatuses(current => skipJobsAfter(current, jobId));
    setIsRunning(false);
  };

  const runPipeline = (shouldFail: boolean) => {
    resetPipeline();
    setIsRunning(true);
    const timings = scheduleJobs(shouldFail);
    timings.forEach(({ jobId, startAt, finishAt, fails }) => {
      schedule(() => setJobStatus(jobId, "running"), startAt);
      schedule(() => (fails ? failJob(jobId) : setJobStatus(jobId, "passed")), finishAt);
    });
    schedule(() => setIsRunning(false), timings[timings.length - 1].finishAt);
  };

  return (
    <div className="relative flex min-h-40 w-full flex-col gap-4">
      <div className={HEADER}>
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <span className={`${PIPELINE_TITLE} ${STATUS_TONE[overall].text}`}>● Pipeline #{pipelineId}</span>
          <span className={BRANCH}>{BRANCH_LABEL}</span>
        </div>
        <div className="flex w-full shrink-0 justify-between gap-1.5 sm:w-auto sm:justify-start sm:gap-2">
          <DemoButton color={PASS_COLOR} disabled={isRunning} onClick={() => runPipeline(false)} className={HEADER_BUTTON}>
            {isRunning ? "Running…" : "✓ Success"}
          </DemoButton>
          <DemoButton color={FAIL_COLOR} disabled={isRunning} onClick={() => runPipeline(true)} className={HEADER_BUTTON}>✗ Failure</DemoButton>
          <DemoButton variant="ghost" onClick={resetPipeline} className={HEADER_BUTTON} aria-label="Reset pipeline">↺</DemoButton>
        </div>
      </div>

      <StageBoxes statuses={statuses} />

      <AnimatePresence>
        {isFinished && <PipelineFace key="face" statuses={statuses} hasPassed={overall === "passed"} restart={resetPipeline} />}
      </AnimatePresence>
    </div>
  );
}
