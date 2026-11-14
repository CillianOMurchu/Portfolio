export interface Commit {
  hash: string;
  message: string;
  ago: string;
  additions: number;
  deletions: number;
}

export const COMMITS: Commit[] = [
  { hash: "4a9f2c1", message: "feat: icon click → showcase overlay with demos", ago: "2h ago", additions: 847, deletions: 12 },
  { hash: "de45ca7", message: "add stencil icon to sphere", ago: "1d ago", additions: 3, deletions: 0 },
  { hash: "a02272c", message: "refactor: extract perspective projection as projectToScreen", ago: "3d ago", additions: 24, deletions: 19 },
  { hash: "45ee08e", message: "refactor: name magic spring animation constants", ago: "3d ago", additions: 8, deletions: 4 },
  { hash: "ab31cc5", message: "refactor: move static styles to CSS, simplify button render", ago: "5d ago", additions: 31, deletions: 47 },
];

export type MilestoneTone = "success" | "react" | "highlight" | "warning";

export interface Milestone {
  label: string;
  week: number;
  day: number;
  tone: MilestoneTone;
}

export const MILESTONES: Milestone[] = [
  { label: "First commit", week: 2, day: 3, tone: "success" },
  { label: "Launched portfolio", week: 18, day: 1, tone: "react" },
  { label: "Added sphere", week: 30, day: 4, tone: "highlight" },
  { label: "Click showcase", week: 47, day: 2, tone: "warning" },
];

export const WEEKS = 52;
export const DAYS = 7;
export const MAX_ACTIVITY_LEVEL = 4;
/** Share of days with no commits. */
export const QUIET_DAY_CHANCE = 0.6;
