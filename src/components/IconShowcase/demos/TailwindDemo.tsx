import { useState } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import { MUTED_COLOR } from "./constants";

const TAILWIND_ACCENT = "#38bdf8";

interface ClassToggle {
  cls: string;
  label: string;
  default: boolean;
}

const TOGGLES: ClassToggle[] = [
  { cls: "rounded-2xl", label: "rounded-2xl", default: true },
  { cls: "shadow-xl", label: "shadow-xl", default: true },
  { cls: "border", label: "border", default: false },
  { cls: "ring-2", label: "ring-2 ring-emerald-400", default: false },
  { cls: "scale-105", label: "scale-105", default: false },
  { cls: "backdrop-blur-sm", label: "backdrop-blur-sm", default: false },
  { cls: "opacity-75", label: "opacity-75", default: false },
  { cls: "rotate-1", label: "rotate-1", default: false },
];

export default function TailwindDemo() {
  const [active, setActive] = useState<Set<string>>(
    new Set(TOGGLES.filter((t) => t.default).map((t) => t.cls))
  );

  const toggle = (cls: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(cls) ? next.delete(cls) : next.add(cls);
      return next;
    });

  const classStr = [...active].join(" ");

  const cardClass = [
    ...active,
    "p-6 transition-all duration-300",
  ].join(" ");

  return (
    <DemoShell className="gap-5">
      <p className="text-xs text-gray-400 text-center">
        Toggle utilities and watch the card update in real time
      </p>

      <div className="flex justify-center py-4">
        <div
          className={cardClass}
          style={{
            background: active.has("backdrop-blur-sm")
              ? "rgba(56,189,248,0.08)"
              : "rgba(56,189,248,0.12)",
            borderColor: "rgba(56,189,248,0.3)",
            outline: active.has("ring-2") ? "2px solid #34d399" : undefined,
            width: 200,
          }}
        >
          <p className="text-sm font-semibold text-white">Cillian.tsx</p>
          <p className="text-xs text-gray-400 mt-1">Senior Frontend Dev</p>
          <span
            className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(56,189,248,0.2)", color: TAILWIND_ACCENT }}
          >
            Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TOGGLES.map((t) => {
          const on = active.has(t.cls);
          return (
            <button
              key={t.cls}
              onClick={() => toggle(t.cls)}
              className="rounded px-3 py-2 text-left text-xs font-mono transition-all"
              style={{
                background: on ? "rgba(56,189,248,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${on ? "rgba(56,189,248,0.4)" : "rgba(255,255,255,0.07)"}`,
                color: on ? TAILWIND_ACCENT : MUTED_COLOR,
              }}
            >
              {on ? "✓ " : "  "}{t.label}
            </button>
          );
        })}
      </div>

      <CodePanel accent={TAILWIND_ACCENT} className="px-3 py-2 font-mono text-xs break-all" >
        <span className="text-gray-500">className=</span>
        <span className="text-yellow-400">"</span>
        <span style={{ color: TAILWIND_ACCENT }}>{classStr || <span className="text-gray-600">no classes</span>}</span>
        <span className="text-yellow-400">"</span>
      </CodePanel>
    </DemoShell>
  );
}
