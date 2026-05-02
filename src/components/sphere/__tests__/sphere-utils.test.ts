import { describe, it, expect } from "vitest";
import { generateFibonacciSphere } from "../fibonacciSphere";
import { rotatePoint } from "../rotation";
import { findIconAt, getDistanceToNearestIcon } from "../hitTest";
import { getIconSize } from "../responsive";
import type { ProjectedIcon } from "../types";

// ─── generateFibonacciSphere ──────────────────────────────────────────────────

describe("generateFibonacciSphere", () => {
  it("returns an empty array for count=0", () => {
    expect(generateFibonacciSphere(0)).toEqual([]);
  });

  it("returns the correct number of points", () => {
    expect(generateFibonacciSphere(21)).toHaveLength(21);
    expect(generateFibonacciSphere(5)).toHaveLength(5);
  });

  it("first point is at the top of the sphere (y=1)", () => {
    const pts = generateFibonacciSphere(10);
    expect(pts[0].y).toBeCloseTo(1, 10);
  });

  it("last point is at the bottom of the sphere (y=-1)", () => {
    const pts = generateFibonacciSphere(10);
    expect(pts[9].y).toBeCloseTo(-1, 10);
  });

  it("all points lie on the unit sphere (x²+y²+z²=1)", () => {
    const pts = generateFibonacciSphere(21);
    for (const p of pts) {
      expect(p.x * p.x + p.y * p.y + p.z * p.z).toBeCloseTo(1, 10);
    }
  });

  it("points are evenly spread: no two points are identical", () => {
    const pts = generateFibonacciSphere(21);
    const keys = pts.map((p) => `${p.x.toFixed(6)},${p.y.toFixed(6)},${p.z.toFixed(6)}`);
    expect(new Set(keys).size).toBe(21);
  });

  it("returns deterministic results for the same count", () => {
    expect(generateFibonacciSphere(5)).toEqual(generateFibonacciSphere(5));
  });
});

// ─── rotatePoint ─────────────────────────────────────────────────────────────

describe("rotatePoint", () => {
  it("zero rotation returns the same point", () => {
    const p = { x: 1, y: 0.5, z: -0.3 };
    const r = rotatePoint(p, 0, 0);
    expect(r.x).toBeCloseTo(p.x, 10);
    expect(r.y).toBeCloseTo(p.y, 10);
    expect(r.z).toBeCloseTo(p.z, 10);
  });

  it("90° rotation around X axis maps (0,1,0) → (0,0,1)", () => {
    const r = rotatePoint({ x: 0, y: 1, z: 0 }, Math.PI / 2, 0);
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.y).toBeCloseTo(0, 10);
    expect(r.z).toBeCloseTo(1, 10);
  });

  it("90° rotation around Z axis maps (1,0,0) → (0,0,0) in y, shifts x", () => {
    const r = rotatePoint({ x: 1, y: 0, z: 0 }, 0, Math.PI / 2);
    expect(r.x).toBeCloseTo(0, 10);
    expect(r.z).toBeCloseTo(1, 10);
  });

  it("preserves magnitude (length) of the vector", () => {
    const p = { x: 0.6, y: 0.7, z: 0.3 };
    const r = rotatePoint(p, 1.2, 0.7);
    const origMag = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
    const rotMag = Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2);
    expect(rotMag).toBeCloseTo(origMag, 10);
  });

  it("360° rotation returns to the original point", () => {
    const p = { x: 0.4, y: 0.8, z: -0.2 };
    const r = rotatePoint(p, Math.PI * 2, Math.PI * 2);
    expect(r.x).toBeCloseTo(p.x, 10);
    expect(r.y).toBeCloseTo(p.y, 10);
    expect(r.z).toBeCloseTo(p.z, 10);
  });
});

// ─── findIconAt ───────────────────────────────────────────────────────────────

const icon = (name: string, x2d: number, y2d: number, z: number, size = 40): ProjectedIcon => ({
  name,
  x2d,
  y2d,
  z,
  scaledIconSize: size,
});

