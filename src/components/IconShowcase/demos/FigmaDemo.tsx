import { useState } from "react";
import CodePanel from "./components/CodePanel";
import DemoShell from "./components/DemoShell";

const FIGMA_ACCENT = "#f24e1e";

const ELEMENTS = [
  {
    id: "hero-btn",
    label: "Hero Button",
    type: "Component",
    fill: "#10b981",
    radius: 6,
    px: 20,
    py: 10,
    fontWeight: 600,
    fontSize: 14,
  },
  {
    id: "nav-link",
    label: "Nav Link",
    type: "Link",
    fill: "#10b981",
    radius: 0,
    fontWeight: 400,
    fontSize: 14,
    display: "grid",
    alignItems: "center",
  },
  {
    id: "card",
    label: "Project Card",
    type: "Frame",
    fill: "#192338",
    radius: 12,
    px: 24,
    py: 20,
    fontWeight: 500,
    fontSize: 16,
  },
  {
    id: "badge",
    label: "Status Badge",
    type: "Component",
    fill: "#1a3a2a",
    radius: 99,
    px: 10,
    py: 4,
    fontWeight: 600,
    fontSize: 12,
    display: "grid",
    alignItems: "center",
  },
];

export default function FigmaDemo() {
  const [selected, setSelected] = useState(ELEMENTS[0]);

  const css = `background: ${selected.fill};
border-radius: ${selected.radius}px;
padding: ${selected.py}px ${selected.px}px;
font-size: ${selected.fontSize}px;
font-weight: ${selected.fontWeight};`;

  return (
    <DemoShell>
      <div className="grid grid-cols-[1fr_160px] gap-3">
        <div
          className="rounded-lg p-4 flex flex-col gap-3"
          style={{
            background: "#2c2c2c",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-xs text-gray-500">Canvas</p>
          <div className="flex flex-wrap gap-3 items-center">
            {ELEMENTS.map((el) => {
              const isSelected = selected.id === el.id;
              return (
                <div
                  key={el.id}
                  onClick={() => setSelected(el)}
                  className="cursor-pointer transition-all"
                  style={{
                    background: el.fill,
                    borderRadius: el.radius,
                    padding: `${el.py}px ${el.px || 14}px`,
                    fontSize: el.fontSize,
                    fontWeight: el.fontWeight,
                    color: "#fff",
                    outline: isSelected
                      ? "2px solid #1bb3f5"
                      : "2px solid transparent",
                    outlineOffset: 2,
                    minWidth: 40,
                    minHeight: 28,
                  }}
                >
                  {el.label}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#2c2c2c",
          }}
        >
          <div
            className="px-3 py-2 text-xs text-gray-400"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "#3c3c3c",
            }}
          >
            Inspect
          </div>
          <div className="p-2 space-y-2 text-xs font-mono">
            <div>
              <span className="text-gray-500">Type</span>
              <br />
              <span className="text-blue-400">{selected.type}</span>
            </div>
            <div>
              <span className="text-gray-500">Fill</span>
              <br />
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded-sm inline-block"
                  style={{ background: selected.fill }}
                />
                <span className="text-gray-300">{selected.fill}</span>
              </span>
            </div>
            <div>
              <span className="text-gray-500">Corner</span>
              <br />
              <span className="text-gray-300">{selected.radius}px</span>
            </div>
            <div>
              <span className="text-gray-500">Padding</span>
              <br />
              <span className="text-gray-300">
                {selected.py} {selected.px}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CodePanel
        accent={FIGMA_ACCENT}
        className="p-3 font-mono text-xs leading-5 text-gray-400"
      >
        <p className="text-gray-600 mb-1">{"/* CSS export */"}</p>
        {css.split("\n").map((line, i) => {
          const [prop, val] = line.split(": ");
          return (
            <div key={i}>
              <span className="text-blue-400">{prop}</span>
              <span className="text-gray-600">: </span>
              <span style={{ color: FIGMA_ACCENT }}>{val}</span>
            </div>
          );
        })}
      </CodePanel>
    </DemoShell>
  );
}
