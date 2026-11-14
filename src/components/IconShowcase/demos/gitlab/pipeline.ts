import {
  FAILING_JOB_ID, JOBS, JOB_QUEUE_MS, JOB_RUN_MS, JOB_STAGGER_MS, type JobStatus, type JobStatuses, type Stage,
} from "./constants";

export function stageStatus(statuses: JobStatuses, stage: Stage): JobStatus {
  const stageStatuses = JOBS.filter(job => job.stage === stage).map(job => statuses[job.id]);
  if (stageStatuses.includes("failed")) return "failed";
  if (stageStatuses.every(status => status === "passed")) return "passed";
  if (stageStatuses.every(status => status === "skipped")) return "skipped";
  return stageStatuses.includes("running") ? "running" : "pending";
}

export function overallStatus(statuses: JobStatuses): JobStatus {
  const all = Object.values(statuses);
  if (all.includes("failed")) return "failed";
  if (all.includes("running")) return "running";
  return all.every(status => status === "passed") ? "passed" : "pending";
}

export interface JobTiming {
  jobId: string;
  startAt: number;
  finishAt: number;
  fails: boolean;
}

export function scheduleJobs(shouldFail: boolean): JobTiming[] {
  return JOBS.map((job, index) => {
    const startAt = (index + 1) * JOB_QUEUE_MS + index * (JOB_RUN_MS + JOB_STAGGER_MS);
    return { jobId: job.id, startAt, finishAt: startAt + JOB_RUN_MS, fails: shouldFail && job.id === FAILING_JOB_ID };
  });
}

export function skipJobsAfter(statuses: JobStatuses, failedJobId: string): JobStatuses {
  const failedIndex = JOBS.findIndex(job => job.id === failedJobId);
  const next = { ...statuses, [failedJobId]: "failed" as const };
  JOBS.slice(failedIndex + 1).forEach(job => { next[job.id] = "skipped"; });
  return next;
}
