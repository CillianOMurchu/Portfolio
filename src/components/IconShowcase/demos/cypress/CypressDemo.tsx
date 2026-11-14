import { useEffect, useRef, useState } from "react";
import DemoButton from "../components/DemoButton";
import DemoShell from "../components/DemoShell";
import WindowDots from "../components/WindowDots";
import { useTimers } from "../components/useTimers";
import { PASS_COLOR } from "../constants";
import {
  BROWSER_URL, IDLE_VIEW, SPEC_FILE, STARTING_VIEW, STATUS_ICON, STEP_RUN_MS, STEP_START_GAP_MS, TEST_STEPS,
  type StepStatus,
} from "./constants";
import {
  BROWSER, BROWSER_BAR, BROWSER_TEXT, BROWSER_VIEW, CONTROL_BUTTON, RUNNER, RUNNER_HEADER, STEP_LIST, STEP_TEXT, STEP_TONE,
} from "./styles";

const STEP_CYCLE_MS = STEP_START_GAP_MS + STEP_RUN_MS;

function stepStatus(index: number, startedCount: number, passedCount: number): StepStatus {
  if (index < passedCount) return "passed";
  return index < startedCount ? "running" : "pending";
}

function browserView(hasRun: boolean, startedCount: number) {
  if (!hasRun) return IDLE_VIEW;
  return startedCount === 0 ? STARTING_VIEW : TEST_STEPS[startedCount - 1].browserView;
}

export default function CypressDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [startedCount, setStartedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const { schedule, clearAll } = useTimers();
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const hasRun = isRunning || passedCount > 0;
  const runningIndex = startedCount > passedCount ? startedCount - 1 : -1;

  useEffect(() => {
    if (runningIndex >= 0) stepRefs.current[runningIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [runningIndex]);

  const resetDemo = () => {
    clearAll();
    setIsRunning(false);
    setStartedCount(0);
    setPassedCount(0);
  };

  const runTests = () => {
    resetDemo();
    setIsRunning(true);
    TEST_STEPS.forEach((_, index) => {
      const startAt = index * STEP_CYCLE_MS + STEP_START_GAP_MS;
      schedule(() => setStartedCount(index + 1), startAt);
      schedule(() => setPassedCount(index + 1), startAt + STEP_RUN_MS);
    });
    schedule(() => setIsRunning(false), TEST_STEPS.length * STEP_CYCLE_MS);
  };

  return (
    <DemoShell>
      <div className={BROWSER}>
        <div className={BROWSER_BAR}>
          <WindowDots />
          <span className="text-sm text-muted">{BROWSER_URL}</span>
        </div>
        <div className={BROWSER_VIEW}>
          <p className={isRunning ? BROWSER_TEXT.running : BROWSER_TEXT.idle}>{browserView(hasRun, startedCount)}</p>
        </div>
      </div>

      <div className={RUNNER}>
        <div className={RUNNER_HEADER}>
          <span className="text-muted">Tests: {SPEC_FILE}</span>
          <span className="text-success">{passedCount}/{TEST_STEPS.length}</span>
        </div>
        <div className={STEP_LIST}>
          {TEST_STEPS.map((step, index) => {
            const status = stepStatus(index, startedCount, passedCount);
            const tone = STEP_TONE[status];
            return (
              <div key={index} ref={el => { stepRefs.current[index] = el; }} className={tone.row}>
                <span className={tone.icon}>{STATUS_ICON[status]}</span>
                <div className={`${STEP_TEXT} ${tone.target}`}>
                  <span className={tone.command}>{step.command}</span>{step.target}
                </div>
                {status === "passed" && <span className="ml-auto shrink-0 text-muted">{step.duration}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <DemoButton color={PASS_COLOR} disabled={isRunning} onClick={runTests} className={`flex-1 ${CONTROL_BUTTON}`}>
          {isRunning ? "Running tests…" : "▶ cypress run"}
        </DemoButton>
        <DemoButton variant="ghost" onClick={resetDemo} className={`px-4 ${CONTROL_BUTTON}`} aria-label="Reset">↺</DemoButton>
      </div>
    </DemoShell>
  );
}
