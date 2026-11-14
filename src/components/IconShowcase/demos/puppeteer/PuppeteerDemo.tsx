import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoButton from "../components/DemoButton";
import DemoShell from "../components/DemoShell";
import WindowDots from "../components/WindowDots";
import { useTimers } from "../components/useTimers";
import { LINE_INTERVAL_MS, RUN_STATE_LABEL, SCREENSHOT_NAME, SCRIPT, SCRIPT_FILE, type RunState } from "./constants";
import {
  CODE_TONE, COMMENT_CURRENT, COMMENT_EXECUTED, CONTROL_BUTTON, EDITOR, EDITOR_BAR, LINE_HIDDEN, LINE_NUMBER, LINE_SHOWN,
  PUPPETEER_COLOR, RUN_STATE_TONE, SCREENSHOT, SCREENSHOT_BODY, SCREENSHOT_CAPTION, SCREENSHOT_GLOBE, SCRIPT_BODY,
} from "./styles";

const lineNumber = (index: number) => String(index + 1).padStart(2, "0");

function ScriptLine({ index, executedCount, isRunning }: { index: number; executedCount: number; isRunning: boolean }) {
  const step = SCRIPT[index];
  const isExecuted = index < executedCount;
  const isCurrent = isRunning && index === executedCount - 1;
  const codeTone = isCurrent ? CODE_TONE.current : isExecuted ? CODE_TONE.executed : CODE_TONE.pending;
  const commentClass = isCurrent ? COMMENT_CURRENT : COMMENT_EXECUTED;

  return (
    <div className={isExecuted ? LINE_SHOWN : LINE_HIDDEN}>
      <span className={LINE_NUMBER}>{lineNumber(index)}</span>
      <div className="flex-1">
        <span className={codeTone}>{step.code}</span>
        {isExecuted && <span className={commentClass}>{"// "}{step.message}</span>}
      </div>
    </div>
  );
}

function ScreenshotPreview() {
  return (
    <div className={SCREENSHOT}>
      <div className={SCREENSHOT_CAPTION}>{SCREENSHOT_NAME}</div>
      <div className={SCREENSHOT_BODY}>
        <div className="space-y-1 text-center">
          <div className={SCREENSHOT_GLOBE}>🌐</div>
          <p className="text-sm text-muted">Portfolio screenshot captured</p>
        </div>
      </div>
    </div>
  );
}

export default function PuppeteerDemo() {
  const [runState, setRunState] = useState<RunState>("idle");
  const [executedCount, setExecutedCount] = useState(0);
  const { schedule, clearAll } = useTimers();
  const isRunning = runState === "running";

  const resetDemo = () => {
    clearAll();
    setExecutedCount(0);
    setRunState("idle");
  };

  const runScript = () => {
    resetDemo();
    setRunState("running");
    SCRIPT.forEach((_, index) => schedule(() => setExecutedCount(index + 1), index * LINE_INTERVAL_MS));
    schedule(() => setRunState("done"), (SCRIPT.length - 1) * LINE_INTERVAL_MS);
  };

  return (
    <DemoShell>
      <CodePanel accent={PUPPETEER_COLOR} className={EDITOR}>
        <div className={EDITOR_BAR}>
          <WindowDots />
          <span className="text-muted">{SCRIPT_FILE}</span>
          <span className={RUN_STATE_TONE[runState]}>{RUN_STATE_LABEL[runState]}</span>
        </div>
        <div className={SCRIPT_BODY}>
          {SCRIPT.map((step, index) => <ScriptLine key={step.code} index={index} executedCount={executedCount} isRunning={isRunning} />)}
        </div>
      </CodePanel>

      {runState === "done" && <ScreenshotPreview />}

      <div className="flex gap-2">
        <DemoButton color={PUPPETEER_COLOR} disabled={isRunning} onClick={runScript} className={`flex-1 ${CONTROL_BUTTON}`}>
          {isRunning ? "Running…" : "▶ node scraper.js"}
        </DemoButton>
        <DemoButton variant="ghost" onClick={resetDemo} className={`px-4 py-2 text-sm`} aria-label="Reset">↺</DemoButton>
      </div>
    </DemoShell>
  );
}
