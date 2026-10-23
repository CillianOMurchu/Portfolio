import { describe, expect, it } from "vitest";
import {
  FEATURE_DRAG,
  intensityAt,
  makeBob,
  makeShake,
  MAX_BOB,
  MAX_SHAKE_SHIFT,
  MAX_SHAKE_TILT,
  nextPause,
  PAUSE_MS,
  RAMP_MS,
  START_INTENSITY,
} from "./pleasureMotion";
import { BREATH, DEFLATE, TAKE } from "./pleasurePoses";

/** Deterministic stand-in for Math.random cycling through the given values. */
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};
const atRest = (keys: number[], rest = 0) => keys[0] === rest && keys.at(-1) === rest;

describe("intensityAt", () => {
  it("starts gentle and builds to full over RAMP_MS, then holds", () => {
    expect(intensityAt(0)).toBe(START_INTENSITY);
    expect(intensityAt(RAMP_MS / 2)).toBeGreaterThan(START_INTENSITY);
    expect(intensityAt(RAMP_MS)).toBe(1);
    expect(intensityAt(RAMP_MS * 5)).toBe(1);
  });
});

describe("nextPause", () => {
  it("is long when calm and shorter when excited", () => {
    expect(nextPause(START_INTENSITY, () => 0)).toBe(PAUSE_MS.calm[0]);
    expect(nextPause(1, () => 1)).toBe(PAUSE_MS.excited[1]);
    expect(nextPause(1, () => 0.5)).toBeLessThan(nextPause(START_INTENSITY, () => 0.5));
  });
});

describe("makeShake", () => {
  it("starts and ends at rest", () => {
    const { body, features } = makeShake(1, sequence(0.5));
    expect(atRest(body.rotate) && atRest(body.x) && atRest(body.y)).toBe(true);
    expect(atRest(features.rotate) && atRest(features.x)).toBe(true);
  });

  it("has 4–7 jolts that alternate sides within the limits", () => {
    for (const seed of [0, 0.3, 0.99]) {
      const { body } = makeShake(1, sequence(seed, 0.7, 0.2));
      const jolts = body.rotate.slice(1, -1);
      expect(jolts.length).toBeGreaterThanOrEqual(4);
      expect(jolts.length).toBeLessThanOrEqual(7);
      jolts.forEach((tilt, i) => {
        expect(Math.sign(tilt)).toBe(i % 2 === 0 ? 1 : -1);
        expect(Math.abs(tilt)).toBeLessThanOrEqual(MAX_SHAKE_TILT);
      });
      body.x.forEach((shift) => expect(Math.abs(shift)).toBeLessThanOrEqual(MAX_SHAKE_SHIFT));
    }
  });

  it("moves on arcs: the head dips as it tilts, never rises", () => {
    const { body } = makeShake(1, sequence(0.6));
    body.y.forEach((dip, i) => expect(dip).toBeCloseTo(Math.abs(body.rotate[i]) * 0.35));
  });

  it("drags the features against the head", () => {
    const { body, features } = makeShake(1, sequence(0.4));
    features.rotate.forEach((tilt, i) => expect(tilt).toBeCloseTo(-body.rotate[i] * FEATURE_DRAG));
  });

  it("is bigger at full intensity", () => {
    const peak = (intensity: number) => Math.max(...makeShake(intensity, sequence(0.5)).body.rotate.map(Math.abs));
    expect(peak(1)).toBeGreaterThan(peak(START_INTENSITY));
  });
});

describe("makeBob", () => {
  it("loops seamlessly: ends where it starts", () => {
    const bob = makeBob(1, sequence(0.5));
    for (const keys of [bob.y, bob.scaleY, bob.scaleX, bob.rotate]) expect(keys.at(-1)).toBe(keys[0]);
  });

  it("squashes on landing and stretches at the top", () => {
    const { y, scaleY } = makeBob(1, sequence(0.5));
    expect(Math.min(...y)).toBe(-MAX_BOB);
    expect(scaleY[0]).toBeLessThan(1);
    expect(scaleY[1]).toBeGreaterThan(1);
  });

  it("speeds up as delight builds", () => {
    expect(makeBob(1, () => 0.5).duration).toBeLessThan(makeBob(START_INTENSITY, () => 0.5).duration);
  });
});

describe("beats", () => {
  it.each([
    ["TAKE", TAKE],
    ["BREATH", BREATH],
    ["DEFLATE", DEFLATE],
  ])("%s starts and ends at rest with matching timings", (_, beat) => {
    for (const [prop, keys] of Object.entries({ ...beat.body, ...beat.features })) {
      expect(keys).toHaveLength(beat.times.length);
      expect(atRest(keys, prop.startsWith("scale") ? 1 : 0)).toBe(true);
    }
    expect(beat.ease).toHaveLength(beat.times.length - 1);
  });

  it("TAKE squashes before it stretches (anticipation)", () => {
    const squash = TAKE.body.scaleY.indexOf(Math.min(...TAKE.body.scaleY));
    const stretch = TAKE.body.scaleY.indexOf(Math.max(...TAKE.body.scaleY));
    expect(squash).toBeLessThan(stretch);
  });

  it("BREATH releases faster than it inhales", () => {
    const [, anticipate, full, hold, release] = BREATH.times;
    expect(release - hold).toBeLessThan(full - anticipate);
  });
});
