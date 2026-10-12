import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../../api/login";
import { GET } from "../../../api/session";
import { COOKIE_NAME, hasValidSession, passwordMatches, sessionCookie } from "../../../api/_streamAuth";
import { checkSession, login } from "../streamAuth";

const PASSWORD = "correct horse";

const loginRequest = (body: unknown) =>
  new Request("https://example.com/api/login", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });
const sessionRequest = (cookie?: string) => new Request("https://example.com/api/session", { headers: cookie ? { cookie } : {} });
const cookieValue = (setCookie: string) => setCookie.split(";")[0];

afterEach(() => vi.unstubAllEnvs());

// ─── api (Vercel functions) ──────────────────────────────────────────────────

describe("POST /api/login", () => {
  it("sets an HttpOnly, Secure session cookie for the right password", async () => {
    vi.stubEnv("STREAM_PASSWORD", PASSWORD);
    const res = await POST(loginRequest({ password: PASSWORD }));
    expect(res.status).toBe(204);
    const cookie = res.headers.get("Set-Cookie") ?? "";
    expect(cookie).toMatch(new RegExp(`^${COOKIE_NAME}=[0-9a-f]{64};`));
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).not.toContain(PASSWORD);
  });

  it("rejects a wrong or missing password, and bad bodies", async () => {
    vi.stubEnv("STREAM_PASSWORD", PASSWORD);
    expect((await POST(loginRequest({ password: "nope" }))).status).toBe(401);
    expect((await POST(loginRequest({}))).status).toBe(401);
    expect((await POST(loginRequest("not json"))).status).toBe(400);
  });

  it("lets nobody in when STREAM_PASSWORD isn't set", async () => {
    vi.stubEnv("STREAM_PASSWORD", "");
    expect((await POST(loginRequest({ password: "" }))).status).toBe(401);
    expect(passwordMatches("")).toBe(false);
  });
});

describe("GET /api/session", () => {
  it("accepts the cookie issued by login", async () => {
    vi.stubEnv("STREAM_PASSWORD", PASSWORD);
    const res = await POST(loginRequest({ password: PASSWORD }));
    const cookie = cookieValue(res.headers.get("Set-Cookie") ?? "");
    expect(GET(sessionRequest(`other=1; ${cookie}`)).status).toBe(204);
  });

  it("rejects no cookie, a forged cookie, and cookies from an old password", () => {
    vi.stubEnv("STREAM_PASSWORD", PASSWORD);
    expect(GET(sessionRequest()).status).toBe(401);
    expect(GET(sessionRequest(`${COOKIE_NAME}=deadbeef`)).status).toBe(401);
    const oldCookie = cookieValue(sessionCookie("old password"));
    expect(hasValidSession(sessionRequest(oldCookie))).toBe(false);
  });
});

// ─── client ──────────────────────────────────────────────────────────────────

const respond = (status: number) => vi.fn<typeof fetch>().mockResolvedValue(new Response(status === 204 ? null : "<html>", { status }));

describe("streamAuth client", () => {
  it("treats only 204 as a session (the dev SPA fallback answers 200)", async () => {
    expect(await checkSession(respond(204))).toBe(true);
    expect(await checkSession(respond(200))).toBe(false);
    expect(await checkSession(respond(401))).toBe(false);
    expect(await checkSession(vi.fn<typeof fetch>().mockRejectedValue(new Error("offline")))).toBe(false);
  });

  it("posts the password as JSON and reports success", async () => {
    const fetchFn = respond(204);
    expect(await login(PASSWORD, fetchFn)).toBe(true);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("/api/login");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({ password: PASSWORD });
    expect(await login("nope", respond(401))).toBe(false);
  });
});
