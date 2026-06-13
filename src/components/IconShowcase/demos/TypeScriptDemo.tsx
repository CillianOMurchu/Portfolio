import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import { PASS_COLOR, FAIL_COLOR, WARN_COLOR, DARK_MUTED } from "./constants";

const TS_ACCENT = "#3178c6";

interface Field {
  key: string;
  value: string;
  correct: string;
  options: string[];
}

const FIELDS: Field[] = [
  { key: "name", value: '"Cillian Ó Murchú"', correct: "string", options: ["string", "number", "boolean", "any"] },
  { key: "yearsExperience", value: "6", correct: "number", options: ["string", "number", "Date", "any"] },
  { key: "isAvailableForWork", value: "true", correct: "boolean", options: ["string", "number", "boolean", "null"] },
  { key: "skills", value: '["React", "TypeScript", ...]', correct: "string[]", options: ["string[]", "string", "object", "any"] },
];

const TypeScriptDemo: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = FIELDS.every((f) => answers[f.key]);
  const score = submitted
    ? FIELDS.filter((f) => answers[f.key] === f.correct).length
    : 0;

  const statusColor = (field: Field) => {
    if (!submitted) return TS_ACCENT;
    return answers[field.key] === field.correct ? PASS_COLOR : FAIL_COLOR;
  };

  return (
    <DemoShell>
      <p className="text-xs text-gray-400 text-center">
        Fill in the correct TypeScript types for Cillian's profile object
      </p>

      <CodePanel accent={TS_ACCENT}>
        <div className="text-blue-400 mb-1">const cillian: &#123;</div>
        {FIELDS.map((field) => (
          <div key={field.key} className="flex items-center gap-2 ml-4 mb-2 min-w-0 overflow-hidden">
            <span style={{ color: "#9cdcfe" }}>{field.key}</span>
            <span className="text-gray-500">:</span>
            <select
              disabled={submitted}
              value={answers[field.key] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [field.key]: e.target.value }))}
              className="rounded px-2 py-0.5 text-xs font-mono outline-none"
              style={{
                background: "#161b22",
                border: `1px solid ${statusColor(field)}55`,
                color: statusColor(field),
              }}
            >
              <option value="">pick type</option>
              {field.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <span className="text-gray-500">{"// "}</span>
            <span className="text-gray-600 text-xs truncate min-w-0">{field.value}</span>
            {submitted && (
              <span style={{ color: answers[field.key] === field.correct ? PASS_COLOR : FAIL_COLOR }}>
                {answers[field.key] === field.correct ? "✓" : `✗ (${field.correct})`}
              </span>
            )}
          </div>
        ))}
        <div className="text-blue-400">&#125; = cillian</div>
      </CodePanel>

      {!submitted ? (
        <button
          disabled={!allAnswered}
          onClick={() => setSubmitted(true)}
          className="rounded-lg py-2 text-sm font-semibold transition-all"
          style={{
            background: allAnswered ? "rgba(49,120,198,0.2)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${allAnswered ? TS_ACCENT : "rgba(255,255,255,0.08)"}`,
            color: allAnswered ? TS_ACCENT : DARK_MUTED,
            cursor: allAnswered ? "pointer" : "default",
          }}
        >
          tsc --check
        </button>
      ) : (
        <div className="text-center">
          <p
            className="text-lg font-bold"
            style={{ color: score === FIELDS.length ? PASS_COLOR : score >= 2 ? WARN_COLOR : FAIL_COLOR }}
          >
            {score}/{FIELDS.length} correct
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {score === FIELDS.length
              ? "Zero type errors. TypeScript approves."
              : score >= 2
                ? "A few type errors. The compiler is disappointed."
                : "Many type errors. Please use any sparingly."}
          </p>
          <button
            onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 text-xs text-blue-400 underline"
          >
            reset
          </button>
        </div>
      )}
    </DemoShell>
  );
};

export default TypeScriptDemo;
