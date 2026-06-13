import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DemoShell from "./components/DemoShell";
import { PASS_COLOR, MUTED_COLOR } from "./constants";

const RXJS_ACCENT = "#b7178c";
const DEBOUNCE_MS = 2000;
const EVENT_SLOT = 36; // event (28px) + gap (8px) — used to compute how many fit per line

interface Event { id: number; value: number; t: number; }

const OPERATORS = [
  { id: "map",      label: "map(x => x * 2)" },
  { id: "filter",   label: "filter(x => x % 2 === 0)" },
  { id: "debounce", label: "debounceTime(2000ms)" },
] as const;

export default function RxJSDemo() {
  const [source, setSource] = useState<Event[]>([]);
  const [result, setResult] = useState<Event[]>([]);
  const [activeOps, setActiveOps] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [capacity, setCapacity] = useState(6);

  const counter = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const displayRef = useRef<HTMLDivElement>(null);

  // Measure how many events fit on one line so they never wrap or overflow
  useLayoutEffect(() => {
    const el = displayRef.current;
    if (!el) return;
    const measure = () => {
      const fits = Math.max(1, Math.floor(el.clientWidth / EVENT_SLOT));
      setCapacity(fits);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      // Keep one extra so the overflowing event can animate out past the edge
      const next = [...prev, event].slice(-(capacity + 1));
      const commit = () => setResult(applyPipeline(next));
      if (activeOps.has("debounce")) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(commit, DEBOUNCE_MS);
      } else {
        commit();
      }
      return next.slice(-(capacity + 1));
    });
  }, [applyPipeline, activeOps, capacity]);

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

  const activeOpList = OPERATORS.filter(op => activeOps.has(op.id));

  const renderStream = (events: Event[], color: string, withRef = false) => {
    // newest first → index 0 is leftmost; older events slide right by one slot each
    const ordered = [...events].reverse();
    return (
      <div className="rxjs-stream-display" ref={withRef ? displayRef : undefined}>
        <AnimatePresence initial={false}>
          {ordered.map((e, index) => {
            const isOverflow = index >= capacity;
            return (
              <motion.div
                key={e.id}
                className="rxjs-event"
                style={{ borderColor: color, color }}
                initial={{ x: -EVENT_SLOT, opacity: 0, scale: 0.6 }}
                animate={{
                  x: index * EVENT_SLOT + (isOverflow ? EVENT_SLOT : 0),
                  opacity: isOverflow ? 0 : 1,
                  scale: isOverflow ? 0.6 : 1,
                }}
                exit={{ x: (capacity + 1) * EVENT_SLOT, opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              >
                {e.value}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 && <span className="rxjs-empty">— waiting —</span>}
      </div>
    );
  };

  return (
    <DemoShell>
      <div className="rxjs-demo">
        {/* Stream visualization area */}
        <div className="rxjs-streams">
          <div className="rxjs-stream-row">
            <span className="rxjs-stream-label">source$</span>
            {renderStream(source, RXJS_ACCENT, true)}
          </div>

          {activeOpList.length > 0 && (
            <div className="rxjs-operators-list">
              {activeOpList.map(op => (
                <div key={op.id} className="rxjs-operator-item">
                  <span className="rxjs-operator-dot" />
                  <span className="rxjs-operator-text">.pipe({op.label})</span>
                </div>
              ))}
            </div>
          )}

          <div className="rxjs-stream-row">
            <span className="rxjs-stream-label">result$</span>
            {renderStream(result, PASS_COLOR)}
          </div>
        </div>
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
