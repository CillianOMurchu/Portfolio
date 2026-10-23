// Generated (random) acting for the face while it blushes: shakes and the
// contented bounce, scaled by an intensity that builds the longer the pointer
// stays. Pure, so the randomness can be injected in tests. The fixed beats
// (take, breath, deflate) are in pleasurePoses.ts.
import type { Easing } from "framer-motion";

export type Random = () => number;

/** Peak shake tilt (degrees), sideways jolt and arc dip (viewBox units) at full intensity. */
export const MAX_SHAKE_TILT = 14;
export const MAX_SHAKE_SHIFT = 9;
const ARC_DIP_PER_DEGREE = 0.35;
/** How much the features drag against the head's motion (0 = rigid). */
export const FEATURE_DRAG = 0.3;
/** Peak bounce height (viewBox units) at full intensity. */
export const MAX_BOB = 10;

/** Intensity starts here on first touch and reaches 1 after RAMP_MS of hovering. */
export const START_INTENSITY = 0.55;
export const RAMP_MS = 8000;
/** Chance that the next fit is a deep breath rather than a shake. */
export const BREATH_CHANCE = 0.3;
/** Pause between fits (ms): long at first, shorter as delight builds. */
export const PAUSE_MS = { calm: [1400, 2600], excited: [400, 1100] } as const;

// Hits each extreme fast, then eases off it: a jolt, not a sway.
const JOLT: Easing = [0.2, 0.9, 0.3, 1];

const between = (random: Random, min: number, max: number) => min + random() * (max - min);
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const intensityAt = (hoveredMs: number) => lerp(START_INTENSITY, 1, Math.min(1, Math.max(0, hoveredMs / RAMP_MS)));

export const nextPause = (intensity: number, random: Random = Math.random) => {
  const t = (intensity - START_INTENSITY) / (1 - START_INTENSITY);
  const [min, max] = PAUSE_MS.calm.map((calm, i) => lerp(calm, PAUSE_MS.excited[i], t));
  return between(random, min, max);
};

export interface Shake {
  body: { rotate: number[]; x: number[]; y: number[] };
  features: { rotate: number[]; x: number[] };
  ease: Easing;
  duration: number;
}

/**
 * A giggle in a random formation: 4–7 jolts alternating sides, each a random
 * size and dying away. The head moves on arcs (it dips as it tilts) and the
 * features drag against it.
 */
export function makeShake(intensity: number, random: Random = Math.random): Shake {
  const jolts = 4 + Math.floor(random() * 4);
  const rotate = [0];
  const x = [0];
  for (let i = 0; i < jolts; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const decay = 1 - i / (jolts + 1);
    rotate.push(side * between(random, 0.5, 1) * MAX_SHAKE_TILT * intensity * decay);
    x.push(side * between(random, 0.3, 1) * MAX_SHAKE_SHIFT * intensity * decay);
  }
  rotate.push(0);
  x.push(0);
  return {
    body: { rotate, x, y: rotate.map((tilt) => Math.abs(tilt) * ARC_DIP_PER_DEGREE) },
    features: { rotate: rotate.map((tilt) => -tilt * FEATURE_DRAG), x: x.map((shift) => -shift * FEATURE_DRAG) },
    ease: JOLT,
    duration: 0.12 + jolts * between(random, 0.07, 0.09),
  };
}

export interface Bob {
  y: number[];
  scaleY: number[];
  scaleX: number[];
  rotate: number[];
  ease: Easing[];
  duration: number;
}

/**
 * Two contented bounces with a figure-of-eight sway: squash on landing, stretch
 * at the top, rising out of the landing and falling into the next (gravity).
 * The tempo drifts a little each time so it never ticks like a metronome.
 */
export function makeBob(intensity: number, random: Random = Math.random): Bob {
  const height = MAX_BOB * intensity;
  const sway = 3 * intensity;
  return {
    y: [0, -height, 0, -height * 0.8, 0],
    scaleY: [0.96, 1.03, 0.96, 1.02, 0.96],
    scaleX: [1.03, 0.98, 1.03, 0.99, 1.03],
    rotate: [0, sway, 0, -sway, 0],
    ease: ["easeOut", "easeIn", "easeOut", "easeIn"],
    duration: between(random, 1.5, 1.9) - 0.3 * (intensity - START_INTENSITY),
  };
}
