import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { useTimers } from "../components/useTimers";
import {
  BENCHMARKS, BUTTON_LABEL, DEFAULT_INPUT, EFFORT_LABEL, HOT_INPUT, INPUTS, JS_FINISH_MS, RUNTIMES, RUST_FINISH_MS,
  WARM_INPUT, type Phase,
} from "./constants";
import RuntimeBar from "./RuntimeBar";
import { EFFORT, INPUT_OFF, INPUT_ON, RUN_BUTTON, RUST_COLOR, SPEEDUP_PANEL, SPEEDUP_VALUE } from "./styles";

function effortLabel(input: number) {
  if (input >= HOT_INPUT) return EFFORT_LABEL.hot;
  return input >= WARM_INPUT ? EFFORT_LABEL.warm : EFFORT_LABEL.trivial;
}

export default function RustDemo() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [phase, setPhase] = useState<Phase>("idle");
  const { schedule, clearAll } = useTimers();

  const benchmark = BENCHMARKS[input];
  const isRunning = phase === "rust" || phase === "js";
  const finishedTimes = {
    rust: phase === "js" || phase === "done" ? benchmark.rust : null,
    js: phase === "done" ? benchmark.js : null,
  };
  const speedup = Math.round(benchmark.js / benchmark.rust).toLocaleString();

  const chooseInput = (value: number) => {
    clearAll();
    setInput(value);
    setPhase("idle");
  };

  const runBenchmark = () => {
    clearAll();
    setPhase("rust");
    schedule(() => setPhase("js"), RUST_FINISH_MS);
    schedule(() => setPhase("done"), JS_FINISH_MS);
  };

  return (
    <DemoShell className="gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">fibonacci({input})</p>
          <span className={EFFORT}>{effortLabel(input)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INPUTS.map(value => (
            <button key={value} type="button" onClick={() => chooseInput(value)} className={value === input ? INPUT_ON : INPUT_OFF}>
              n={value}
            </button>
          ))}
        </div>
      </div>

      <CodePanel accent={RUST_COLOR}>
        {RUNTIMES.map(runtime => (
          <RuntimeBar
            key={runtime.id}
            runtime={runtime.id}
            label={runtime.label}
            timeMs={finishedTimes[runtime.id]}
            slowestMs={benchmark.js}
            isRunning={phase === runtime.id}
          />
        ))}
      </CodePanel>

      {phase === "done" && (
        <div className={SPEEDUP_PANEL}>
          <p className={SPEEDUP_VALUE}>{speedup}×</p>
          <p className="mt-0.5 text-sm text-muted">faster in Rust — same algorithm, zero GC pauses</p>
        </div>
      )}

      <button type="button" onClick={runBenchmark} disabled={isRunning} className={RUN_BUTTON}>{BUTTON_LABEL[phase]}</button>
    </DemoShell>
  );
}
