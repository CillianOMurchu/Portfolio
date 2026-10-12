// Vercel serverless function: POST { password } → sets the Streaming session
// cookie (204) or rejects (401).
import { passwordMatches, sessionCookie } from "./_streamAuth";

export async function POST(request: Request): Promise<Response> {
  let password: unknown;
  try {
    ({ password } = (await request.json()) as { password?: unknown });
  } catch {
    return new Response(null, { status: 400 });
  }

  if (typeof password !== "string" || !passwordMatches(password)) {
    return new Response(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return new Response(null, { status: 204, headers: { "Set-Cookie": sessionCookie(), "Cache-Control": "no-store" } });
}
