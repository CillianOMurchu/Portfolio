// Fixed acting beats for the face, as keyframes. "body" pivots near the chin;
// "features" (eyes, brows, mouth, cheeks) ride inside it and act slightly late
// or with a bit of drag. All start and end at rest so beats chain cleanly.
import type { Easing } from "framer-motion";

export interface Beat {
  body: Record<string, number[]>;
  features: Record<string, number[]>;
  times: number[];
  ease: Easing[];
  duration: number;
}

const SNAP: Easing = [0.2, 0.9, 0.3, 1];

/**
 * The take on first touch: squash down in anticipation, pop up into a stretch
 * (big enough to break out of the Ó a little), overshoot once, settle.
 */
export const TAKE: Beat = {
  body: {
    scaleY: [1, 0.84, 1.16, 0.96, 1],
    scaleX: [1, 1.12, 0.91, 1.03, 1],
    y: [0, 5, -12, 1, 0],
  },
  features: { y: [0, 3, -5, 1, 0] },
  times: [0, 0.2, 0.48, 0.76, 1],
  ease: ["easeOut", SNAP, "easeInOut", "easeOut"],
  duration: 0.6,
};

/**
 * A contented sigh: a small exhale (anticipation), slow inhale stretching tall
 * and slim with the brows and eyes lifting, a short hold, a quicker release
 * that overshoots into a squash, then a soft settle.
 */
export const BREATH: Beat = {
  body: {
    scaleY: [1, 0.97, 1.13, 1.13, 0.94, 1.02, 1],
    scaleX: [1, 1.02, 0.95, 0.95, 1.05, 0.99, 1],
    y: [0, 1.5, -6, -6, 2, 0, 0],
  },
  features: { y: [0, 0.5, -4, -4, 1.5, 0, 0] },
  times: [0, 0.1, 0.5, 0.6, 0.78, 0.9, 1],
  ease: ["easeOut", "easeInOut", "linear", "easeIn", "easeOut", "easeInOut"],
  duration: 3,
};

/** On leaving the face: the delight drains out — sink and squash, then recover slowly. */
export const DEFLATE: Beat = {
  body: {
    scaleY: [1, 0.92, 0.96, 1],
    scaleX: [1, 1.05, 1.02, 1],
    y: [0, 6, 3, 0],
    rotate: [0, 0, 0, 0],
    x: [0, 0, 0, 0],
  },
  features: { y: [0, 2, 1, 0], rotate: [0, 0, 0, 0], x: [0, 0, 0, 0] },
  times: [0, 0.3, 0.6, 1],
  ease: ["easeOut", "easeInOut", "easeInOut"],
  duration: 1.4,
};