describe("findIconAt", () => {
  it("returns null for an empty icon list", () => {
    expect(findIconAt(100, 100, [])).toBeNull();
  });

  it("returns null when cursor is outside all icons", () => {
    expect(findIconAt(500, 500, [icon("a", 0, 0, 0)])).toBeNull();
  });

  it("returns the icon when cursor is at its center", () => {
    const a = icon("a", 100, 100, 0);
    expect(findIconAt(100, 100, [a])).toBe(a);
  });

  it("returns the icon when cursor is on its edge", () => {
    const a = icon("a", 100, 100, 0, 40); // half=20
    expect(findIconAt(120, 100, [a])).toBe(a);
    expect(findIconAt(80, 100, [a])).toBe(a);
  });

  it("returns null when cursor is just outside the bounding box", () => {
    const a = icon("a", 100, 100, 0, 40); // half=20
    expect(findIconAt(121, 100, [a])).toBeNull();
  });

  it("returns the front icon (highest z) when two overlap", () => {
    const back = icon("back", 100, 100, -0.5);
    const front = icon("front", 100, 100, 0.5);
    expect(findIconAt(100, 100, [back, front])?.name).toBe("front");
    expect(findIconAt(100, 100, [front, back])?.name).toBe("front");
  });
});

// ─── getDistanceToNearestIcon ─────────────────────────────────────────────────

describe("getDistanceToNearestIcon", () => {
  it("returns 1 for an empty icon list", () => {
    expect(getDistanceToNearestIcon(0, 0, [])).toBe(1);
  });

  it("returns 0 when cursor is inside an icon (distance-to-edge = 0)", () => {
    const a = icon("a", 100, 100, 0, 40); // cursor at center, edge at 120 — dist=0
    expect(getDistanceToNearestIcon(100, 100, [a])).toBe(0);
  });

  it("returns 0 when cursor is on the icon edge", () => {
    const a = icon("a", 100, 100, 0, 40);
    expect(getDistanceToNearestIcon(120, 100, [a])).toBeCloseTo(0, 10);
  });

  it("returns 1 when cursor is farther than slowdownRadius from all icons", () => {
    const a = icon("a", 0, 0, 0, 10); // edge at 5, cursor at 200 → dist=195 > 100
    expect(getDistanceToNearestIcon(200, 0, [a])).toBe(1);
  });

  it("returns a value proportional to distance within slowdownRadius", () => {
    const a = icon("a", 0, 0, 0, 0); // scaledIconSize=0, edge=0, edge distance = cursor dist
    // cursor at (50, 0): dist=50, slowdownRadius=100 → 50/100 = 0.5
    expect(getDistanceToNearestIcon(50, 0, [a], 100)).toBeCloseTo(0.5, 10);
  });

  it("respects a custom slowdownRadius", () => {
    const a = icon("a", 0, 0, 0, 0);
    // cursor at (25, 0): dist=25, slowdownRadius=50 → 25/50 = 0.5
    expect(getDistanceToNearestIcon(25, 0, [a], 50)).toBeCloseTo(0.5, 10);
  });
});

// ─── getIconSize ──────────────────────────────────────────────────────────────

describe("getIconSize", () => {
  it("returns 80 at 2xl breakpoint (≥1536)", () => {
    expect(getIconSize(1536)).toBe(80);
    expect(getIconSize(2000)).toBe(80);
  });

  it("returns 70 at xl breakpoint (≥1280, <1536)", () => {
    expect(getIconSize(1280)).toBe(70);
    expect(getIconSize(1535)).toBe(70);
  });

  it("returns 60 at lg breakpoint (≥1024, <1280)", () => {
    expect(getIconSize(1024)).toBe(60);
    expect(getIconSize(1279)).toBe(60);
  });

  it("returns 50 at md breakpoint (≥768, <1024)", () => {
    expect(getIconSize(768)).toBe(50);
    expect(getIconSize(1023)).toBe(50);
  });

  it("returns 40 below md breakpoint (<768)", () => {
    expect(getIconSize(767)).toBe(40);
    expect(getIconSize(320)).toBe(40);
  });
});
