// Shared helpers for the Streaming page's password gate. Files starting with
// "_" aren't routes on Vercel. The password lives only in the STREAM_PASSWORD
// env var; the session cookie holds an HMAC derived from it, so changing the
// password logs everyone out. No password set → nobody can log in.
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "stream_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function sessionToken(password: string): string {
  return createHmac("sha256", password).update("stream-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function passwordMatches(candidate: string, password = process.env.STREAM_PASSWORD): boolean {
  return Boolean(password) && safeEqual(candidate, password as string);
}

export function sessionCookie(password = process.env.STREAM_PASSWORD ?? ""): string {
  return `${COOKIE_NAME}=${sessionToken(password)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

export function hasValidSession(request: Request, password = process.env.STREAM_PASSWORD): boolean {
  if (!password) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([name]) => name === COOKIE_NAME)?.[1];
  return value !== undefined && safeEqual(value, sessionToken(password));
}
