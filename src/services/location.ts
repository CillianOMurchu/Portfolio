// Visitor location from /api/location (Vercel IP geolocation), falling back
// to a fixed location when it's unavailable (local dev, 204, errors).

export const FALLBACK_LATITUDE = 36.72;
export const FALLBACK_LONGITUDE = -4.42;

const LOCATION_ENDPOINT = "/api/location";
const LOCATION_TIMEOUT_MS = 3000;

export interface VisitorLocation {
  latitude: number;
  longitude: number;
  source: "ip" | "fallback";
}

const FALLBACK_LOCATION: VisitorLocation = {
  latitude: FALLBACK_LATITUDE,
  longitude: FALLBACK_LONGITUDE,
  source: "fallback",
};

function isCoordinatePair(data: unknown): data is { latitude: number; longitude: number } {
  if (typeof data !== "object" || data === null) return false;
  const { latitude, longitude } = data as Record<string, unknown>;
  return typeof latitude === "number" && typeof longitude === "number";
}

export async function getVisitorLocation(
  fetchFn: typeof fetch = fetch,
  signal?: AbortSignal,
  timeoutMs: number = LOCATION_TIMEOUT_MS,
): Promise<VisitorLocation> {
  // Own controller so a slow lookup can time out (-> fallback) without
  // aborting the caller's signal, while still honouring the caller's abort.
  const controller = new AbortController();
  const forwardAbort = () => controller.abort(signal?.reason);
  if (signal?.aborted) forwardAbort();
  else signal?.addEventListener("abort", forwardAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(LOCATION_ENDPOINT, { signal: controller.signal });
    if (response.status !== 200) return FALLBACK_LOCATION;

    // Without the API (e.g. `vite dev`) the SPA fallback serves index.html, so json() throws.
    const data: unknown = await response.json();
    if (!isCoordinatePair(data)) return FALLBACK_LOCATION;

    return { latitude: data.latitude, longitude: data.longitude, source: "ip" };
  } catch (error) {
    if (signal?.aborted) throw error;
    return FALLBACK_LOCATION;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
