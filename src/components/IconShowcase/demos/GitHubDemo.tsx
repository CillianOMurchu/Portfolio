import { useState } from "react";
import DemoShell from "./components/DemoShell";
import { PASS_COLOR, FAIL_COLOR, WARN_COLOR } from "./constants";

const COMMITS = [
  { hash: "4a9f2c1", msg: "feat: icon click → showcase overlay with demos", branch: "main", ago: "2h ago", additions: 847, deletions: 12 },
  { hash: "de45ca7", msg: "add stencil icon to sphere", branch: "main", ago: "1d ago", additions: 3, deletions: 0 },
  { hash: "a02272c", msg: "refactor: extract perspective projection as projectToScreen", branch: "main", ago: "3d ago", additions: 24, deletions: 19 },
  { hash: "45ee08e", msg: "refactor: name magic spring animation constants", branch: "main", ago: "3d ago", additions: 8, deletions: 4 },
  { hash: "ab31cc5", msg: "refactor: move static styles to CSS, simplify button render", branch: "main", ago: "5d ago", additions: 31, deletions: 47 },
];

const MILESTONES = [
  { label: "First commit", col: 2, row: 3, color: PASS_COLOR },
  { label: "Launched portfolio", col: 18, row: 1, color: "#61dafb" },
  { label: "Added sphere", col: 30, row: 4, color: "#8b5cf6" },
  { label: "Click showcase", col: 47, row: 2, color: WARN_COLOR },
];

function buildGrid() {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(52).fill(0));
  for (let c = 0; c < 52; c++) {
    for (let r = 0; r < 7; r++) {
      grid[r][c] = Math.random() > 0.6 ? Math.ceil(Math.random() * 4) : 0;
    }
  }
  MILESTONES.forEach((m) => { grid[m.row][m.col] = 5; });
  return grid;
}

const GRID = buildGrid();

const LEVEL_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353", WARN_COLOR];

export default function GitHubDemo() {
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(null);
  const [selectedCommit, setSelectedCommit] = useState<number | null>(null);

  const milestone = hovered
    ? MILESTONES.find((m) => m.col === hovered.col && m.row === hovered.row)
    : null;

  return (
    <DemoShell>
      <div className="rounded-lg p-3 overflow-x-auto" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-xs text-gray-500 mb-2">Contribution graph — hover the glowing cells</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 52 }, (_, col) => (
            <div key={col} className="flex flex-col gap-0.5">
              {GRID.map((row, r) => {
                const level = row[col];
                const ms = MILESTONES.find((m) => m.col === col && m.row === r);
                return (
                  <div key={r} onMouseEnter={() => setHovered({ col, row: r })} onMouseLeave={() => setHovered(null)}
                    className="rounded-sm transition-all"
                    style={{
                      width: 9, height: 9,
                      background: ms ? ms.color : LEVEL_COLORS[Math.min(level, 5)],
                      boxShadow: ms ? `0 0 6px ${ms.color}` : "none",
                      cursor: ms ? "pointer" : "default",
                    }} />
                );
              })}
            </div>
          ))}
        </div>
        {milestone && (
          <p className="text-xs mt-2" style={{ color: milestone.color }}>★ {milestone.label}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {COMMITS.map((c, i) => (
          <button key={c.hash} onClick={() => setSelectedCommit(selectedCommit === i ? null : i)}
            className="rounded-lg px-3 py-2 text-left transition-all w-full"
            style={{ background: selectedCommit === i ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${selectedCommit === i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}` }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: PASS_COLOR }}>{c.hash}</span>
              <span className="text-xs text-gray-300 flex-1 truncate">{c.msg}</span>
              <span className="text-xs text-gray-600 shrink-0">{c.ago}</span>
            </div>
            {selectedCommit === i && (
              <div className="flex gap-3 mt-1.5 text-xs font-mono">
                <span style={{ color: PASS_COLOR }}>+{c.additions}</span>
                <span style={{ color: FAIL_COLOR }}>-{c.deletions}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </DemoShell>
  );
}
