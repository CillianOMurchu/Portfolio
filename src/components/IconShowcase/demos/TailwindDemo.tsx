import React, { useState } from "react";

interface Theme {
  name: string;
  bg: string;
  accent: string;
  border: string;
  badge: string;
  badgeText: string;
}

const THEMES: Theme[] = [
  {
    name: "Emerald",
    bg: "linear-gradient(135deg, #0a1a12, #0d2018)",
    accent: "#10b981",
    border: "rgba(16,185,129,0.3)",
    badge: "rgba(16,185,129,0.15)",
    badgeText: "#10b981",
  },
  {
    name: "Sky",
    bg: "linear-gradient(135deg, #0a101a, #0d1528)",
    accent: "#38bdf8",
    border: "rgba(56,189,248,0.3)",
    badge: "rgba(56,189,248,0.15)",
    badgeText: "#38bdf8",
  },
  {
    name: "Violet",
    bg: "linear-gradient(135deg, #130a1a, #1a0d28)",
    accent: "#a78bfa",
    border: "rgba(167,139,250,0.3)",
    badge: "rgba(167,139,250,0.15)",
    badgeText: "#a78bfa",
  },
  {
    name: "Amber",
    bg: "linear-gradient(135deg, #1a130a, #281a0d)",
    accent: "#f59e0b",
    border: "rgba(245,158,11,0.3)",
    badge: "rgba(245,158,11,0.15)",
    badgeText: "#f59e0b",
  },
];

const SKILLS = ["React", "TypeScript", "Node.js", "Tailwind"];

const TailwindDemo: React.FC = () => {
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <p className="text-xs text-gray-400 text-center">Switch themes on Cillian's profile card</p>

      <div
        className="rounded-xl p-5 transition-all duration-500"
        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ background: theme.badge, color: theme.accent, border: `2px solid ${theme.border}` }}
          >
            CÓM
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Cillian Ó Murchú</p>
            <p className="text-xs" style={{ color: theme.accent }}>Senior Frontend Developer</p>
          </div>
        </div>
        <p className="text-gray-400 text-xs mb-4 leading-relaxed">
          Building fast, accessible UIs across SaaS, hospitality & iGaming.
        </p>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span
              key={s}
              className="text-xs px-2 py-1 rounded-full transition-all duration-500"
              style={{ background: theme.badge, color: theme.badgeText, border: `1px solid ${theme.border}` }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {THEMES.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setThemeIdx(i)}
            className="w-8 h-8 rounded-full transition-all border-2"
            title={t.name}
            style={{
              background: t.accent,
              borderColor: i === themeIdx ? "#fff" : "transparent",
              transform: i === themeIdx ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>

      <p className="text-xs text-gray-600 text-center">
        Current theme: <span style={{ color: theme.accent }}>{theme.name}</span>
      </p>
    </div>
  );
};

export default TailwindDemo;
