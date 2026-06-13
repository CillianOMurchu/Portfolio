import { useState, useRef } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import DemoButton from "./components/DemoButton";
import { PASS_COLOR, FAIL_COLOR, WARN_COLOR, MUTED_COLOR, DARK_MUTED } from "./constants";

const PUPPETEER_ACCENT = "#00d8a2";

const SCRIPT = [
  { code: "const browser = await puppeteer.launch({ headless: true })", msg: "Launching headless Chrome…" },
  { code: "const page = await browser.newPage()", msg: "New page created" },
  { code: "await page.goto('https://cillianomurchu.vercel.app')", msg: "Navigating to portfolio…" },
  { code: "await page.waitForSelector('.sphere-toggle')", msg: "Waiting for sphere toggle…" },
  { code: "await page.click('.sphere-toggle')", msg: "Clicked sphere toggle ✓" },
  { code: "await page.waitForSelector('.sphere canvas')", msg: "Sphere canvas loaded ✓" },
  { code: "await page.screenshot({ path: 'sphere.png' })", msg: "Screenshot captured ✓" },
  { code: "await browser.close()", msg: "Browser closed" },
];

export default function PuppeteerDemo() {
  const [lines, setLines] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setLines([]);
    setDone(false);
    setRunning(true);
    SCRIPT.forEach((_, i) => {
      timers.current.push(setTimeout(() => {
        setLines(prev => [...prev, i]);
        if (i === SCRIPT.length - 1) { setRunning(false); setDone(true); }
      }, i * 550));
    });
  };

  const reset = () => { timers.current.forEach(clearTimeout); setLines([]); setDone(false); setRunning(false); };

  return (
    <DemoShell>
      <CodePanel accent={PUPPETEER_ACCENT} className="overflow-hidden font-mono text-xs">
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: "#081a14", borderBottom: "1px solid rgba(0,216,162,0.15)" }}>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: FAIL_COLOR }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: WARN_COLOR }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: PASS_COLOR }} />
          </div>
          <span className="text-gray-600">scraper.js</span>
          <span className="ml-auto" style={{ color: running ? PUPPETEER_ACCENT : done ? PASS_COLOR : MUTED_COLOR }}>
            {running ? "▶ running" : done ? "✓ done (4.2s)" : "idle"}
          </span>
        </div>

        <div className="p-3 space-y-1">
          {SCRIPT.map((step, i) => {
            const active = lines.includes(i);
            const isCurrent = lines[lines.length - 1] === i && running;
            return (
              <div key={i} className="flex gap-2 transition-all duration-300" style={{ opacity: active ? 1 : 0.25 }}>
                <span className="text-gray-700 select-none shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <span style={{ color: isCurrent ? PUPPETEER_ACCENT : active ? "#9ca3af" : DARK_MUTED }}>
                    {step.code}
                  </span>
                  {active && !isCurrent && (
                    <span className="ml-2" style={{ color: PASS_COLOR }}>{"// "}{step.msg}</span>
                  )}
                  {isCurrent && (
                    <span className="ml-2 animate-pulse" style={{ color: PUPPETEER_ACCENT }}>{"// "}{step.msg}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CodePanel>

      {done && (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,216,162,0.25)" }}>
          <div className="px-3 py-1.5 text-xs text-gray-500" style={{ background: "rgba(0,216,162,0.05)", borderBottom: "1px solid rgba(0,216,162,0.1)" }}>
            sphere.png — 1280×720
          </div>
          <div className="p-4 flex items-center justify-center" style={{ background: "#0a0e1a", minHeight: 80 }}>
            <div className="text-center space-y-1">
              <div className="w-16 h-16 rounded-full mx-auto border-2 flex items-center justify-center" style={{ borderColor: PASS_COLOR, background: "rgba(16,185,129,0.05)" }}>
                <span style={{ color: PASS_COLOR }}>🌐</span>
              </div>
              <p className="text-xs text-gray-600">Portfolio screenshot captured</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <DemoButton color={PUPPETEER_ACCENT} disabled={running} onClick={run} className="flex-1 py-2.5 text-sm">
          {running ? "Running…" : "▶ node scraper.js"}
        </DemoButton>
        <DemoButton variant="ghost" onClick={reset} className="px-4 py-2 text-sm">↺</DemoButton>
      </div>
    </DemoShell>
  );
}
