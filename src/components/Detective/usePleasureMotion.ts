// Directs the face while `active` (blushing): a take on first touch, then a
// continuous bounce plus random fits (giggling shakes, the odd deep sigh) that
// build in intensity the longer it lasts. On release it deflates back to rest.
import { animate, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, type RefObject } from "react";
import { BREATH_CHANCE, intensityAt, makeBob, makeShake, nextPause } from "./pleasureMotion";
import { BREATH, DEFLATE, TAKE, type Beat } from "./pleasurePoses";

export interface FaceMotionRefs {
  bob: RefObject<SVGGElement>;
  body: RefObject<SVGGElement>;
  features: RefObject<SVGGElement>;
}

const REST = { rotate: 0, x: 0, y: 0, scaleX: 1, scaleY: 1 };
// Bounce and fits pivot near the chin, like a head on a neck.
const CHIN = { originX: 0.5, originY: 0.92 };
// The features lag the head by a beat.
const FEATURE_DELAY = 0.05;

export function usePleasureMotion(refs: FaceMotionRefs, active: boolean) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const [bob, body, features] = [refs.bob.current, refs.body.current, refs.features.current];
    if (!bob || !body || !features || !active || reduceMotion) return;

    const start = performance.now();
    const intensity = () => intensityAt(performance.now() - start);
    const running = new Set<AnimationPlaybackControls>();
    let stopped = false;
    let pause: number | undefined;

    const play = (...animations: AnimationPlaybackControls[]) => {
      animations.forEach((animation) => {
        running.add(animation);
        animation.finished.then(() => running.delete(animation));
      });
      return Promise.all(animations.map((animation) => animation.finished));
    };
    const playBeat = ({ body: bodyKeys, features: featureKeys, times, ease, duration }: Beat) =>
      play(
        animate(body, bodyKeys, { duration, times, ease }),
        animate(features, featureKeys, { duration, times, ease, delay: FEATURE_DELAY }),
      );

    const bounce = () => {
      if (stopped) return;
      const { duration, ease, ...keys } = makeBob(intensity());
      play(animate(bob, keys, { duration, ease })).then(bounce);
    };

    const fit = () => {
      if (stopped) return;
      let beat: Promise<unknown>;
      if (Math.random() < BREATH_CHANCE) {
        beat = playBeat(BREATH);
      } else {
        const { body: bodyKeys, features: featureKeys, ease, duration } = makeShake(intensity());
        beat = play(
          animate(body, bodyKeys, { duration, ease }),
          animate(features, featureKeys, { duration, ease, delay: FEATURE_DELAY }),
        );
      }
      beat.then(() => {
        if (!stopped) pause = window.setTimeout(fit, nextPause(intensity()));
      });
    };

    animate(bob, CHIN, { duration: 0 });
    animate(body, CHIN, { duration: 0 });
    bounce();
    playBeat(TAKE).then(() => {
      if (!stopped) pause = window.setTimeout(fit, nextPause(intensity()));
    });

    return () => {
      stopped = true;
      window.clearTimeout(pause);
      running.forEach((animation) => animation.stop());
      animate(bob, REST, { duration: 0.4, ease: "easeOut" });
      animate(body, DEFLATE.body, { duration: DEFLATE.duration, times: DEFLATE.times, ease: DEFLATE.ease });
      animate(features, DEFLATE.features, { duration: DEFLATE.duration, times: DEFLATE.times, ease: DEFLATE.ease, delay: FEATURE_DELAY });
    };
  }, [refs, active, reduceMotion]);
}
