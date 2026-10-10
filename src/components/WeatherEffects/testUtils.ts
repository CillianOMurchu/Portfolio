// Test-only helpers for the weather effects (imported by *.test.ts files only).
import { vi } from "vitest";

/** A 2D-context stand-in exposing just what the scenes and driver use. */
export function createStubContext() {
  const gradient = () => ({ addColorStop: vi.fn() });
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    setTransform: vi.fn(),
    createRadialGradient: vi.fn(gradient),
    createLinearGradient: vi.fn(gradient),
    drawImage: vi.fn(),
    strokeStyle: "" as unknown,
    fillStyle: "" as unknown,
    lineWidth: 0,
    lineJoin: "miter",
    lineCap: "butt",
    shadowBlur: 0,
    shadowColor: "",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
  };
}
export type StubContext = ReturnType<typeof createStubContext>;

export const asContext = (ctx: StubContext) => ctx as unknown as CanvasRenderingContext2D;

/** Deterministic PRNG (mulberry32) so runs are reproducible. */
export function seededRng(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Records every value assigned to `prop` on a stub context (e.g. each globalAlpha set). */
export function recordAssignments<K extends keyof StubContext>(ctx: StubContext, prop: K): StubContext[K][] {
  const values: StubContext[K][] = [];
  let current = ctx[prop];
  Object.defineProperty(ctx, prop, {
    get: () => current,
    set: (value: StubContext[K]) => {
      current = value;
      values.push(value);
    },
  });
  return values;
}
