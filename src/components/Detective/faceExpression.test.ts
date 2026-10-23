import { describe, expect, it } from "vitest";
import { GAZE_FALLOFF, getExpression, getGaze, MAX_GAZE, NEAR_FACTOR, nextExpression } from "./faceExpression";

const R = 100;

describe("getExpression", () => {
  it("is happy with the pointer on the face, edge included", () => {
    expect(getExpression(0, R)).toBe("happy");
    expect(getExpression(R, R)).toBe("happy");
  });

  it("is curious just outside the face, up to the near distance", () => {
    expect(getExpression(R + 1, R)).toBe("curious");
    expect(getExpression(R * NEAR_FACTOR, R)).toBe("curious");
  });

  it("is neutral further away", () => {
    expect(getExpression(R * NEAR_FACTOR + 1, R)).toBe("neutral");
    expect(getExpression(10_000, R)).toBe("neutral");
  });

  it("scales with the face size", () => {
    expect(getExpression(150, 100)).toBe("curious");
    expect(getExpression(150, 200)).toBe("happy");
  });
});

describe("nextExpression", () => {
  it("follows proximity when not blushing or sulking", () => {
    expect(nextExpression("curious", "neutral")).toBe("curious");
    expect(nextExpression("neutral", "curious")).toBe("neutral");
  });

  it("sulks when the pointer leaves the face after a blush", () => {
    expect(nextExpression("curious", "happy")).toBe("sad");
    expect(nextExpression("neutral", "happy")).toBe("sad");
  });

  it("keeps sulking while the pointer stays off the face", () => {
    expect(nextExpression("curious", "sad")).toBe("sad");
    expect(nextExpression("neutral", "sad")).toBe("sad");
  });

  it("always blushes as soon as the pointer touches the face", () => {
    expect(nextExpression("happy", "neutral")).toBe("happy");
    expect(nextExpression("happy", "sad")).toBe("happy");
  });
});

describe("getGaze", () => {
  it("rests at the centre when the pointer is on the centre", () => {
    expect(getGaze(0, 0)).toEqual({ x: 0, y: 0 });
  });

  it("looks towards the pointer", () => {
    const right = getGaze(100, 0);
    expect(right.x).toBeGreaterThan(0);
    expect(right.y).toBeCloseTo(0);
    const upLeft = getGaze(-50, -50);
    expect(upLeft.x).toBeLessThan(0);
    expect(upLeft.y).toBeLessThan(0);
    expect(upLeft.x).toBeCloseTo(upLeft.y);
  });

  it("moves further for distant pointers but never past MAX_GAZE", () => {
    const near = Math.hypot(...Object.values(getGaze(GAZE_FALLOFF, 0)));
    const far = Math.hypot(...Object.values(getGaze(100_000, 0)));
    expect(near).toBeCloseTo(MAX_GAZE / 2);
    expect(far).toBeGreaterThan(near);
    expect(far).toBeLessThanOrEqual(MAX_GAZE);
  });
});
