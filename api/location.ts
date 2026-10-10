// Vercel serverless function: returns the visitor's approximate location,
// derived by Vercel from their IP and exposed as request headers.
// Responds 204 when the headers are absent (e.g. local dev, unknown IP).

function parseCoordinate(value: string | null, limit: number): number | null {
  if (value === null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
}

export function GET(request: Request): Response {
  const latitude = parseCoordinate(request.headers.get("x-vercel-ip-latitude"), 90);
  const longitude = parseCoordinate(request.headers.get("x-vercel-ip-longitude"), 180);

  if (latitude === null || longitude === null) {
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }

  // private: the browser may reuse it for an hour, but the shared CDN must never
  // serve one visitor's location to another.
  return Response.json({ latitude, longitude }, { headers: { "Cache-Control": "private, max-age=3600" } });
}
