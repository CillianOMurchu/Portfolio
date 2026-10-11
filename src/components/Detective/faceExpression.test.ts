import { describe, expect, it } from "vitest";
import { getExpression, NEAR_FACTOR } from "./faceExpression";

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
