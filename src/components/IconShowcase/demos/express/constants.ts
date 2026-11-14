export type MiddlewareTone = "muted" | "info" | "warning" | "highlight" | "success";

export interface Middleware {
  id: string;
  name: string;
  action: string;
  tone: MiddlewareTone;
}

export const AUTH_ID = "auth";
export const HANDLER_ID = "handler";

export const MIDDLEWARE: Middleware[] = [
  { id: "logger", name: "logger", action: "logged", tone: "muted" },
  { id: "cors", name: "cors()", action: "CORS headers added", tone: "info" },
  { id: AUTH_ID, name: "auth", action: "authenticated", tone: "warning" },
  { id: "rateLimit", name: "rateLimit", action: "rate checked", tone: "highlight" },
  { id: HANDLER_ID, name: "GET /api/profile", action: "200 OK", tone: "success" },
];

export const STEP_DELAY_MS = 400;
export const RESPONSE_DELAY_MS = 300;

export const RESPONSES = {
  ok: '200 OK\n{\n  "name": "Cillian",\n  "role": "Senior FE Dev",\n  "available": true\n}',
  unauthorized: "401 Unauthorized",
  notFound: "404 Not Found",
} as const;
