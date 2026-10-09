import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import DemoShell from "./components/DemoShell";
import { MUTED_COLOR, PASS_COLOR, SECONDARY_TEXT } from "./constants";

const RXJS_ACCENT = "#b7178c";
const EVENT_SLOT = 36; // event (28px) + gap (8px) — used to compute how many fit per line

interface Event { id: number; value: number; t: number; }

const OPERATORS = [
  { id: "map",    label: "map(x => x * 2)" },
  { id: "filter", label: "filter(x => x % 2 === 0)" },
  { id: "scan",   label: "scan((acc, x) => acc + x, 0)" },
] as const;

const MODAL_EXAMPLES = [
  { op: "map",    description: "reshapes each value" },
  { op: "filter", description: "lets only some through" },
  { op: "scan",   description: "accumulates a running result" },
] as const;

const STREAM_ROW_CLASSES = "flex w-full items-start gap-4";
const STREAM_LABEL_CLASSES = "w-14 shrink-0 pt-1 text-right text-xs font-semibold text-secondary-foreground";
const MODAL_BODY_CLASSES = "mb-3.5 text-base leading-relaxed text-secondary-foreground [&_strong]:font-bold [&_strong]:text-rxjs-light";
const MODAL_PANEL_CLASSES =
  "relative w-full max-w-120 rounded-[18px] border border-rxjs/35 px-7 pt-8 pb-7 text-center " +
  "bg-[radial-gradient(120%_120%_at_0%_0%,rgb(183_23_140/0.18)_0%,transparent_55%),linear-gradient(160deg,#16101c_0%,#0d0f1a_100%)] " +
  "shadow-[0_24px_60px_rgb(0_0_0/0.55),inset_0_0_0_1px_rgb(255_255_255/0.03)]";

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
      <div className="relative h-7 min-w-0 flex-1 overflow-hidden" ref={withRef ? displayRef : undefined}>
        <AnimatePresence initial={false}>
          {ordered.map((e, index) => {
            const isOverflow = index >= capacity;
            return (
              <m.div
                key={e.id}
                className="absolute top-0 left-0 flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold"
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
              </m.div>
            );
          })}
        </AnimatePresence>
        {events.length === 0 && <span className="absolute top-1/2 left-0 -translate-y-1/2 text-xs text-muted-foreground italic">— waiting —</span>}
      </div>
    );
  };

  return (
    <DemoShell>
      <div className="flex w-full flex-col gap-4">
        {/* Stream visualization area */}
        <div className="flex w-full flex-col gap-6">
          <div className={STREAM_ROW_CLASSES}>
            <span className={STREAM_LABEL_CLASSES}>source$</span>
            {renderStream(source, RXJS_ACCENT, true)}
          </div>

          {activeOpList.length > 0 && (
            <div className="flex flex-col gap-2 pl-18">
              {activeOpList.map(op => (
                <div key={op.id} className="flex items-center gap-2 text-xs font-medium text-violet-400">
                  <span className="size-[3px] shrink-0 rounded-full bg-violet-400" />
                  <span className="font-mono">.pipe({op.label})</span>
                </div>
              ))}
            </div>
          )}

          <div className={STREAM_ROW_CLASSES}>
            <span className={STREAM_LABEL_CLASSES}>result$</span>
            {renderStream(result, PASS_COLOR)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {OPERATORS.map(op => (
          <button key={op.id} onClick={() => toggleOp(op.id)}
            className="rounded-sm px-3 py-2 text-sm font-mono text-left transition-all"
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
          style={{ background: isLive ? "rgba(183,23,140,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${isLive ? "rgba(183,23,140,0.4)" : "rgba(255,255,255,0.1)"}`, color: isLive ? RXJS_ACCENT : SECONDARY_TEXT }}>
          {isLive ? "⏹ unsubscribe()" : "▶ subscribe()"}
        </button>
        <button onClick={emit} className="rounded-lg px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: SECONDARY_TEXT }}>emit</button>
        <button onClick={resetDemo} className="rounded-lg px-4 py-2 text-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: MUTED_COLOR }}>↺</button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setIsInfoOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-rxjs/30 bg-rxjs/8 px-4 py-2 text-sm font-medium text-secondary-foreground transition hover:-translate-y-px hover:border-rxjs/55 hover:bg-rxjs/16"
          aria-label="What is an RxJS stream?"
        >
          <span className="inline-flex size-[1.15rem] items-center justify-center rounded-full border border-rxjs-light/50 text-xs text-rxjs-light italic">ℹ</span>
          What is a stream?
        </button>
      </div>

      <AnimatePresence>
        {isInfoOpen && (
          <m.div
            className="fixed inset-0 z-10010 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsInfoOpen(false)}
          >
            <m.div
              className={MODAL_PANEL_CLASSES}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3.5 right-3.5 flex size-[1.9rem] items-center justify-center rounded-full border border-white/12 bg-white/5 text-sm text-muted-foreground transition-colors hover:bg-white/12 hover:text-foreground"
                onClick={() => setIsInfoOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <div className="mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full border border-rxjs/40 bg-rxjs/14 text-2xl font-bold text-rxjs-light">~</div>
              <h3 className="mb-3.5 text-2xl font-extrabold tracking-tight text-foreground">What is a stream?</h3>

              <p className={MODAL_BODY_CLASSES}>
                A <strong>stream</strong> is a river of events flowing over time —
                clicks, keystrokes, API responses, anything that happens more than once.
              </p>
              <p className={MODAL_BODY_CLASSES}>
                RxJS lets you attach <strong>operators</strong> to that river to
                transform, filter, or combine values before they reach your code.
              </p>

              <div className="mt-5 flex flex-col gap-2 border-t border-white/8 pt-5 text-left">
                {MODAL_EXAMPLES.map(({ op, description }) => (
                  <div key={op} className="flex items-center gap-3 text-base text-secondary-foreground">
                    <span className="min-w-16 shrink-0 rounded-md border border-violet-500/30 bg-violet-500/14 px-2.5 py-0.5 text-center font-mono text-sm font-bold text-violet-300">
                      {op}
                    </span>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </DemoShell>
  );
}
