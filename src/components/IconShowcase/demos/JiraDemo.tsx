import { useState } from "react";

interface Ticket {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  type: "story" | "bug" | "task";
  col: "todo" | "inprogress" | "done";
}

const PRIORITY_COLOR = { high: "#ef4444", medium: "#f59e0b", low: "#6b7280" };
const TYPE_ICON = { story: "📖", bug: "🐛", task: "✔" };

const INITIAL: Ticket[] = [
  { id: "PORT-12", title: "Add Showcase demos for all 22 icons", priority: "high", type: "story", col: "inprogress" },
  { id: "PORT-11", title: "Fix navbar border class mismatch", priority: "medium", type: "bug", col: "todo" },
  { id: "PORT-10", title: "Wire sphere icon click → context", priority: "high", type: "task", col: "done" },
  { id: "PORT-9", title: "Add Contact form submit handler", priority: "low", type: "task", col: "todo" },
  { id: "PORT-8", title: "Refactor HeroTitle button onClick", priority: "medium", type: "bug", col: "todo" },
  { id: "PORT-7", title: "Build sphere fade-out on click", priority: "high", type: "story", col: "done" },
];

const COLUMNS: { id: Ticket["col"]; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "#6b7280" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b" },
  { id: "done", label: "Done", color: "#10b981" },
];

export default function JiraDemo() {
  const [tickets, setTickets] = useState(INITIAL);

  const move = (id: string, dir: 1 | -1) => {
    setTickets((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const cols = COLUMNS.map(c => c.id);
      const idx = cols.indexOf(t.col);
      const next = cols[Math.max(0, Math.min(2, idx + dir))] as Ticket["col"];
      return { ...t, col: next };
    }));
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      <p className="text-xs text-gray-400 text-center">Click arrows to move tickets across the board</p>
      <div className="grid grid-cols-3 gap-2">
        {COLUMNS.map((col) => {
          const colTickets = tickets.filter((t) => t.col === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 pb-1" style={{ borderBottom: `2px solid ${col.color}44` }}>
                <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span className="text-xs text-gray-600 ml-auto">{colTickets.length}</span>
              </div>
              {colTickets.map((t) => {
                const colIdx = COLUMNS.findIndex(c => c.id === t.col);
                return (
                  <div key={t.id} className="rounded-lg p-2.5 flex flex-col gap-1.5 cursor-default"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{TYPE_ICON[t.type]}</span>
                      <span className="text-xs text-gray-500">{t.id}</span>
                      <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: PRIORITY_COLOR[t.priority] }} />
                    </div>
                    <p className="text-xs text-gray-300 leading-tight">{t.title}</p>
                    <div className="flex gap-1 mt-0.5">
                      {colIdx > 0 && (
                        <button onClick={() => move(t.id, -1)} className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(255,255,255,0.06)", color: "#6b7280" }}>←</button>
                      )}
                      {colIdx < 2 && (
                        <button onClick={() => move(t.id, 1)} className="text-xs px-1.5 py-0.5 rounded ml-auto"
                          style={{ background: "rgba(255,255,255,0.06)", color: "#6b7280" }}>→</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
