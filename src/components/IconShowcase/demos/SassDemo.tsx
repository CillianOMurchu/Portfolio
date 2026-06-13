import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";

const SASS_ACCENT = "#cc6699";

const PRESETS = [
  { name: "Emerald", primary: "#10b981", secondary: "#059669" },
  { name: "Sky", primary: "#38bdf8", secondary: "#0284c7" },
  { name: "Violet", primary: "#8b5cf6", secondary: "#6d28d9" },
  { name: "Rose", primary: "#f43f5e", secondary: "#be123c" },
];

export default function SassDemo() {
  const [preset, setPreset] = useState(0);
  const [radius, setRadius] = useState(8);
  const [fontSize, setFontSize] = useState(14);
  const { primary, secondary } = PRESETS[preset];

  const scss = `$primary: ${primary};
$secondary: ${secondary};
$radius: ${radius}px;
$font-size: ${fontSize}px;

.btn { background: $primary; border-radius: $radius; font-size: $font-size; }
.badge { background: rgba($primary, 0.2); color: $primary; }
.card { border-color: rgba($primary, 0.3); }`;

  return (
    <DemoShell className="gap-5">
      <p className="text-xs text-gray-400 text-center">Edit Sass variables and watch the cascade</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">$primary preset</p>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p, i) => (
              <button key={p.name} onClick={() => setPreset(i)} title={p.name}
                className="w-7 h-7 rounded-full border-2 transition-all"
                style={{ background: p.primary, borderColor: i === preset ? "#fff" : "transparent", transform: i === preset ? "scale(1.2)" : "scale(1)" }} />
            ))}
          </div>
          <p className="text-xs font-mono" style={{ color: primary }}>{primary}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500 uppercase tracking-wider">$radius: {radius}px</label>
          <input type="range" min={0} max={24} value={radius} onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full" style={{ accentColor: primary }} />
          <label className="text-xs text-gray-500 uppercase tracking-wider">$font-size: {fontSize}px</label>
          <input type="range" min={11} max={20} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full" style={{ accentColor: primary }} />
        </div>
      </div>

      <div className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-300"
        style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(${hexToRgb(primary)},0.3)`, borderRadius: radius }}>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white" style={{ fontSize }}>Cillian Ó Murchú</p>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-300"
            style={{ background: `${primary}33`, color: primary, borderRadius: radius / 2 }}>
            Available
          </span>
        </div>
        <p className="text-gray-400" style={{ fontSize: fontSize - 2 }}>Senior Frontend Developer</p>
        <button className="py-2 px-4 text-sm font-semibold text-white transition-all duration-300"
          style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})`, borderRadius: radius, fontSize }}>
          View Portfolio
        </button>
      </div>

      <CodePanel accent={SASS_ACCENT} className="p-3 font-mono text-xs leading-5 text-gray-400 whitespace-pre overflow-x-auto">
        {scss.split("\n").map((line, i) => (
          <div key={i} style={{ color: line.includes("$") ? SASS_ACCENT : line.startsWith(".") ? "#38bdf8" : "#9ca3af" }}>
            {line}
          </div>
        ))}
      </CodePanel>
    </DemoShell>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
