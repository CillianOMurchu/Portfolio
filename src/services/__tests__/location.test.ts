import { describe, it, expect, vi } from "vitest";
import { GET } from "../../../api/location";
import { FALLBACK_LATITUDE, FALLBACK_LONGITUDE, getVisitorLocation } from "../location";

const FALLBACK = { latitude: FALLBACK_LATITUDE, longitude: FALLBACK_LONGITUDE, source: "fallback" };

// ─── api/location (Vercel function) ───────────────────────────────────────────

function requestWith(headers: Record<string, string>) {
  return new Request("https://example.com/api/location", { headers });
}

describe("GET /api/location", () => {
  it("returns coordinates from the Vercel IP headers", async () => {
    const res = GET(requestWith({ "x-vercel-ip-latitude": "53.3498", "x-vercel-ip-longitude": "-6.2603" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("private, max-age=3600");
    expect(await res.json()).toEqual({ latitude: 53.3498, longitude: -6.2603 });
  });

  it("returns 204 when the headers are missing", () => {
    const res = GET(requestWith({}));
    expect(res.status).toBe(204);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(GET(requestWith({ "x-vercel-ip-latitude": "53.3" })).status).toBe(204);
  });

  it("returns 204 for non-numeric or out-of-range values", () => {
    expect(GET(requestWith({ "x-vercel-ip-latitude": "abc", "x-vercel-ip-longitude": "1" })).status).toBe(204);
    expect(GET(requestWith({ "x-vercel-ip-latitude": "", "x-vercel-ip-longitude": "1" })).status).toBe(204);
    expect(GET(requestWith({ "x-vercel-ip-latitude": "91", "x-vercel-ip-longitude": "1" })).status).toBe(204);
    expect(GET(requestWith({ "x-vercel-ip-latitude": "1", "x-vercel-ip-longitude": "-181" })).status).toBe(204);
  });
});

// ─── getVisitorLocation ───────────────────────────────────────────────────────

function mockFetch(response: Partial<Response>) {
  return vi.fn<typeof fetch>().mockResolvedValue(response as Response);
}

describe("getVisitorLocation", () => {
  it("returns the IP-derived location on a 200 with valid JSON", async () => {
    const fetchFn = mockFetch({ status: 200, json: () => Promise.resolve({ latitude: 53.35, longitude: -6.26 }) });
    expect(await getVisitorLocation(fetchFn)).toEqual({ latitude: 53.35, longitude: -6.26, source: "ip" });
    expect(fetchFn.mock.calls[0][0]).toBe("/api/location");
  });

  it("falls back on 204 (no Vercel headers)", async () => {
    expect(await getVisitorLocation(mockFetch({ status: 204 }))).toEqual(FALLBACK);
  });

  it("falls back on an error status", async () => {
    expect(await getVisitorLocation(mockFetch({ status: 404 }))).toEqual(FALLBACK);
  });

  it("falls back when the body isn't JSON (SPA index.html in dev)", async () => {
    const fetchFn = mockFetch({ status: 200, json: () => Promise.reject(new SyntaxError("Unexpected token <")) });
    expect(await getVisitorLocation(fetchFn)).toEqual(FALLBACK);
  });

  it("falls back on malformed JSON", async () => {
    const fetchFn = mockFetch({ status: 200, json: () => Promise.resolve({ latitude: "53" }) });
    expect(await getVisitorLocation(fetchFn)).toEqual(FALLBACK);
  });

  it("falls back on network failure", async () => {
    const fetchFn = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await getVisitorLocation(fetchFn)).toEqual(FALLBACK);
  });

  it("rethrows when aborted instead of falling back", async () => {
    const controller = new AbortController();
    const abortError = new DOMException("Aborted", "AbortError");
    const fetchFn = vi.fn<typeof fetch>().mockImplementation(() => {
      controller.abort();
      return Promise.reject(abortError);
    });
    await expect(getVisitorLocation(fetchFn, controller.signal)).rejects.toBe(abortError);
  });

  it("falls back when the lookup exceeds the timeout", async () => {
    vi.useFakeTimers();
    try {
      // Never resolves on its own; only settles when its signal aborts.
      const fetchFn = vi.fn<typeof fetch>().mockImplementation(
        (_url, init) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
          }),
      );
      const result = getVisitorLocation(fetchFn, undefined, 3000);
      await vi.advanceTimersByTimeAsync(3000);
      expect(await result).toEqual(FALLBACK);
    } finally {
      vi.useRealTimers();
    }
  });
});
