import { useState, useEffect, useRef } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";

const REACT_ACCENT = "#61dafb";

interface ComponentNode {
  id: string;
  label: string;
  pure: boolean;
  children?: string[];
}

const TREE: ComponentNode[] = [
  { id: "app", label: "App", pure: false, children: ["header", "counter", "list"] },
  { id: "header", label: "Header (memo)", pure: true },
  { id: "counter", label: "Counter", pure: false },
  { id: "list", label: "List", pure: false },
];

const INDENT: Record<string, number> = { app: 0, header: 1, counter: 1, list: 1 };

export default function ReactDemo() {
  const [count, setCount] = useState(0);
  const [, setItems] = useState(["Build portfolio", "Fix sphere bug"]);
  const [flashing, setFlashing] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = (ids: string[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFlashing(new Set(ids));
    timerRef.current = setTimeout(() => setFlashing(new Set()), 700);
  };

  const increment = () => {
    setCount((c) => c + 1);
    flash(["app", "counter"]);
  };

  const addItem = () => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
    flash(["app", "list"]);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <DemoShell className="gap-5">
      <p className="text-xs text-gray-400 text-center">
        Watch which components re-render when state changes
      </p>

      <CodePanel accent={REACT_ACCENT} className="p-4 font-mono text-sm">
        {TREE.map((node) => (
          <div
            key={node.id}
            className="flex items-center gap-2 py-1 px-2 rounded mb-1 transition-all duration-150"
            style={{
              marginLeft: INDENT[node.id] * 20,
              background: flashing.has(node.id) ? "rgba(97,218,251,0.18)" : "transparent",
              border: flashing.has(node.id) ? "1px solid rgba(97,218,251,0.5)" : "1px solid transparent",
            }}
          >
            <span style={{ color: node.pure ? "#9ca3af" : REACT_ACCENT }}>
              {"<"}{node.label}{">"}{node.children ? "" : " /"}
            </span>
            {flashing.has(node.id) && (
              <span className="text-xs ml-auto" style={{ color: REACT_ACCENT }}>re-render</span>
            )}
          </div>
        ))}
      </CodePanel>

      <div className="flex gap-3">
        <button
          onClick={increment}
          className="flex-1 rounded-lg py-2 text-sm transition-all"
          style={{ background: "rgba(97,218,251,0.1)", border: "1px solid rgba(97,218,251,0.3)", color: REACT_ACCENT }}
        >
          setCount({count} → {count + 1})
        </button>
        <button
          onClick={addItem}
          className="flex-1 rounded-lg py-2 text-sm transition-all"
          style={{ background: "rgba(97,218,251,0.1)", border: "1px solid rgba(97,218,251,0.3)", color: REACT_ACCENT }}
        >
          setItems([...items])
        </button>
      </div>

      <p className="text-xs text-center text-gray-600">
        Header is memoized — it never re-renders even when parent state changes
      </p>
    </DemoShell>
  );
}
