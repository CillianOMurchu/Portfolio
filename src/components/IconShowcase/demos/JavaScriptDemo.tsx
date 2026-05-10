import { useState } from "react";

interface Question {
  code: string;
  options: string[];
  answer: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  { code: '"5" + 3', options: ['"53"', "8", "TypeError", "NaN"], answer: '"53"', explanation: "The + operator coerces 3 to a string when one operand is already a string." },
  { code: 'typeof null', options: ['"null"', '"object"', '"undefined"', '"symbol"'], answer: '"object"', explanation: "A 27-year-old bug in JS. typeof null returns \"object\" — it's in the spec now." },
  { code: '0.1 + 0.2 === 0.3', options: ["false", "true", "undefined", "RangeError"], answer: "false", explanation: "Floating point arithmetic. 0.1 + 0.2 = 0.30000000000000004. Use Number.EPSILON to compare." },
  { code: '[] == false', options: ["true", "false", "TypeError", "undefined"], answer: "true", explanation: "[] coerces to 0, false coerces to 0. Abstract equality at its finest." },
  { code: '"" || "Cillian"', options: ['"Cillian"', '""', "true", "false"], answer: '"Cillian"', explanation: 'Empty string is falsy — || returns the first truthy value, which is "Cillian".' },
];

export default function JavaScriptDemo() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];
  const correct = selected === q.answer;

  const pick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) { setDone(true); return; }
    setIdx((i) => i + 1);
    setSelected(null);
  };

  const reset = () => { setIdx(0); setSelected(null); setScore(0); setDone(false); };

  if (done) return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-4xl font-bold" style={{ color: score >= 4 ? "#f7df1e" : "#f59e0b" }}>{score}/{QUESTIONS.length}</p>
      <p className="text-gray-400 text-sm">
        {score === 5 ? "You've clearly read the spec. Or suffered enough." : score >= 3 ? "Solid. JS quirks are a survival skill." : "That's fine. Linters exist for a reason."}
      </p>
      <button onClick={reset} className="text-xs px-4 py-2 rounded" style={{ background: "rgba(247,223,30,0.1)", border: "1px solid rgba(247,223,30,0.3)", color: "#f7df1e" }}>
        Try again
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Question {idx + 1} / {QUESTIONS.length}</span>
        <span style={{ color: "#f7df1e" }}>Score: {score}</span>
      </div>

      <div className="rounded-lg px-4 py-3 font-mono text-center" style={{ background: "#0d1117", border: "1px solid rgba(247,223,30,0.25)" }}>
        <span className="text-gray-500">{">"} </span>
        <span style={{ color: "#f7df1e" }}>{q.code}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt) => {
          const isPicked = selected === opt;
          const isRight = opt === q.answer;
          let bg = "rgba(255,255,255,0.03)";
          let border = "rgba(255,255,255,0.08)";
          let color = "#d1d5db";
          if (selected) {
            if (isRight) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#10b981"; }
            else if (isPicked) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; color = "#ef4444"; }
          }
          return (
            <button key={opt} onClick={() => pick(opt)} className="rounded-lg py-3 text-sm font-mono transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color, cursor: selected ? "default" : "pointer" }}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-lg px-4 py-3 text-xs text-gray-400 leading-relaxed" style={{ background: "rgba(247,223,30,0.05)", border: "1px solid rgba(247,223,30,0.15)" }}>
          {correct ? "✓ Correct. " : "✗ Wrong. "}{q.explanation}
        </div>
      )}

      {selected && (
        <button onClick={next} className="rounded-lg py-2 text-sm transition-all"
          style={{ background: "rgba(247,223,30,0.1)", border: "1px solid rgba(247,223,30,0.3)", color: "#f7df1e" }}>
          {idx + 1 < QUESTIONS.length ? "Next →" : "See results"}
        </button>
      )}
    </div>
  );
}
