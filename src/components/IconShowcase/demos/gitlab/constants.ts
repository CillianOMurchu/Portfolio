export type JobStatus = "pending" | "running" | "passed" | "failed" | "skipped";

export const STAGES = ["build", "test", "lint", "staging", "production"] as const;
export type Stage = (typeof STAGES)[number];

export interface Job {
  id: string;
  name: string;
  stage: Stage;
}

export const JOBS: Job[] = [
  { id: "j1", name: "compile:ts", stage: "build" },
  { id: "j2", name: "unit:tests", stage: "test" },
  { id: "j3", name: "e2e:cypress", stage: "test" },
  { id: "j4", name: "eslint", stage: "lint" },
  { id: "j5", name: "deploy:staging", stage: "staging" },
  { id: "j6", name: "deploy:prod", stage: "production" },
];

export type JobStatuses = Record<string, JobStatus>;
export const PENDING_STATUSES: JobStatuses = Object.fromEntries(JOBS.map(job => [job.id, "pending"]));

/** In a failing run this job fails, and every job after it is skipped. */
export const FAILING_JOB_ID = "j5";

export const STATUS_ICON: Record<JobStatus, string> = {
  pending: "○",
  running: "◌",
  passed: "✓",
  failed: "✗",
  skipped: "⊘",
};

export const JOB_QUEUE_MS = 600;
export const JOB_RUN_MS = 1200;
export const JOB_STAGGER_MS = 80;

export const MIN_PIPELINE_ID = 100;
export const PIPELINE_ID_RANGE = 900;
export const BRANCH_LABEL = "main → production";

export const OUTCOME_TEXT = { passed: "deployed to production", failed: "pipeline blocked" } as const;
