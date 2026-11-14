import { useEffect, useRef, useState } from "react";
import DemoShell from "../components/DemoShell";
import { STATUS_TONE } from "../styles";
import {
  API_HOST, DEFAULT_PATH, DELETE_BODY, ENDPOINTS, LATENCY_JITTER_MS, METHODS, MIN_LATENCY_MS,
  NOT_FOUND_BODY, REQUEST_HEADERS, SEND_DELAY_MS, STATUS_TEXT, type ApiResponse, type Method,
} from "./constants";
import {
  HEADERS_PANEL, HEADER_ROW, METHOD_SELECT, METHOD_TONE, RESPONSE_BODY, RESPONSE_ERROR, RESPONSE_HEADER,
  RESPONSE_OK, SEND_BUTTON, URL_FIELD, URL_HOST, URL_PATH,
} from "./styles";

function respond(method: Method, path: string, latencyMs: number): ApiResponse {
  if (method === "DELETE") return { status: 405, body: DELETE_BODY, latencyMs };
  const body = ENDPOINTS[path];
  if (!body) return { status: 404, body: NOT_FOUND_BODY, latencyMs };
  return { status: method === "POST" ? 201 : 200, body, latencyMs };
}

function ResponsePanel({ response }: { response: ApiResponse }) {
  const isSuccess = response.status < 300;
  const statusTone = isSuccess ? STATUS_TONE.pass : STATUS_TONE.fail;

  return (
    <div className={isSuccess ? RESPONSE_OK : RESPONSE_ERROR}>
      <div className={RESPONSE_HEADER}>
        <span className={`font-semibold ${statusTone}`}>{response.status} {STATUS_TEXT[response.status]}</span>
        <span className="ml-auto text-muted">{response.latencyMs}ms</span>
      </div>
      <pre className={RESPONSE_BODY}>{response.body}</pre>
    </div>
  );
}

export default function PostmanDemo() {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState(DEFAULT_PATH);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const sendRequest = () => {
    clearTimeout(timer.current);
    setIsLoading(true);
    setResponse(null);
    const latencyMs = MIN_LATENCY_MS + Math.floor(Math.random() * LATENCY_JITTER_MS);
    timer.current = setTimeout(() => {
      setIsLoading(false);
      setResponse(respond(method, path, latencyMs));
    }, latencyMs + SEND_DELAY_MS);
  };

  return (
    <DemoShell className="gap-3">
      <div className="flex gap-2">
        <select value={method} onChange={(e) => setMethod(e.target.value as Method)} className={`${METHOD_SELECT} ${METHOD_TONE[method]}`}>
          {METHODS.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
        <div className={URL_FIELD}>
          <span className={URL_HOST}>{API_HOST}</span>
          <select value={path} onChange={(e) => setPath(e.target.value)} className={URL_PATH}>
            {Object.keys(ENDPOINTS).map(endpoint => <option key={endpoint} value={endpoint}>{endpoint}</option>)}
          </select>
        </div>
        <button type="button" onClick={sendRequest} disabled={isLoading} className={SEND_BUTTON}>
          {isLoading ? "…" : "Send"}
        </button>
      </div>

      <div className={HEADERS_PANEL}>
        {REQUEST_HEADERS.map(header => (
          <div key={header.name} className={HEADER_ROW}>
            <span className="text-muted">{header.name}</span>
            <span className="font-mono text-muted">{header.value}</span>
          </div>
        ))}
      </div>

      {response && <ResponsePanel response={response} />}
    </DemoShell>
  );
}
