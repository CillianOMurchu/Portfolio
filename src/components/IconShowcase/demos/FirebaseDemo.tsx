import { useState, useEffect, useRef } from "react";
import DemoShell from "./components/DemoShell";
import CodePanel from "./components/CodePanel";
import { PASS_COLOR, WARN_COLOR, MUTED_COLOR, DARK_MUTED } from "./constants";

interface Doc { visitors: number; coffeeConsumed: number; lastSeen: string; status: "online" | "away" | "offline"; projectsBuilt: number; }

const FIREBASE_ACCENT = "#ffca28";

const STATUSES: Doc["status"][] = ["online", "away", "online", "online", "online", "away"];
const LAST_SEEN = ["just now", "2 seconds ago", "just now", "just now", "just now", "1 minute ago"];
const STATUS_COLOR: Record<Doc["status"], string> = { online: PASS_COLOR, away: WARN_COLOR, offline: MUTED_COLOR };

export default function FirebaseDemo() {
  const [doc, setDoc] = useState<Doc>({ visitors: 1247, coffeeConsumed: 1892, lastSeen: "just now", status: "online", projectsBuilt: 47 });
  const [listening, setListening] = useState(false);
  const [, setTick] = useState(0);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const doFlash = (keys: string[]) => {
    setFlash(new Set(keys));
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(new Set()), 600);
  };

  useEffect(() => {
    if (!listening) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTick(t => {
        const i = t % STATUSES.length;
        const changed: string[] = [];
        setDoc(prev => {
          const next = { ...prev };
          if (i % 2 === 0) { next.visitors += Math.floor(Math.random() * 3) + 1; changed.push("visitors"); }
          if (i % 3 === 0) { next.coffeeConsumed += 1; changed.push("coffeeConsumed"); }
          next.status = STATUSES[i];
          next.lastSeen = LAST_SEEN[i];
          if (next.status !== prev.status) changed.push("status", "lastSeen");
          doFlash(changed);
          return next;
        });
        return t + 1;
      });
    }, 1800);
    return () => clearInterval(intervalRef.current);
  }, [listening]);

  const Field = ({ k, v }: { k: string; v: string | number }) => (
    <div className="flex justify-between items-center py-1 px-2 rounded transition-all duration-300"
      style={{ background: flash.has(k) ? "rgba(255,202,40,0.12)" : "transparent", border: `1px solid ${flash.has(k) ? "rgba(255,202,40,0.3)" : "transparent"}` }}>
      <span className="text-blue-400 text-xs font-mono">{k}:</span>
      <span className="text-xs font-mono" style={{ color: k === "status" ? STATUS_COLOR[v as Doc["status"]] : "#f3f4f6" }}>
        {typeof v === "string" ? `"${v}"` : v.toLocaleString()}
        {flash.has(k) && <span className="ml-1 text-yellow-400 text-xs">← updated</span>}
      </span>
    </div>
  );

  return (
    <DemoShell>
      <div className="rounded-lg overflow-hidden font-mono text-xs" style={{ border: "1px solid rgba(255,202,40,0.2)" }}>
        <div className="px-3 py-2 flex items-center gap-2" style={{ background: "#1a1200", borderBottom: "1px solid rgba(255,202,40,0.15)" }}>
          <span className="text-yellow-400">firestore</span>
          <span className="text-gray-600">/</span>
          <span className="text-blue-400">users</span>
          <span className="text-gray-600">/</span>
          <span className="text-green-400">cillian</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: listening ? PASS_COLOR : DARK_MUTED, boxShadow: listening ? `0 0 6px ${PASS_COLOR}` : "none" }} />
            <span style={{ color: listening ? PASS_COLOR : MUTED_COLOR }}>{listening ? "live" : "off"}</span>
          </div>
        </div>
        <div className="p-3 space-y-0.5" style={{ background: "#0d1117" }}>
          <Field k="status" v={doc.status} />
          <Field k="lastSeen" v={doc.lastSeen} />
          <Field k="visitors" v={doc.visitors} />
          <Field k="coffeeConsumed" v={doc.coffeeConsumed} />
          <Field k="projectsBuilt" v={doc.projectsBuilt} />
        </div>
      </div>

      <CodePanel accent={FIREBASE_ACCENT} className="px-3 py-2 font-mono text-xs">
        <span className="text-purple-400">onSnapshot</span>
        <span className="text-gray-500">(docRef, (doc) {"=>"} {"{"}</span>
        <div className="ml-4 text-gray-500">setData(doc.<span className="text-blue-400">data</span>())</div>
        <span className="text-gray-500">{"}"} )</span>
      </CodePanel>

      <button onClick={() => setListening(l => !l)}
        className="rounded-lg py-2.5 text-sm font-semibold transition-all"
        style={{ background: listening ? "rgba(255,202,40,0.12)" : "rgba(255,202,40,0.06)", border: `1px solid ${listening ? "rgba(255,202,40,0.4)" : "rgba(255,202,40,0.2)"}`, color: listening ? "#ffca28" : "#9ca3af" }}>
        {listening ? "⏹ Unsubscribe listener" : "▶ Subscribe to document"}
      </button>
    </DemoShell>
  );
}
