export const METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
export type Method = (typeof METHODS)[number];

export interface ApiResponse {
  status: number;
  body: string;
  latencyMs: number;
}

const toJson = (value: unknown) => JSON.stringify(value, null, 2);

export const ENDPOINTS: Record<string, string> = {
  "/v1/profile": toJson({ name: "Cillian Ó Murchú", role: "Senior Frontend Developer", location: "Spain/Ireland/Somewhere Amazing", available: true, stack: ["MEAN"] }),
  "/v1/projects": toJson([{ id: 1, name: "Portfolio", tech: "React + Vite", status: "live" }, { id: 2, name: "iGaming Platform", tech: "Angular + RxJS", status: "deployed" }]),
  "/v1/skills": toJson({ frontend: ["React", "Angular", "TypeScript", "Tailwind"], backend: ["Node.js", "Express", "MongoDB"], tools: ["Jest", "Cypress", "Figma", "GitHub"] }),
};
export const DEFAULT_PATH = "/v1/profile";
export const API_HOST = "api.cillian.dev";

export const STATUS_TEXT: Record<number, string> = { 200: "OK", 201: "Created", 404: "Not Found", 405: "Method Not Allowed" };
export const NOT_FOUND_BODY = '{ "error": "404 Not Found" }';
export const DELETE_BODY = '{ "error": "Method not allowed. Cillian cannot be deleted." }';

export const MIN_LATENCY_MS = 80;
export const LATENCY_JITTER_MS = 120;
/** Extra wait so the loading state is visible before the response lands. */
export const SEND_DELAY_MS = 300;

export const REQUEST_HEADERS = [
  { name: "Authorization:", value: "Bearer ey•••••Cillian" },
  { name: "Accept:", value: "application/json" },
];
