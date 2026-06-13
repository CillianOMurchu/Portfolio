import { useRef, useState } from "react";
import DemoShell from "./components/DemoShell";
import { PASS_COLOR, FAIL_COLOR, MUTED_COLOR } from "./constants";

const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
type Method = (typeof METHODS)[number];

const ENDPOINTS: Record<string, string> = {
  "/v1/profile": JSON.stringify({ name: "Cillian Ó Murchú", role: "Senior Frontend Developer", location: "Spain/Ireland/Somewhere Amazing", available: true, stack: ["MEAN"] }, null, 2),
  "/v1/projects": JSON.stringify([{ id: 1, name: "Portfolio", tech: "React + Vite", status: "live" }, { id: 2, name: "iGaming Platform", tech: "Angular + RxJS", status: "deployed" }], null, 2),
  "/v1/skills": JSON.stringify({ frontend: ["React", "Angular", "TypeScript", "Tailwind"], backend: ["Node.js", "Express", "MongoDB"], tools: ["Jest", "Cypress", "Figma", "GitHub"] }, null, 2),
};

const METHOD_COLOR: Record<Method, string> = { GET: PASS_COLOR, POST: "#f59e0b", PUT: "#3178c6", DELETE: FAIL_COLOR };

export default function PostmanDemo() {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState("/v1/profile");
  const [response, setResponse] = useState<{ status: number; body: string; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const send = () => {
    clearTimeout(timer.current);
    setLoading(true);
    setResponse(null);
    const ms = 80 + Math.floor(Math.random() * 120);
    timer.current = setTimeout(() => {
      setLoading(false);
      if (method === "DELETE") { setResponse({ status: 405, body: '{ "error": "Method not allowed. Cillian cannot be deleted." }', ms }); return; }
      const body = ENDPOINTS[path] ?? '{ "error": "404 Not Found" }';
      const status = ENDPOINTS[path] ? (method === "POST" ? 201 : 200) : 404;
      setResponse({ status, body, ms });
    }, ms + 300);
  };

  return (
    <DemoShell className="gap-3">
      <div className="flex gap-2">
        <select value={method} onChange={(e) => setMethod(e.target.value as Method)}
          className="rounded px-2 py-2 text-xs font-semibold outline-none"
          style={{ background: `${METHOD_COLOR[method]}22`, border: `1px solid ${METHOD_COLOR[method]}55`, color: METHOD_COLOR[method], minWidth: 76 }}>
          {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <div className="flex-1 flex items-center rounded px-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-xs text-gray-600 font-mono">api.cillian.dev</span>
          <select value={path} onChange={(e) => setPath(e.target.value)} className="flex-1 bg-transparent outline-none text-xs font-mono ml-0.5" style={{ color: "#e5e7eb" }}>
            {Object.keys(ENDPOINTS).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <button onClick={send} disabled={loading}
          className="px-4 rounded text-xs font-semibold transition-all"
          style={{ background: loading ? "rgba(239,93,37,0.1)" : "rgba(239,93,37,0.2)", border: "1px solid rgba(239,93,37,0.4)", color: loading ? MUTED_COLOR : "#ef5b25" }}>
          {loading ? "…" : "Send"}
        </button>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-3 py-1.5 text-xs flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-gray-500">Authorization:</span>
          <span className="font-mono text-gray-400">Bearer ey•••••Cillian</span>
        </div>
        <div className="px-3 py-1.5 text-xs flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
          <span className="text-gray-500">Accept:</span>
          <span className="font-mono text-gray-400">application/json</span>
        </div>
      </div>

      {response && (
        <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${response.status === 200 || response.status === 201 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}` }}>
          <div className="px-3 py-1.5 flex items-center gap-2 text-xs" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="font-semibold" style={{ color: response.status < 300 ? PASS_COLOR : FAIL_COLOR }}>{response.status} {response.status === 200 ? "OK" : response.status === 201 ? "Created" : response.status === 405 ? "Method Not Allowed" : "Not Found"}</span>
            <span className="text-gray-600 ml-auto">{response.ms}ms</span>
          </div>
          <pre className="px-3 py-2 text-xs font-mono text-gray-300 overflow-x-auto max-h-40" style={{ background: "#0d1117" }}>
            {response.body}
          </pre>
        </div>
      )}
    </DemoShell>
  );
}
