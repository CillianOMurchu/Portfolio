import { useEffect, useRef, useState } from "react";
import DemoShell from "../components/DemoShell";
import ActiveOperators from "./ActiveOperators";
import OperatorToggles from "./OperatorToggles";
import StreamControls from "./StreamControls";
import StreamInfo from "./StreamInfo";
import StreamRow from "./StreamRow";
import { EMIT_INTERVAL_MS, MAX_SOURCE_VALUE, type OperatorId, type StreamEvent } from "./constants";
import { applyOperators } from "./pipeline";
import { useStreamCapacity } from "./useStreamCapacity";

const randomSourceValue = () => Math.floor(Math.random() * MAX_SOURCE_VALUE) + 1;

export default function RxJSDemo() {
  const [source, setSource] = useState<StreamEvent[]>([]);
  const [result, setResult] = useState<StreamEvent[]>([]);
  const [activeOps, setActiveOps] = useState<ReadonlySet<OperatorId>>(new Set());
  const [isLive, setIsLive] = useState(false);
  const { trackRef, capacity } = useStreamCapacity();

  const nextId = useRef(0);
  const runningTotal = useRef(0);
  // Read at emit time so toggling an operator only affects later events.
  const activeOpsRef = useRef(activeOps);
  activeOpsRef.current = activeOps;

  // One extra event is kept so the overflowing one can animate out past the edge.
  const keepVisible = (events: StreamEvent[]) => events.slice(-(capacity + 1));

  const emit = () => {
    const event: StreamEvent = { id: nextId.current++, value: randomSourceValue() };
    setSource(prev => keepVisible([...prev, event]));

    const processed = applyOperators(event.value, activeOpsRef.current, runningTotal.current);
    if (!processed) return;
    runningTotal.current = processed.runningTotal;
    setResult(prev => keepVisible([...prev, { ...event, value: processed.value, from: event.value }]));
  };

  const emitRef = useRef(emit);
  emitRef.current = emit;

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => emitRef.current(), EMIT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleOperator = (id: OperatorId) => {
    const next = new Set(activeOps);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    if (id === "scan") runningTotal.current = 0;
    setActiveOps(next);
  };

  const resetDemo = () => {
    runningTotal.current = 0;
    setSource([]);
    setResult([]);
  };

  return (
    <DemoShell>
      <div className="flex w-full flex-col gap-6">
        <StreamRow label="source$" events={source} tone="source" capacity={capacity} trackRef={trackRef} />
        <ActiveOperators activeOps={activeOps} />
        <StreamRow label="result$" events={result} tone="result" capacity={capacity} />
      </div>
      <OperatorToggles activeOps={activeOps} toggleOperator={toggleOperator} />
      <StreamControls isLive={isLive} toggleLive={() => setIsLive(live => !live)} emit={emit} resetDemo={resetDemo} />
      <StreamInfo />
    </DemoShell>
  );
}
