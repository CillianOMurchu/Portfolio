import { useState } from "react";
import DemoShell from "./components/DemoShell";
import { FAIL_COLOR, WARN_COLOR, MUTED_COLOR } from "./constants";

const PASS_COLOR_JIRA = "#10b981";

interface Ticket {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  type: "story" | "bug" | "task";
  col: "todo" | "inprogress" | "done";
}

const PRIORITY_COLOR = { high: FAIL_COLOR, medium: WARN_COLOR, low: MUTED_COLOR };
const TYPE_ICON = { story: "📖", bug: "🐛", task: "✔" };

const INITIAL: Ticket[] = [
  {
    id: "COM-412",
    title: "Add Playwright coverage for Awesome Hero Title component",
    priority: "high",
    type: "story",
    col: "inprogress",
  },
  {
    id: "COM-411",
    title: "SSR flicker on initial load",
    priority: "medium",
    type: "bug",
    col: "todo",
  },
  {
    id: "COM-410",
    title: "Increase page speed",
    priority: "high",
    type: "task",
    col: "done",
  },
  {
    id: "COM-409",
    title: "Play with DeBuggerALot and set up monitoring",
    priority: "low",
    type: "task",
    col: "todo",
  },
  {
    id: "COM-408",
    title: "Something of medium importance that needs to be done but not urgently and it fell on you for the craic",
    priority: "medium",
    type: "bug",
    col: "todo",
  },
  {
    id: "COM-407",
    title: "Migrate something old into something new and better",
    priority: "high",
    type: "story",
    col: "done",
  },
];

const COLUMNS: { id: Ticket["col"]; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: MUTED_COLOR },
  { id: "inprogress", label: "In Progress", color: WARN_COLOR },
  { id: "done", label: "Done", color: PASS_COLOR_JIRA },
];

export default function JiraDemo() {
  const [tickets, setTickets] = useState(INITIAL);

  const move = (id: string, dir: 1 | -1) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const cols = COLUMNS.map((c) => c.id);
        const idx = cols.indexOf(t.col);
        const next = cols[Math.max(0, Math.min(2, idx + dir))] as Ticket["col"];
        return { ...t, col: next };
      }),
    );
  };

  return (
    <DemoShell className="gap-3">
      <p className="text-xs text-gray-400 text-center">
        Click arrows to move tickets across the board
      </p>
      <div className="grid grid-cols-3 gap-2">
        {COLUMNS.map((col) => {
          const colTickets = tickets.filter((t) => t.col === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-2">
              <div
                className="flex items-center gap-1.5 pb-1"
                style={{ borderBottom: `2px solid ${col.color}44` }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: col.color }}
                >
                  {col.label}
                </span>
                <span className="text-xs text-gray-600 ml-auto">
                  {colTickets.length}
                </span>
              </div>
              {colTickets.map((t) => {
                const colIdx = COLUMNS.findIndex((c) => c.id === t.col);
                return (
                  <div
                    key={t.id}
                    className="rounded-lg p-2.5 flex flex-col gap-1.5 cursor-default"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{TYPE_ICON[t.type]}</span>
                      <span className="text-xs text-gray-500">{t.id}</span>
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: PRIORITY_COLOR[t.priority] }}
                      />
                    </div>
                    <p className="text-xs text-gray-300 leading-tight line-clamp-2">
                      {t.title}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      {colIdx > 0 && (
                        <button
                          onClick={() => move(t.id, -1)}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: MUTED_COLOR,
                          }}
                        >
                          ←
                        </button>
                      )}
                      {colIdx < 2 && (
                        <button
                          onClick={() => move(t.id, 1)}
                          className="text-xs px-1.5 py-0.5 rounded ml-auto"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: MUTED_COLOR,
                          }}
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </DemoShell>
  );
}
