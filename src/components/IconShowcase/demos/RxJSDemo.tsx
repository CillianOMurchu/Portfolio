import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Event { id: number; value: number; t: number; }
interface Line { x1: number; y1: number; x2: number; y2: number; }

const OPERATORS = [
  { id: "map", label: "map(x => x * 2)", apply: (v: number) => v * 2 },
  { id: "filter", label: "filter(x => x % 2 === 0)", apply: (v: number, _: number, keep: boolean) => keep ? v : null },
  { id: "debounce", label: "debounceTime(100ms)", apply: null },
];

// Varied float durations so items bob out of phase
const FLOAT_DUR = [1.7, 2.1, 1.5, 2.3, 1.9, 1.6, 2.0, 1.8];

export default function RxJSDemo() {
  const [source, setSource] = useState<Event[]>([]);
  const [result, setResult] = useState<Event[]>([]);
  const [ops, setOps] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  const counter = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<Map<number, HTMLElement>>(new Map());
  const resultRefs = useRef<Map<number, HTMLElement>>(new Map());
  const MAX = 12;

  const applyPipeline = useCallback((events: Event[]) => {
    let out = [...events];
    if (ops.has("filter")) out = out.filter(e => e.value % 2 === 0);
    if (ops.has("map")) out = out.map(e => ({ ...e, value: e.value * 2 }));
    return out;
  }, [ops]);

  const emit = useCallback(() => {
    const val = Math.floor(Math.random() * 9) + 1;
    const event: Event = { id: counter.current++, value: val, t: Date.now() };
    setSource(prev => {
      const next = [...prev, event].slice(-MAX);
      const processAndSet = () => setResult(applyPipeline(next));
      if (ops.has("debounce")) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(processAndSet, 100);
      } else {
        processAndSet();
      }
      return next;
    });
  }, [applyPipeline, ops]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(debounceRef.current);
    };
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
  }, [ops, source, applyPipeline]);

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

  const toggleOp = (id: string) => setOps(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const renderStream = (
    events: Event[],
    color: string,
    refsMap: React.MutableRefObject<Map<number, HTMLElement>>,
  ) => (
    <div className="flex items-center gap-1 min-h-[28px] flex-wrap">
      <span className="text-gray-600 text-xs mr-1">——</span>
      <AnimatePresence initial={false}>
        {events.map((e, i) => (
          // outer: layout shift (items slide left as stream flows) + margin-top float
          // margin-top for float avoids conflicting with layout's transform
          <motion.div
            key={e.id}
            layout
            ref={el => { if (el) refsMap.current.set(e.id, el); else refsMap.current.delete(e.id); }}
            animate={{ marginTop: [-2, 2] }}
            transition={{
              layout: { type: "spring", stiffness: 380, damping: 32 },
              marginTop: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: FLOAT_DUR[i % FLOAT_DUR.length],
                ease: "easeInOut",
                delay: (i % 6) * 0.18,
              },
            }}
            style={{ display: "inline-flex" }}
          >
            {/* inner: drop-in entrance, slide-left exit */}
            <motion.span
              initial={{ opacity: 0, y: -14, scale: 0.55 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -14, scale: 0.6 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
              className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: `${color}22`, border: `1px solid ${color}88`, color }}
            >
              {e.value}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>
      {events.length === 0 && <span className="text-gray-700 text-xs italic">no events yet</span>}
      <span className="text-gray-600 text-xs ml-1">——▶</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      <div
        className="rounded-lg p-4 font-mono text-xs"
        style={{ background: "#0d1117", border: "1px solid rgba(183,23,140,0.25)" }}
      >
        <div ref={containerRef} style={{ position: "relative" }}>
          <p className="text-gray-500 mb-2">{"// source$"}</p>
          {renderStream(source, "#b7178c", sourceRefs)}

          {[...ops].length > 0 && (
            <div className="my-3 pl-2 border-l-2 border-gray-800 space-y-1">
              {[...ops].map(id => {
                const op = OPERATORS.find(o => o.id === id);
                return op && <p key={id} className="text-xs" style={{ color: "#8b5cf6" }}>  .pipe({op.label})</p>;
              })}
            </div>
          )}

          <p className="text-gray-500 mt-2 mb-2">{"// result$"}</p>
          {renderStream(result, "#10b981", resultRefs)}

          {lines.length > 0 && (
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}
            >
              {lines.map((l, i) => (
                <motion.line
                  key={i}
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke="rgba(139,92,246,0.32)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  // dashes flow downward: source → through operators → result
                  animate={{ strokeDashoffset: [8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.65, ease: "linear" }}
                />
              ))}
            </svg>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {OPERATORS.map(op => (
          <button key={op.id} onClick={() => toggleOp(op.id)}
            className="rounded px-3 py-2 text-xs font-mono text-left transition-all"
            style={{
              background: ops.has(op.id) ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${ops.has(op.id) ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: ops.has(op.id) ? "#a78bfa" : "#6b7280",
            }}>
            {ops.has(op.id) ? "✓ " : "  "}.pipe({op.label})
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setIsLive(l => !l)}
          className="flex-1 rounded-lg py-2 text-sm transition-all"
          style={{ background: isLive ? "rgba(183,23,140,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLive ? "rgba(183,23,140,0.4)" : "rgba(255,255,255,0.1)"}`, color: isLive ? "#b7178c" : "#9ca3af" }}>
          {isLive ? "⏹ unsubscribe()" : "▶ subscribe()"}
        </button>
        <button onClick={emit} className="rounded-lg px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>emit</button>
        <button onClick={() => { setSource([]); setResult([]); }} className="rounded-lg px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#6b7280" }}>↺</button>
      </div>
    </div>
  );
}
