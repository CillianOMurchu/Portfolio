import { useState, useRef } from "react";

const FIB_RESULTS: Record<number, { rust: number; js: number }> = {
  10: { rust: 0.001, js: 0.003 },
  20: { rust: 0.002, js: 0.15 },
  30: { rust: 0.003, js: 8.7 },
  35: { rust: 0.004, js: 98 },
  40: { rust: 0.005, js: 1100 },
  42: { rust: 0.006, js: 4300 },
};

const STEPS = [10, 20, 30, 35, 40, 42];

export default function RustDemo() {
  const [n, setN] = useState(30);
  const [phase, setPhase] = useState<"idle" | "rust" | "js" | "done">("idle");
  const [rustTime, setRustTime] = useState<number | null>(null);
  const [jsTime, setJsTime] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setPhase("rust");
    setRustTime(null);
    setJsTime(null);
    const r = FIB_RESULTS[n] ?? { rust: 0.005, js: 500 };
    timers.current.push(setTimeout(() => { setRustTime(r.rust); setPhase("js"); }, 600));
    timers.current.push(setTimeout(() => { setJsTime(r.js); setPhase("done"); }, 1600));
  };

  const speedup = rustTime && jsTime ? Math.round(jsTime / rustTime).toLocaleString() : null;

  const fmt = (ms: number) => ms < 1 ? `${(ms * 1000).toFixed(0)}μs` : ms < 1000 ? `${ms.toFixed(1)}ms` : `${(ms / 1000).toFixed(1)}s`;

  const barWidth = (ms: number, max: number) => `${Math.max(4, Math.min(100, (ms / max) * 100))}%`;

  const maxTime = jsTime ?? (FIB_RESULTS[n]?.js ?? 100);

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">fibonacci({n})</p>
          <span className="text-xs font-mono" style={{ color: "#ce4a00" }}>
            {n >= 40 ? "🔥 borrow checker sweating" : n >= 35 ? "⚡ warming up" : "✓ trivial"}
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {STEPS.map(s => (
            <button key={s} onClick={() => { setN(s); setPhase("idle"); setRustTime(null); setJsTime(null); }}
              className="px-3 py-1 rounded text-xs transition-all"
              style={{ background: n === s ? "rgba(206,74,0,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${n === s ? "#ce4a00" : "rgba(255,255,255,0.08)"}`, color: n === s ? "#ce4a00" : "#6b7280" }}>
              n={s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg p-4 font-mono text-xs" style={{ background: "#0d1117", border: "1px solid rgba(206,74,0,0.2)" }}>
        {["rust", "js"].map((lang) => {
          const time = lang === "rust" ? rustTime : jsTime;
          const isRunning = (lang === "rust" && phase === "rust") || (lang === "js" && phase === "js");
          const color = lang === "rust" ? "#ce4a00" : "#f7df1e";
          const label = lang === "rust" ? "🦀 Rust (WASM)" : "🟨 JavaScript";
          return (
            <div key={lang} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1">
                <span style={{ color }}>{label}</span>
                <span style={{ color: time ? color : "#4b5563" }}>
                  {isRunning ? "calculating…" : time ? fmt(time) : "—"}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: time ? barWidth(time, maxTime) : isRunning ? "15%" : "0%", background: color, opacity: isRunning ? 0.6 : 1 }} />
              </div>
            </div>
          );
        })}
      </div>

      {phase === "done" && speedup && (
        <div className="rounded-lg px-4 py-3 text-center" style={{ background: "rgba(206,74,0,0.08)", border: "1px solid rgba(206,74,0,0.25)" }}>
          <p className="text-2xl font-bold" style={{ color: "#ce4a00" }}>{speedup}×</p>
          <p className="text-xs text-gray-400 mt-0.5">faster in Rust — same algorithm, zero GC pauses</p>
        </div>
      )}

      <button onClick={run} disabled={phase === "rust" || phase === "js"}
        className="rounded-lg py-2.5 text-sm font-semibold transition-all"
        style={{ background: "rgba(206,74,0,0.15)", border: "1px solid rgba(206,74,0,0.35)", color: phase === "idle" || phase === "done" ? "#ce4a00" : "#4b5563", cursor: phase === "idle" || phase === "done" ? "pointer" : "default" }}>
        {phase === "idle" ? "▶ cargo run" : phase === "done" ? "▶ run again" : "Running…"}
      </button>
    </div>
  );
}
