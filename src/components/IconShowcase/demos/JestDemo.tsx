import React, { useState } from "react";

interface TestCase {
  description: string;
  passes: boolean;
  duration: string;
  note?: string;
}

const ALL_TESTS: TestCase[] = [
  { description: "writes clean, readable code", passes: true, duration: "4ms" },
  { description: "ships features on time", passes: true, duration: "8ms" },
  { description: "leaves helpful PR reviews", passes: true, duration: "12ms" },
  { description: "types everything correctly", passes: true, duration: "6ms" },
  { description: "writes documentation", passes: false, duration: "30000ms", note: "timeout" },
  { description: "closes browser tabs", passes: false, duration: "7ms", note: "heap out of memory (247 tabs)" },
  { description: "takes a proper lunch break", passes: false, duration: "11ms", note: "still coding" },
  { description: "reads Slack notifications immediately", passes: false, duration: "9ms", note: "expected: <9am, received: when convenient" },
];

const SUITE = "describe('Cillian', () => {";

const JestDemo: React.FC = () => {
  const [revealed, setRevealed] = useState(4);
  const visible = ALL_TESTS.slice(0, revealed);
  const passing = visible.filter((t) => t.passes).length;
  const failing = visible.filter((t) => !t.passes).length;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      <div
        className="rounded-lg p-4 font-mono text-xs leading-6"
        style={{ background: "#0d1117", border: "1px solid rgba(194,19,37,0.3)" }}
      >
        <p className="text-gray-500 mb-3">{SUITE}</p>

        {visible.map((t, i) => (
          <div key={i} className="flex items-start gap-2 ml-4 mb-1">
            <span style={{ color: t.passes ? "#10b981" : "#ef4444", flexShrink: 0 }}>
              {t.passes ? "✓" : "✗"}
            </span>
            <span style={{ color: t.passes ? "#9ca3af" : "#f87171" }}>
              {t.description}
            </span>
            <span className="ml-auto text-gray-600 text-xs shrink-0">
              ({t.duration})
            </span>
          </div>
        ))}
        {visible.filter((t) => !t.passes).map((t, i) => (
          t.note && (
            <div key={`note-${i}`} className="ml-4 mb-1" style={{ color: "#ef4444" }}>
              <span className="text-gray-600">{"  ● "}</span>{t.note}
            </div>
          )
        ))}

        <p className="text-gray-500 mt-3">{"}"}</p>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="flex gap-4 text-sm font-mono">
          <span style={{ color: "#10b981" }}>{passing} passing</span>
          {failing > 0 && <span style={{ color: "#ef4444" }}>{failing} failing</span>}
        </div>
        {revealed < ALL_TESTS.length && (
          <button
            onClick={() => setRevealed((r) => Math.min(r + 2, ALL_TESTS.length))}
            className="text-xs px-3 py-1 rounded transition-all"
            style={{
              background: "rgba(194,19,37,0.1)",
              border: "1px solid rgba(194,19,37,0.3)",
              color: "#c21325",
            }}
          >
            run more tests
          </button>
        )}
      </div>
    </div>
  );
};

export default JestDemo;
