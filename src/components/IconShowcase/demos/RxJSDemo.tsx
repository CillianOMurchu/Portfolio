import { useState, useEffect, useRef, useCallback } from "react";

interface Event { id: number; value: number; t: number; }

const OPERATORS = [
  { id: "map", label: "map(x => x * 2)", apply: (v: number) => v * 2 },
  { id: "filter", label: "filter(x => x % 2 === 0)", apply: (v: number, _: number, keep: boolean) => keep ? v : null },
  { id: "debounce", label: "debounceTime(500ms)", apply: null },
];

export default function RxJSDemo() {
  const [source, setSource] = useState<Event[]>([]);
  const [result, setResult] = useState<Event[]>([]);
  const [ops, setOps] = useState<Set<string>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const counter = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
        debounceRef.current = setTimeout(processAndSet, 500);
      } else {
        processAndSet();
      }
      return next;
    });
  }, [applyPipeline, ops]);

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

  const toggleOp = (id: string) => setOps(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const renderStream = (events: Event[], color: string) => (
    <div className="flex items-center gap-1 min-h-[28px] flex-wrap">
      <span className="text-gray-600 text-xs mr-1">——</span>
      {events.map(e => (
        <span key={e.id} className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
          style={{ background: `${color}22`, border: `1px solid ${color}88`, color }}>
          {e.value}
        </span>
      ))}
      {events.length === 0 && <span className="text-gray-700 text-xs italic">no events yet</span>}
      <span className="text-gray-600 text-xs ml-1">——▶</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      <div className="rounded-lg p-4 font-mono text-xs" style={{ background: "#0d1117", border: "1px solid rgba(183,23,140,0.25)" }}>
        <p className="text-gray-500 mb-2">{"// source$"}</p>
        {renderStream(source, "#b7178c")}

        {[...ops].length > 0 && (
          <div className="my-3 pl-2 border-l-2 border-gray-800 space-y-1">
            {[...ops].map(id => {
              const op = OPERATORS.find(o => o.id === id);
              return op && <p key={id} className="text-xs" style={{ color: "#8b5cf6" }}>  .pipe({op.label})</p>;
            })}
          </div>
        )}

        <p className="text-gray-500 mt-2 mb-2">{"// result$"}</p>
        {renderStream(result, "#10b981")}
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
