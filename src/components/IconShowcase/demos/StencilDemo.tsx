import { useState } from "react";

type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const SIZE_STYLES: Record<Size, { px: string; py: string; text: string; icon: string }> = {
  sm: { px: "12px", py: "6px", text: "12px", icon: "24px" },
  md: { px: "18px", py: "10px", text: "14px", icon: "32px" },
  lg: { px: "24px", py: "14px", text: "16px", icon: "40px" },
};

export default function StencilDemo() {
  const [variant, setVariant] = useState<Variant>("solid");
  const [size, setSize] = useState<Size>("md");
  const [glow, setGlow] = useState(true);
  const [label, setLabel] = useState("Cillian");
  const [color, setColor] = useState("#4c50bf");

  const s = SIZE_STYLES[size];

  const previewStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: `${s.py} ${s.px}`,
    borderRadius: 8,
    fontSize: s.text,
    fontWeight: 600,
    transition: "all 0.2s",
    boxShadow: glow ? `0 0 12px ${color}66, 0 0 24px ${color}33` : "none",
    ...(variant === "solid"
      ? { background: color, color: "#fff", border: "2px solid transparent" }
      : variant === "outline"
      ? { background: "transparent", color, border: `2px solid ${color}` }
      : { background: `${color}18`, color, border: `2px solid transparent` }),
  };

  const html = `<cillian-badge
  variant="${variant}"
  size="${size}"
  color="${color}"${glow ? "\n  glow" : ""}
>
  ${label}
</cillian-badge>`;

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto">
      <div className="flex justify-center py-6 rounded-xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(76,80,191,0.2)" }}>
        <div style={previewStyle}>
          <div style={{ width: s.icon, height: s.icon, borderRadius: 6, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
          {label || "Badge"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">variant</p>
          <div className="flex gap-1">
            {(["solid", "outline", "ghost"] as Variant[]).map(v => (
              <button key={v} onClick={() => setVariant(v)} className="flex-1 py-1 rounded text-xs transition-all"
                style={{ background: variant === v ? "rgba(76,80,191,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${variant === v ? "#4c50bf" : "rgba(255,255,255,0.08)"}`, color: variant === v ? "#a5b4fc" : "#6b7280" }}>
                {v}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">size</p>
          <div className="flex gap-1">
            {(["sm", "md", "lg"] as Size[]).map(s => (
              <button key={s} onClick={() => setSize(s)} className="flex-1 py-1 rounded text-xs transition-all"
                style={{ background: size === s ? "rgba(76,80,191,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${size === s ? "#4c50bf" : "rgba(255,255,255,0.08)"}`, color: size === s ? "#a5b4fc" : "#6b7280" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider">color</p>
          <div className="flex gap-1.5 flex-wrap">
            {["#4c50bf", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#38bdf8"].map(c => (
              <button key={c} onClick={() => setColor(c)} className="w-6 h-6 rounded-full border-2 transition-all"
                style={{ background: c, borderColor: color === c ? "#fff" : "transparent", transform: color === c ? "scale(1.2)" : "scale(1)" }} />
            ))}
          </div>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={glow} onChange={e => setGlow(e.target.checked)} style={{ accentColor: "#4c50bf" }} />
            <span className="text-xs text-gray-400">glow attribute</span>
          </label>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">label</p>
          <input value={label} onChange={e => setLabel(e.target.value)} maxLength={16}
            className="rounded px-2 py-1.5 text-xs font-mono outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e5e7eb" }} />
        </div>
      </div>

      <pre className="rounded-lg p-3 text-xs font-mono text-gray-400 leading-5" style={{ background: "#0d1117", border: "1px solid rgba(76,80,191,0.2)" }}>
        {html}
      </pre>
    </div>
  );
}
