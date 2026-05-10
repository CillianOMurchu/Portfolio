import { useState } from "react";

interface Story { id: string; label: string; args: Record<string, unknown>; }
interface Component { name: string; stories: Story[]; }

const COMPONENTS: Component[] = [
  {
    name: "Button",
    stories: [
      { id: "primary", label: "Primary", args: { variant: "primary", label: "View Portfolio", disabled: false } },
      { id: "secondary", label: "Secondary", args: { variant: "secondary", label: "Download CV", disabled: false } },
      { id: "loading", label: "Loading", args: { variant: "primary", label: "Saving…", loading: true } },
      { id: "disabled", label: "Disabled", args: { variant: "primary", label: "Unavailable", disabled: true } },
    ],
  },
  {
    name: "Badge",
    stories: [
      { id: "available", label: "Available", args: { label: "Available for work", color: "#10b981" } },
      { id: "busy", label: "Busy", args: { label: "Deep in flow state", color: "#f59e0b" } },
      { id: "offline", label: "Offline", args: { label: "Probably sleeping", color: "#6b7280" } },
    ],
  },
  {
    name: "Card",
    stories: [
      { id: "default", label: "Default", args: { title: "Cillian Ó Murchú", subtitle: "Senior Frontend Dev", accent: "#10b981" } },
      { id: "featured", label: "Featured", args: { title: "Portfolio Project", subtitle: "React + TypeScript", accent: "#61dafb" } },
    ],
  },
];

function ButtonPreview({ args }: { args: Record<string, unknown> }) {
  const base = "px-4 py-2 rounded text-sm font-semibold transition-all";
  if (args.variant === "primary") return <button disabled={!!args.disabled || !!args.loading} className={base} style={{ background: "#10b981", color: "#fff", opacity: args.disabled ? 0.4 : 1 }}>{String(args.label)}</button>;
  return <button disabled={!!args.disabled} className={base} style={{ border: "1px solid #10b981", color: "#10b981", background: "transparent", opacity: args.disabled ? 0.4 : 1 }}>{String(args.label)}</button>;
}
function BadgePreview({ args }: { args: Record<string, unknown> }) {
  return <span className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: `${args.color as string}22`, border: `1px solid ${args.color as string}55`, color: args.color as string }}>{String(args.label)}</span>;
}
function CardPreview({ args }: { args: Record<string, unknown> }) {
  return <div className="rounded-xl p-4 w-48" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${args.accent as string}33` }}><p className="font-semibold text-white text-sm">{String(args.title)}</p><p className="text-xs mt-1" style={{ color: args.accent as string }}>{String(args.subtitle)}</p></div>;
}

export default function StorybookDemo() {
  const [compIdx, setCompIdx] = useState(0);
  const [storyId, setStoryId] = useState("primary");
  const comp = COMPONENTS[compIdx];
  const story = comp.stories.find(s => s.id === storyId) ?? comp.stories[0];

  const Preview = comp.name === "Button" ? ButtonPreview : comp.name === "Badge" ? BadgePreview : CardPreview;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,71,133,0.2)" }}>
        <div className="grid grid-cols-[140px_1fr]" style={{ minHeight: 240 }}>
          <div className="flex flex-col" style={{ borderRight: "1px solid rgba(255,255,255,0.07)", background: "#0d1117" }}>
            <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Stories</div>
            {COMPONENTS.map((c, i) => (
              <div key={c.name}>
                <button onClick={() => { setCompIdx(i); setStoryId(c.stories[0].id); }} className="w-full text-left px-3 py-1.5 text-xs transition-all"
                  style={{ color: i === compIdx ? "#ff4785" : "#9ca3af", background: i === compIdx ? "rgba(255,71,133,0.08)" : "transparent" }}>
                  {i === compIdx ? "▾" : "▸"} {c.name}
                </button>
                {i === compIdx && c.stories.map(s => (
                  <button key={s.id} onClick={() => setStoryId(s.id)} className="w-full text-left pl-6 pr-3 py-1 text-xs transition-all"
                    style={{ color: s.id === storyId ? "#ff4785" : "#6b7280", background: s.id === storyId ? "rgba(255,71,133,0.06)" : "transparent" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-center flex-1 p-6" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Preview args={story.args} />
            </div>
            <div className="p-3 font-mono text-xs" style={{ background: "#0d1117" }}>
              <p className="text-gray-600 mb-1">Args</p>
              {Object.entries(story.args).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-purple-400">{k}</span>
                  <span className="text-gray-600">:</span>
                  <span style={{ color: typeof v === "boolean" ? "#10b981" : typeof v === "string" ? "#f59e0b" : "#61dafb" }}>{JSON.stringify(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
