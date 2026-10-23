import { useState, useRef } from "react";
import DemoShell from "./components/DemoShell";
import { BODY_TEXT, CODE_BG, DARK_MUTED, FAIL_COLOR, PASS_COLOR, SECONDARY_TEXT, tint } from "./constants";

interface Middleware {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  color: string;
  action: string;
  blocksOn?: string;
}

const INITIAL: Middleware[] = [
  { id: "logger", name: "logger", code: 'console.log(req.method, req.url)', enabled: true, color: SECONDARY_TEXT, action: "logged" },
  { id: "cors", name: "cors()", code: 'res.set("Access-Control-Allow-Origin", "*")', enabled: true, color: "#38bdf8", action: "CORS headers added" },
  { id: "auth", name: "auth", code: 'if (!req.headers.authorization) return 401', enabled: true, color: "#f59e0b", action: "authenticated", blocksOn: "disabled" },
  { id: "rateLimit", name: "rateLimit", code: "if (hits > 100) return 429", enabled: true, color: "#8b5cf6", action: "rate checked" },
  { id: "handler", name: "GET /api/profile", code: 'res.json({ name: "Cillian", role: "Senior FE Dev" })', enabled: true, color: PASS_COLOR, action: "200 OK" },
];

export default function ExpressDemo() {
  const [middleware, setMiddleware] = useState(INITIAL);
  const [active, setActive] = useState<string[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const toggle = (id: string) =>
    setMiddleware((prev) => prev.map((m) => m.id === id ? { ...m, enabled: !m.enabled } : m));

  const sendRequest = () => {
    timerRef.current.forEach(clearTimeout);
    setActive([]);
    setResponse(null);
    const enabled = middleware.filter((m) => m.enabled);
    let blocked = false;
    enabled.forEach((m, i) => {
      timerRef.current.push(setTimeout(() => {
        if (blocked) return;
        setActive((prev) => [...prev, m.id]);
        if (m.id === "auth" && !middleware.find(x => x.id === "auth")?.enabled) {
          blocked = true;
          setResponse("401 Unauthorized");
        } else if (i === enabled.length - 1) {
          setTimeout(() => setResponse('200 OK\n{\n  "name": "Cillian",\n  "role": "Senior FE Dev",\n  "available": true\n}'), 300);
        }
      }, i * 400));
    });
  };

  return (
    <DemoShell>
      <p className="text-sm text-center text-muted">Toggle middleware on/off then send a request</p>

      <div className="flex flex-col gap-1">
        {middleware.map((m) => {
          const isActive = active.includes(m.id);
          return (
            <div key={m.id} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200"
              style={{ background: isActive ? `${m.color}18` : "rgba(255,255,255,0.03)", border: `1px solid ${isActive ? m.color : "rgba(255,255,255,0.07)"}` }}>
              <button onClick={() => toggle(m.id)} className="w-4 h-4 rounded-sm border shrink-0 text-sm flex items-center justify-center"
                style={{ borderColor: m.enabled ? m.color : DARK_MUTED, background: m.enabled ? `${m.color}33` : "transparent" }}>
                {m.enabled && <span style={{ color: m.color }}>✓</span>}
              </button>
              <span className="font-mono text-sm flex-1" style={{ color: m.enabled ? m.color : DARK_MUTED }}>
                app.use(<span style={{ color: BODY_TEXT }}>{m.name}</span>)
              </span>
              {isActive && <span className="text-sm" style={{ color: m.color }}>{m.action} ✓</span>}
            </div>
          );
        })}
      </div>

      <button onClick={sendRequest} className="rounded-lg py-2.5 text-sm font-semibold transition-all"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: BODY_TEXT }}>
        ↗ GET /api/profile
      </button>

      {response && (
        <div className="rounded-lg px-3 py-2 font-mono text-sm whitespace-pre"
          style={{ background: CODE_BG, border: `1px solid ${response.startsWith("200") ? tint(PASS_COLOR, 30) : tint(FAIL_COLOR, 30)}`, color: response.startsWith("200") ? PASS_COLOR : FAIL_COLOR }}>
          {response}
        </div>
      )}
    </DemoShell>
  );
}
