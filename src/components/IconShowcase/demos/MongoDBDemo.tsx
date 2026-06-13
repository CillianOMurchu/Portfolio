import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";

const MONGODB_ACCENT = "#47a248";

const DOCS = [
  { _id: "a1b2", name: "Portfolio", stack: ["React", "TypeScript", "Tailwind"], year: 2024, status: "live" },
  { _id: "c3d4", name: "iGaming Platform", stack: ["Angular", "RxJS", "Node.js"], year: 2022, status: "deployed" },
  { _id: "e5f6", name: "Booking System", stack: ["React", "Express", "MongoDB"], year: 2021, status: "deployed" },
  { _id: "g7h8", name: "Analytics Dashboard", stack: ["Angular", "TypeScript", "Firebase"], year: 2023, status: "live" },
  { _id: "i9j0", name: "Component Library", stack: ["StencilJS", "Sass", "Storybook"], year: 2023, status: "live" },
];

const FILTERS = ["React", "Angular", "TypeScript", "Node.js"];

export default function MongoDBDemo() {
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = filter ? DOCS.filter((d) => d.stack.includes(filter)) : DOCS;

  const query = filter
    ? `db.projects.find({ stack: { $in: ["${filter}"] } })`
    : `db.projects.find({})`;

  return (
    <DemoShell>
      <CodePanel accent={MONGODB_ACCENT} className="px-3 py-2 font-mono text-xs" >
        <span className="text-gray-600" style={{ color: MONGODB_ACCENT }}>
          <span className="text-gray-600">{">"} </span>{query}
          <span className="text-gray-600"> // {visible.length} document{visible.length !== 1 ? "s" : ""}</span>
        </span>
      </CodePanel>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(filter === f ? null : f)}
            className="text-xs px-3 py-1 rounded-full transition-all"
            style={{
              background: filter === f ? "rgba(71,162,72,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f ? MONGODB_ACCENT : "rgba(255,255,255,0.1)"}`,
              color: filter === f ? MONGODB_ACCENT : "#9ca3af",
            }}>
            {filter === f ? "✓ " : ""}{f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {visible.map((doc) => (
          <button key={doc._id} onClick={() => setExpanded(expanded === doc._id ? null : doc._id)}
            className="rounded-lg p-3 text-left transition-all w-full"
            style={{ background: "rgba(71,162,72,0.05)", border: `1px solid ${expanded === doc._id ? MONGODB_ACCENT : "rgba(71,162,72,0.15)"}` }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">{doc.name}</span>
              <span className="text-xs" style={{ color: MONGODB_ACCENT }}>{doc.year}</span>
            </div>
            {expanded === doc._id ? (
              <pre className="mt-2 text-xs font-mono text-gray-400 whitespace-pre-wrap text-left">
{JSON.stringify(doc, null, 2)}
              </pre>
            ) : (
              <div className="flex gap-1 mt-1 flex-wrap">
                {doc.stack.map((s) => (
                  <span key={s} className="text-xs px-1.5 py-0.5 rounded text-gray-500"
                    style={{ background: "rgba(255,255,255,0.05)", color: filter === s ? MONGODB_ACCENT : "#9ca3af" }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
        {visible.length === 0 && <p className="text-center text-gray-600 text-sm py-4">No documents match</p>}
      </div>
    </DemoShell>
  );
}
