import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import { PASS_COLOR, FAIL_COLOR } from "./constants";

const JEST_ACCENT = "#c21325";

interface TestCase {
  description: string;
  passes: boolean;
  duration: string;
  note?: string;
}

const ALL_TESTS: TestCase[] = [
  {
    description: "Ships pixel-perfect UI from a Figma file",
    passes: true,
    duration: "6ms",
  },
  { description: "Successful failure", passes: true, duration: "2ms" },
  { description: "Being aware", passes: true, duration: "8ms" },
  { description: "More leg days", passes: false, duration: "3ms" },
  {
    description:
      "Should start writing TypeScript that reads like documentation and stop annoying people about documentation",
    passes: false,
    duration: "4ms",
  },
  {
    description: "Picks the right color palette from memory",
    passes: true,
    duration: "5ms",
  },
  { description: "Uses dark mode", passes: true, duration: "1ms" },
  {
    description: "Stops at one coffee",
    passes: false,
    duration: "∞ms",
    note: "RangeError: maximum caffeine capacity exceeded",
  },
];

const SUITE = "describe('Cillian', () => {";

const JestDemo: React.FC = () => {
  const [revealed, setRevealed] = useState(4);
  const visible = ALL_TESTS.slice(0, revealed);
  const passing = visible.filter((t) => t.passes).length;
  const failing = visible.filter((t) => !t.passes).length;

  return (
    <DemoShell>
      <CodePanel accent={JEST_ACCENT} className="p-4 font-mono text-xs leading-6">
        <p className="text-gray-500 mb-3">{SUITE}</p>

        {visible.map((t, i) => (
          <div key={i} className="flex items-start gap-2 ml-4 mb-1">
            <span
              style={{ color: t.passes ? PASS_COLOR : FAIL_COLOR, flexShrink: 0 }}
            >
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
        {visible
          .filter((t) => !t.passes)
          .map(
            (t, i) =>
              t.note && (
                <div
                  key={`note-${i}`}
                  className="ml-4 mb-1"
                  style={{ color: FAIL_COLOR }}
                >
                  <span className="text-gray-600">{"  ● "}</span>
                  {t.note}
                </div>
              ),
          )}

        <p className="text-gray-500 mt-3">{"}"}</p>
      </CodePanel>

      <div className="flex items-center justify-between px-1">
        <div className="flex gap-4 text-sm font-mono">
          <span style={{ color: PASS_COLOR }}>{passing} passing</span>
          {failing > 0 && (
            <span style={{ color: FAIL_COLOR }}>{failing} failing</span>
          )}
        </div>
        {revealed < ALL_TESTS.length && (
          <button
            onClick={() =>
              setRevealed((r) => Math.min(r + 2, ALL_TESTS.length))
            }
            className="text-xs px-3 py-1 rounded transition-all"
            style={{
              background: "rgba(194,19,37,0.1)",
              border: "1px solid rgba(194,19,37,0.3)",
              color: JEST_ACCENT,
            }}
          >
            run more tests
          </button>
        )}
      </div>
    </DemoShell>
  );
};

export default JestDemo;
