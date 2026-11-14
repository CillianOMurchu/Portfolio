export type StepStatus = "pending" | "running" | "passed";

export interface TestStep {
  command: string;
  target: string;
  duration: string;
  /** What the mock browser shows once this step starts. */
  browserView: string;
}

export const TEST_STEPS: TestStep[] = [
  { command: "cy.visit", target: "('http://localhost:5173')", duration: "312ms", browserView: "Blank page" },
  { command: "cy.get", target: "('[data-testid=\"sphere-toggle\"]')", duration: "48ms", browserView: "Portfolio loaded" },
  { command: ".click", target: "()", duration: "23ms", browserView: "Sphere visible" },
  { command: "cy.get", target: "('.sphere')", duration: "61ms", browserView: "Sphere visible" },
  { command: ".should", target: "('be.visible')", duration: "14ms", browserView: "Sphere visible" },
  { command: "cy.get", target: "('.icon-react')", duration: "34ms", browserView: "Sphere: React highlighted" },
  { command: ".click", target: "()", duration: "19ms", browserView: "Showcase opening..." },
  { command: "cy.get", target: "('.showcase-title')", duration: "55ms", browserView: "Showcase open" },
  { command: ".should", target: "('contain', 'React')", duration: "11ms", browserView: "✓ Test passed" },
];

export const SPEC_FILE = "portfolio.cy.ts";
export const BROWSER_URL = "localhost:5173";
export const IDLE_VIEW = "Awaiting test run";
export const STARTING_VIEW = "Starting browser...";

export const STEP_START_GAP_MS = 300;
export const STEP_RUN_MS = 400;

export const STATUS_ICON: Record<StepStatus, string> = { pending: "○", running: "◌", passed: "✓" };
