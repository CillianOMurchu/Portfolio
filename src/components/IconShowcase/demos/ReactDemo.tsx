import React, { useState } from "react";

interface Toggle {
  id: string;
  label: string;
  emoji: string;
  boostPct: number;
}

const TOGGLES: Toggle[] = [
  { id: "coffee", label: "Coffee loaded", emoji: "☕", boostPct: 25 },
  { id: "dark", label: "Dark mode", emoji: "🌑", boostPct: 10 },
  { id: "headphones", label: "Headphones on", emoji: "🎧", boostPct: 30 },
  { id: "vscode", label: "VS Code open", emoji: "💻", boostPct: 20 },
  { id: "slack", label: "Slack closed", emoji: "🔕", boostPct: 15 },
];

const BASE = 40;

const ReactDemo: React.FC = () => {
  const [active, setActive] = useState<Set<string>>(new Set(["coffee", "vscode"]));

  const toggle = (id: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const productivity = Math.min(
    100,
    BASE + TOGGLES.filter((t) => active.has(t.id)).reduce((sum, t) => sum + t.boostPct, 0),
  );

  const bar = (pct: number) =>
    pct >= 90 ? "#4cffc1" : pct >= 70 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto">
      <p className="text-gray-400 text-sm text-center">
        Toggle Cillian's current conditions to calculate developer output
      </p>

      <div className="flex flex-col gap-3">
        {TOGGLES.map((t) => {
          const on = active.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className="flex items-center justify-between rounded-lg px-4 py-3 transition-all text-left"
              style={{
                background: on ? "rgba(97,218,251,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${on ? "#61dafb55" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <span className="flex items-center gap-3 text-sm text-gray-200">
                <span>{t.emoji}</span>
                {t.label}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: on ? "#61dafb" : "#6b7280" }}
              >
                {on ? `+${t.boostPct}%` : "off"}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-lg p-4 border"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Productivity</span>
          <span className="text-lg font-bold" style={{ color: bar(productivity) }}>
            {productivity}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${productivity}%`, background: bar(productivity) }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {productivity >= 90
            ? "In the zone. Do not disturb."
            : productivity >= 70
              ? "Productive. Getting things done."
              : productivity >= 50
                ? "Getting there. Needs coffee."
                : "Standby mode. Please wait."}
        </p>
      </div>
    </div>
  );
};

export default ReactDemo;
