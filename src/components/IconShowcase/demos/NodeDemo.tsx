import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import { FAIL_COLOR, DARK_MUTED } from "./constants";

const NODE_ACCENT = "#68a063";

interface Line {
  type: "input" | "output" | "error";
  text: string;
}

const COMMANDS: Record<string, string[]> = {
  "cillian.buildPortfolio()": [
    "▶ Spinning up Vite dev server...",
    "▶ Bundling 847 modules...",
    "✓ Build complete in 1.2s",
    "✓ Deployed to cillianomurchu.vercel.app",
  ],
  "cillian.makeCoffee()": [
    "▶ Grinding beans (Colombian, medium roast)...",
    "▶ Heating water to 93°C...",
    "✓ Coffee ready. Productivity +25%",
  ],
  "cillian.listSkills()": [
    "→ React, TypeScript, Node.js, Angular",
    "→ Tailwind, Sass, MongoDB, Express",
    "→ Jest, Cypress, Storybook, Figma",
    "→ ...and 10 more (see sphere)",
  ],
  "cillian.checkEmails()": [
    "⚠ 47 unread",
    "⚠ 12 flagged",
    "✗ Operation cancelled by user. Stay outta my emails!",
  ],
};

const PROMPT = "node cillian.js";
const INIT: Line[] = [
  { type: "input", text: `$ ${PROMPT}` },
  { type: "output", text: "▶ Booting developer..." },
  { type: "output", text: "▶ Loading skills [■■■■■■■■■■] 100%" },
  { type: "output", text: "✓ Cillian ready. Call a method to continue." },
  { type: "output", text: "" },
];

const NodeDemo: React.FC = () => {
  const [lines, setLines] = useState<Line[]>(INIT);
  const [ran, setRan] = useState<Set<string>>(new Set());

  const run = (cmd: string) => {
    if (ran.has(cmd)) return;
    setRan((prev) => new Set(prev).add(cmd));
    const output = COMMANDS[cmd];
    setLines((prev) => [
      ...prev,
      { type: "input", text: `> ${cmd}` },
      ...output.map((t) => ({
        type: (t.startsWith("✗") ? "error" : "output") as Line["type"],
        text: t,
      })),
      { type: "output", text: "" },
    ]);
  };

  return (
    <DemoShell>
      <CodePanel accent={NODE_ACCENT} className="p-4 font-mono text-xs leading-5 min-h-[180px] max-h-[220px] overflow-y-auto">
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              color: l.type === "input" ? NODE_ACCENT : l.type === "error" ? FAIL_COLOR : "#c9d1d9",
            }}
          >
            {l.text || " "}
          </div>
        ))}
      </CodePanel>

      <p className="text-xs text-gray-500 text-center">Click a method to run it</p>

      <div className="grid grid-cols-2 gap-2">
        {Object.keys(COMMANDS).map((cmd) => (
          <button
            key={cmd}
            onClick={() => run(cmd)}
            disabled={ran.has(cmd)}
            className="rounded px-3 py-2 text-xs font-mono text-left transition-all truncate"
            style={{
              background: ran.has(cmd) ? "rgba(255,255,255,0.02)" : "rgba(104,160,99,0.1)",
              border: `1px solid ${ran.has(cmd) ? "rgba(255,255,255,0.05)" : "#68a06355"}`,
              color: ran.has(cmd) ? DARK_MUTED : NODE_ACCENT,
              cursor: ran.has(cmd) ? "default" : "pointer",
            }}
          >
            {cmd}
          </button>
        ))}
      </div>
    </DemoShell>
  );
};

export default NodeDemo;
