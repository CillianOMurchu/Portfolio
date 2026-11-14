import { useState } from "react";
import DemoShell from "../components/DemoShell";
import { useTimers } from "../components/useTimers";
import { AUTH_ID, HANDLER_ID, MIDDLEWARE, RESPONSE_DELAY_MS, RESPONSES, STEP_DELAY_MS, type Middleware } from "./constants";
import {
  CHECKBOX, CHECKBOX_OFF, MIDDLEWARE_CODE, RESPONSE_ERROR, RESPONSE_OK, ROW, ROW_IDLE, SEND_BUTTON, TONE,
} from "./styles";

interface RequestPlan {
  steps: string[];
  response: string;
}

/** Walks the chain in order; a disabled auth middleware rejects the request where it would have run. */
function planRequest(enabledIds: ReadonlySet<string>): RequestPlan {
  const steps: string[] = [];
  for (const middleware of MIDDLEWARE) {
    if (middleware.id === AUTH_ID && !enabledIds.has(AUTH_ID)) return { steps, response: RESPONSES.unauthorized };
    if (enabledIds.has(middleware.id)) steps.push(middleware.id);
  }
  return { steps, response: enabledIds.has(HANDLER_ID) ? RESPONSES.ok : RESPONSES.notFound };
}

interface MiddlewareRowProps {
  middleware: Middleware;
  isEnabled: boolean;
  isLit: boolean;
  toggle: () => void;
}

function MiddlewareRow({ middleware, isEnabled, isLit, toggle }: MiddlewareRowProps) {
  const tone = TONE[middleware.tone];
  const rowState = isLit ? tone.litRow : ROW_IDLE;
  const boxState = isEnabled ? `${tone.checkedBox} ${tone.text}` : CHECKBOX_OFF;
  const codeTone = isEnabled ? tone.text : "text-faint";

  return (
    <div className={`${ROW} ${rowState}`}>
      <button type="button" onClick={toggle} aria-pressed={isEnabled} aria-label={`Toggle ${middleware.name}`} className={`${CHECKBOX} ${boxState}`}>
        {isEnabled && "✓"}
      </button>
      <span className={`${MIDDLEWARE_CODE} ${codeTone}`}>
        app.use(<span className="text-body">{middleware.name}</span>)
      </span>
      {isLit && <span className={`text-sm ${tone.text}`}>{middleware.action} ✓</span>}
    </div>
  );
}

export default function ExpressDemo() {
  const [enabledIds, setEnabledIds] = useState<ReadonlySet<string>>(() => new Set(MIDDLEWARE.map(mw => mw.id)));
  const [litIds, setLitIds] = useState<string[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const { schedule, clearAll } = useTimers();

  const toggleMiddleware = (id: string) => setEnabledIds(current => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const sendRequest = () => {
    clearAll();
    setLitIds([]);
    setResponse(null);
    const plan = planRequest(enabledIds);
    plan.steps.forEach((id, index) => schedule(() => setLitIds(lit => [...lit, id]), index * STEP_DELAY_MS));
    schedule(() => setResponse(plan.response), plan.steps.length * STEP_DELAY_MS + RESPONSE_DELAY_MS);
  };

  const responseClass = response?.startsWith("200") ? RESPONSE_OK : RESPONSE_ERROR;

  return (
    <DemoShell>
      <p className="text-center text-sm text-muted">Toggle middleware on/off then send a request</p>
      <div className="flex flex-col gap-1">
        {MIDDLEWARE.map(middleware => (
          <MiddlewareRow
            key={middleware.id}
            middleware={middleware}
            isEnabled={enabledIds.has(middleware.id)}
            isLit={litIds.includes(middleware.id)}
            toggle={() => toggleMiddleware(middleware.id)}
          />
        ))}
      </div>
      <button type="button" onClick={sendRequest} className={SEND_BUTTON}>↗ GET /api/profile</button>
      {response && <div className={responseClass}>{response}</div>}
    </DemoShell>
  );
}
