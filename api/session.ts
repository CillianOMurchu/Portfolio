// Vercel serverless function: 204 if the request carries a valid Streaming
// session cookie, 401 otherwise.
import { hasValidSession } from "./_streamAuth";

export function GET(request: Request): Response {
  return new Response(null, { status: hasValidSession(request) ? 204 : 401, headers: { "Cache-Control": "no-store" } });
}
