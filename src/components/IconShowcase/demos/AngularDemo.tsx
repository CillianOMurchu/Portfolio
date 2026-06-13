import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";

const ANGULAR_ACCENT = "#dd1b16";

const ROUTES = [
  {
    path: "/home", label: "Home", icon: "⌂",
    content: () => (
      <div className="space-y-2">
        <p className="text-white font-semibold">Welcome, Cillian</p>
        <p className="text-gray-400 text-xs">This is the HomeComponent. It bootstrapped from AppModule.</p>
        <div className="flex gap-2 mt-2">
          {["Angular", "TypeScript", "RxJS"].map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(221,0,49,0.15)", color: ANGULAR_ACCENT }}>{t}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    path: "/dashboard", label: "Dashboard", icon: "▦",
    content: () => (
      <div className="space-y-2">
        <p className="text-white font-semibold">DashboardComponent</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[["Projects", "14"], ["Tests", "342"], ["Coverage", "87%"]].map(([k, v]) => (
            <div key={k} className="rounded p-2 text-center" style={{ background: "rgba(221,0,49,0.08)" }}>
              <p className="text-lg font-bold" style={{ color: ANGULAR_ACCENT }}>{v}</p>
              <p className="text-xs text-gray-500">{k}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    path: "/settings", label: "Settings", icon: "⚙",
    content: () => (
      <div className="space-y-2">
        <p className="text-white font-semibold">SettingsComponent</p>
        <div className="space-y-2 mt-1">
          {["Dark mode: true", "Notifications: false", "Debug: false"].map(s => (
            <div key={s} className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span style={{ color: ANGULAR_ACCENT }}>@Input()</span> {s}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function AngularDemo() {
  const [active, setActive] = useState(0);
  const route = ROUTES[active];

  return (
    <DemoShell>
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(221,0,49,0.25)" }}>
        <div className="flex" style={{ background: "#1a0008", borderBottom: "1px solid rgba(221,0,49,0.2)" }}>
          {ROUTES.map((r, i) => (
            <button key={r.path} onClick={() => setActive(i)}
              className="flex-1 py-2 text-xs font-medium transition-all"
              style={{ color: i === active ? ANGULAR_ACCENT : "#6b7280", borderBottom: i === active ? `2px solid ${ANGULAR_ACCENT}` : "2px solid transparent" }}>
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono" style={{ background: "#130005", borderBottom: "1px solid rgba(221,0,49,0.1)" }}>
          <span className="text-gray-600">router.navigate(</span>
          <span style={{ color: ANGULAR_ACCENT }}>'{route.path}'</span>
          <span className="text-gray-600">)</span>
        </div>

        <div className="p-4" style={{ background: "#0d0004", minHeight: 120 }}>
          <route.content />
        </div>
      </div>

      <CodePanel accent={ANGULAR_ACCENT} className="p-3 font-mono text-xs leading-5">
        <div className="text-gray-600">{"// app-routing.module.ts"}</div>
        {ROUTES.map((r) => (
          <div key={r.path}>
            <span className="text-gray-500">{"  { path: '"}</span>
            <span style={{ color: ANGULAR_ACCENT }}>{r.path.slice(1)}</span>
            <span className="text-gray-500">{"', component: "}</span>
            <span style={{ color: "#38bdf8" }}>{r.label}Component</span>
            <span className="text-gray-500">{" },"}</span>
          </div>
        ))}
      </CodePanel>
    </DemoShell>
  );
}
