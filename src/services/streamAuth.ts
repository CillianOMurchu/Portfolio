// Client for the Streaming password gate (api/login.ts, api/session.ts).
// Only an exact 204 counts: without the API (e.g. `vite dev`) the SPA fallback
// answers 200 with index.html, which must not read as logged in.

export async function checkSession(fetchFn: typeof fetch = fetch): Promise<boolean> {
  try {
    return (await fetchFn("/api/session", { credentials: "same-origin" })).status === 204;
  } catch {
    return false;
  }
}

export async function login(password: string, fetchFn: typeof fetch = fetch): Promise<boolean> {
  try {
    const response = await fetchFn("/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return response.status === 204;
  } catch {
    return false;
  }
}
