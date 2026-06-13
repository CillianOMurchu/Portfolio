import { useState, useRef } from "react";
import DemoShell from "./components/DemoShell";
import DemoButton from "./components/DemoButton";
import { PASS_COLOR, FAIL_COLOR, WARN_COLOR, DARK_MUTED } from "./constants";

interface Step {
  cmd: string;
  target?: string;
  status: "pending" | "running" | "passed" | "failed";
  duration?: string;
}

const STEPS: Step[] = [
  { cmd: "cy.visit", target: "('http://localhost:5173')", status: "pending", duration: "312ms" },
  { cmd: "cy.get", target: "('[data-testid=\"sphere-toggle\"]')", status: "pending", duration: "48ms" },
  { cmd: ".click", target: "()", status: "pending", duration: "23ms" },
  { cmd: "cy.get", target: "('.sphere')", status: "pending", duration: "61ms" },
  { cmd: ".should", target: "('be.visible')", status: "pending", duration: "14ms" },
  { cmd: "cy.get", target: "('.icon-react')", status: "pending", duration: "34ms" },
  { cmd: ".click", target: "()", status: "pending", duration: "19ms" },
  { cmd: "cy.get", target: "('.showcase-title')", status: "pending", duration: "55ms" },
  { cmd: ".should", target: "('contain', 'React')", status: "pending", duration: "11ms" },
];

const BROWSER_STATES = [
  "Blank page",
  "Portfolio loaded",
  "Sphere visible",
  "Sphere visible",
  "Sphere visible",
  "Sphere: React highlighted",
  "Showcase opening...",
  "Showcase open",
  "✓ Test passed",
];

const STATUS_COLOR: Record<Step["status"], string> = {
  pending: DARK_MUTED,
  running: WARN_COLOR,
  passed: PASS_COLOR,
  failed: FAIL_COLOR,
};

export default function CypressDemo() {
  const [steps, setSteps] = useState(STEPS);
  const [browserState, setBrowserState] = useState("Awaiting test run");
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setSteps(STEPS);
    setBrowserState("Starting browser...");
    setRunning(true);
    let t = 0;
    STEPS.forEach((_, i) => {
      t += 300;
      timers.current.push(setTimeout(() => {
        setSteps((prev) => prev.map((s, j) => j === i ? { ...s, status: "running" } : s));
        setBrowserState(BROWSER_STATES[i] || "Running...");
      }, t));
      t += 400;
      timers.current.push(setTimeout(() => {
        setSteps((prev) => prev.map((s, j) => j === i ? { ...s, status: "passed" } : s));
        if (i === STEPS.length - 1) setRunning(false);
      }, t));
    });
  };

  const reset = () => { timers.current.forEach(clearTimeout); setSteps(STEPS); setBrowserState("Awaiting test run"); setRunning(false); };

  const passed = steps.filter(s => s.status === "passed").length;

  return (
    <DemoShell>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(23,32,44,1)", background: "#0d1117" }}>
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "#1c2128", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-xs text-gray-500">localhost:5173</span>
        </div>
        <div className="px-4 py-6 text-center min-h-[80px] flex items-center justify-center">
          <p className="text-sm" style={{ color: running ? PASS_COLOR : "#9ca3af" }}>{browserState}</p>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden font-mono text-xs" style={{ background: "#0d1117", border: "1px solid rgba(23,32,44,0.8)" }}>
        <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-gray-500">Tests: portfolio.cy.ts</span>
          <span style={{ color: PASS_COLOR }}>{passed}/{STEPS.length}</span>
        </div>
        {steps.map((s, i) => (
          <div key={i} className="px-3 py-1 flex items-center gap-2 min-w-0"
            style={{ background: s.status === "running" ? "rgba(245,158,11,0.06)" : "transparent" }}>
            <span className="shrink-0" style={{ color: STATUS_COLOR[s.status] }}>
              {s.status === "pending" ? "○" : s.status === "running" ? "◌" : s.status === "passed" ? "✓" : "✗"}
            </span>
            <div className="truncate min-w-0 flex-1" style={{ color: s.status === "running" ? WARN_COLOR : s.status === "passed" ? "#9ca3af" : DARK_MUTED }}>
              <span style={{ color: s.status === "running" || s.status === "passed" ? "#38bdf8" : DARK_MUTED }}>{s.cmd}</span>
              {s.target}
            </div>
            {s.status === "passed" && <span className="ml-auto shrink-0 text-gray-600">{s.duration}</span>}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <DemoButton color={PASS_COLOR} disabled={running} onClick={run} className="flex-1 py-2 text-sm">
          {running ? "Running tests…" : "▶ cypress run"}
        </DemoButton>
        <DemoButton variant="ghost" onClick={reset} className="px-4 py-2 text-sm">↺</DemoButton>
      </div>
    </DemoShell>
  );
}
