import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import { PASS_COLOR, MUTED_COLOR } from "./constants";

const RXJS_ACCENT = "#b7178c";
const DEBOUNCE_MS = 2000;

interface Event { id: number; value: number; t: number; }
interface Line { x1: number; y1: number; x2: number; y2: number; }

const OPERATORS = [
  { id: "map",      label: "map(x => x * 2)" },
  { id: "filter",   label: "filter(x => x % 2 === 0)" },
  { id: "debounce", label: "debounceTime(2000ms)" },
] as const;

const FLOAT_DUR = [1.7, 2.1, 1.5, 2.3, 1.9, 1.6, 2.0, 1.8];
const MAX = 12;
const MARBLE_STEP = 28;
const STREAM_WIDTH = MAX * MARBLE_STEP;

export default function RxJSDemo() {
  const [source, setSource] = useState<Event[]>([]);
  const [result, setResult] = useState<Event[]>([]);
  const [activeOps, setActiveOps] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const counter = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<Map<number, HTMLElement>>(new Map());
  const resultRefs = useRef<Map<number, HTMLElement>>(new Map());

  const applyPipeline = useCallback((events: Event[]) => {
    let out = [...events];
    if (activeOps.has("filter")) out = out.filter(e => e.value % 2 === 0);
    if (activeOps.has("map")) out = out.map(e => ({ ...e, value: e.value * 2 }));
    return out;
  }, [activeOps]);

  const emit = useCallback(() => {
    const val = Math.floor(Math.random() * 9) + 1;
    const event: Event = { id: counter.current++, value: val, t: Date.now() };
    setSource(prev => {
      const next = [...prev, event].slice(-MAX);
      const commit = () => setResult(applyPipeline(next));
      if (activeOps.has("debounce")) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(commit, DEBOUNCE_MS);
      } else {
        commit();
      }
      return next;
    });
  }, [applyPipeline, activeOps]);

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(emit, 800);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isLive, emit]);

  useEffect(() => {
    setResult(applyPipeline(source));
  }, [activeOps, source, applyPipeline]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const origin = containerRef.current.getBoundingClientRect();
    const nextLines: Line[] = [];
    result.forEach(re => {
      const srcEl = sourceRefs.current.get(re.id);
      const resEl = resultRefs.current.get(re.id);
      if (!srcEl || !resEl) return;
      const sr = srcEl.getBoundingClientRect();
      const rr = resEl.getBoundingClientRect();
      nextLines.push({
        x1: sr.left - origin.left + sr.width / 2,
        y1: sr.top - origin.top + sr.height / 2,
        x2: rr.left - origin.left + rr.width / 2,
        y2: rr.top - origin.top + rr.height / 2,
      });
    });
    setLines(nextLines);
  }, [source, result]);

  const toggleOp = (id: string) => setActiveOps(prev => {
    const next = new Set(prev);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    return next;
  });

  const resetDemo = () => {
    clearTimeout(debounceRef.current);
    setSource([]);
    setResult([]);
  };

  const renderStream = (
    events: Event[],
    color: string,
    refsMap: { current: Map<number, HTMLElement> },
  ) => {
    const reversed = [...events].reverse();
    return (
      <div className="flex items-center gap-2 min-h-[28px]">
        <span className="text-gray-600 text-xs">——</span>
        <div style={{ position: "relative", height: 28, width: STREAM_WIDTH, flexShrink: 0 }}>
          <AnimatePresence initial={false}>
            {reversed.map((e, i) => (
              <motion.div
                key={e.id}
                ref={el => { if (el) refsMap.current.set(e.id, el); else refsMap.current.delete(e.id); }}
                initial={{ x: -MARBLE_STEP, opacity: 0, scale: 0.55 }}
                animate={{ x: i * MARBLE_STEP, opacity: 1, scale: 1 }}
                exit={{ x: STREAM_WIDTH + MARBLE_STEP, opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                style={{ position: "absolute", top: 0, left: 0, display: "inline-flex" }}
              >
                <motion.span
                  animate={{ marginTop: [-2, 2] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: FLOAT_DUR[i % FLOAT_DUR.length],
                    ease: "easeInOut",
                    delay: (i % 6) * 0.18,
                  }}
                  className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: `${color}22`, border: `1px solid ${color}88`, color }}
                >
                  {e.value}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {events.length === 0 && <span className="text-gray-700 text-xs italic">no events yet</span>}
        <span className="text-gray-600 text-xs">——▶</span>
      </div>
    );
  };

  const activeOpList = OPERATORS.filter(op => activeOps.has(op.id));

  return (
    <DemoShell>
      <div ref={containerRef} style={{ position: "relative" }} className="flex flex-col gap-1">

        {/* source$ row */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end shrink-0 w-16">
            <span className="text-xs font-semibold" style={{ color: RXJS_ACCENT }}>source$</span>
            <span className="text-gray-600 text-xs">→</span>
          </div>
          <CodePanel accent={RXJS_ACCENT} className="p-3 font-mono text-xs flex-1 min-w-0">
            {renderStream(source, RXJS_ACCENT, sourceRefs)}
          </CodePanel>
        </div>

        {/* operators */}
        {activeOpList.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-16" />
            <div className="pl-2 border-l-2 border-gray-800 space-y-1 py-1 flex-1">
              {activeOpList.map(op => (
                <p key={op.id} className="text-xs font-mono" style={{ color: "#8b5cf6" }}>.pipe({op.label})</p>
              ))}
            </div>
          </div>
        )}

        {/* result$ row */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end shrink-0 w-16">
            <span className="text-xs font-semibold" style={{ color: PASS_COLOR }}>result$</span>
            <span className="text-gray-600 text-xs">→</span>
          </div>
          <CodePanel accent={PASS_COLOR} className="p-3 font-mono text-xs flex-1 min-w-0">
            {renderStream(result, PASS_COLOR, resultRefs)}
          </CodePanel>
        </div>

        {lines.length > 0 && (
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
            {lines.map((l, i) => (
              <motion.line
                key={i}
                x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                stroke="rgba(139,92,246,0.32)"
                strokeWidth="1"
                strokeDasharray="4 4"
                animate={{ strokeDashoffset: [8, 0] }}
                transition={{ repeat: Infinity, duration: 0.65, ease: "linear" }}
              />
            ))}
          </svg>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {OPERATORS.map(op => (
          <button key={op.id} onClick={() => toggleOp(op.id)}
            className="rounded px-3 py-2 text-xs font-mono text-left transition-all"
            style={{
              background: activeOps.has(op.id) ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeOps.has(op.id) ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: activeOps.has(op.id) ? "#a78bfa" : MUTED_COLOR,
            }}>
            {activeOps.has(op.id) ? "✓ " : "  "}.pipe({op.label})
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setIsLive(l => !l)}
          className="flex-1 rounded-lg py-2 text-sm transition-all"
          style={{ background: isLive ? "rgba(183,23,140,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLive ? "rgba(183,23,140,0.4)" : "rgba(255,255,255,0.1)"}`, color: isLive ? RXJS_ACCENT : "#9ca3af" }}>
          {isLive ? "⏹ unsubscribe()" : "▶ subscribe()"}
        </button>
        <button onClick={emit} className="rounded-lg px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>emit</button>
        <button onClick={resetDemo} className="rounded-lg px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: MUTED_COLOR }}>↺</button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => setIsInfoOpen(o => !o)}
          className="w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all"
          style={{
            background: isInfoOpen ? "rgba(183,23,140,0.15)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${isInfoOpen ? "rgba(183,23,140,0.4)" : "rgba(255,255,255,0.1)"}`,
            color: isInfoOpen ? RXJS_ACCENT : MUTED_COLOR,
          }}
          aria-label="What is an RxJS stream?"
        >
          ℹ
        </button>
        <AnimatePresence>
          {isInfoOpen && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="text-xs text-center overflow-hidden"
              style={{ color: MUTED_COLOR, maxWidth: "28rem", lineHeight: 1.6 }}
            >
              A stream is like a river of events over time — clicks, keystrokes, API responses — anything that happens more than once. RxJS lets you attach operators to that river to transform, filter, or delay the values before they reach your code.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}
