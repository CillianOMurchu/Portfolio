import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DemoShell from "./components/DemoShell";
import { PASS_COLOR, MUTED_COLOR } from "./constants";

const RXJS_ACCENT = "#b7178c";
const EVENT_SLOT = 36; // event (28px) + gap (8px) — used to compute how many fit per line

interface Event { id: number; value: number; t: number; }

const OPERATORS = [
  { id: "map",    label: "map(x => x * 2)" },
  { id: "filter", label: "filter(x => x % 2 === 0)" },
  { id: "scan",   label: "scan((acc, x) => acc + x, 0)" },
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
  const displayRef = useRef<HTMLDivElement>(null);
  const scanAcc = useRef(0); // running total for scan, persists across emissions
  const activeOpsRef = useRef(activeOps); // latest ops, read at emit time
  activeOpsRef.current = activeOps;

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

  // Push one source value through the operators active *right now*.
  // Returns the resulting event, or null if it was filtered out.
  const runThroughPipeline = useCallback((event: Event): Event | null => {
    const ops = activeOpsRef.current;
    let value = event.value;
    if (ops.has("filter") && value % 2 !== 0) return null;
    if (ops.has("map")) value *= 2;
    if (ops.has("scan")) value = scanAcc.current += value;
    return { ...event, value };
  }, []);

  const emit = useCallback(() => {
    const val = Math.floor(Math.random() * 9) + 1;
    const event: Event = { id: counter.current++, value: val, t: Date.now() };

    // Keep one extra so the overflowing event can animate out past the edge
    setSource(prev => [...prev, event].slice(-(capacity + 1)));

    const processed = runThroughPipeline(event);
    if (processed) {
      setResult(prev => [...prev, processed].slice(-(capacity + 1)));
    }
  }, [capacity, runThroughPipeline]);

  useEffect(() => () => {
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(emit, 1600);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isLive, emit]);

  const toggleOp = (id: string) => setActiveOps(prev => {
    const next = new Set(prev);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    // scan starts a fresh running total each time it's switched on
    if (id === "scan" && next.has("scan")) scanAcc.current = 0;
    return next;
  });

  const resetDemo = () => {
    scanAcc.current = 0;
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
            className="rounded px-3 py-2 text-sm font-mono text-left transition-all"
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

      <div className="flex justify-center">
        <button
          onClick={() => setIsInfoOpen(true)}
          className="rxjs-info-trigger"
          aria-label="What is an RxJS stream?"
        >
          <span className="rxjs-info-trigger-icon">ℹ</span>
          What is a stream?
        </button>
      </div>

      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            className="rxjs-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsInfoOpen(false)}
          >
            <motion.div
              className="rxjs-modal"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rxjs-modal-close"
                onClick={() => setIsInfoOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <div className="rxjs-modal-badge">~</div>
              <h3 className="rxjs-modal-title">What is a stream?</h3>

              <p className="rxjs-modal-body">
                A <strong>stream</strong> is a river of events flowing over time —
                clicks, keystrokes, API responses, anything that happens more than once.
              </p>
              <p className="rxjs-modal-body">
                RxJS lets you attach <strong>operators</strong> to that river to
                transform, filter, or combine values before they reach your code.
              </p>

              <div className="rxjs-modal-examples">
                <div className="rxjs-modal-example">
                  <span className="rxjs-modal-op">map</span>
                  <span>reshapes each value</span>
                </div>
                <div className="rxjs-modal-example">
                  <span className="rxjs-modal-op">filter</span>
                  <span>lets only some through</span>
                </div>
                <div className="rxjs-modal-example">
                  <span className="rxjs-modal-op">scan</span>
                  <span>accumulates a running result</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DemoShell>
  );
}
