// Interactive face: watches the pointer, follows it with its eyes and updates
// the expression (curious when it comes close, happy when it's on the face,
// neutral otherwise). Leaving the face after a blush makes it frown for
// SULK_MS, unless the pointer comes back first.
import React, { useEffect, useRef, useState } from "react";
import FaceView from "./FaceView";
import { FACE_RADIUS_RATIO, getExpression, getGaze, nextExpression, SULK_MS, type Expression, type Gaze } from "./faceExpression";

const VIEWBOX_SIZE = 200;
const REST: Gaze = { x: 0, y: 0 };

interface FaceProps {
  className?: string;
}

const Face: React.FC<FaceProps> = ({ className }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [expression, setExpression] = useState<Expression>("neutral");
  const [gaze, setGaze] = useState<Gaze>(REST);
  // Latest proximity-only expression, for when the sulk ends.
  const proximity = useRef<Exclude<Expression, "sad">>("neutral");

  // Starts when the face turns sad; returning to happy changes the expression and cancels it.
  useEffect(() => {
    if (expression !== "sad") return;
    const timer = window.setTimeout(() => setExpression(proximity.current), SULK_MS);
    return () => window.clearTimeout(timer);
  }, [expression]);

  useEffect(() => {
    const track = (event: PointerEvent) => {
      const svg = ref.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      proximity.current = getExpression(Math.hypot(dx, dy), (box.width / 2) * FACE_RADIUS_RATIO);
      setExpression((current) => nextExpression(proximity.current, current));
      const toViewBox = VIEWBOX_SIZE / box.width;
      setGaze(getGaze(dx * toViewBox, dy * toViewBox));
    };
    // Pointer left the window (relatedTarget is null): relax and look ahead.
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return;
      proximity.current = "neutral";
      setExpression((current) => nextExpression("neutral", current));
      setGaze(REST);
    };

    window.addEventListener("pointermove", track, { passive: true });
    window.addEventListener("pointerdown", track, { passive: true }); // taps on touch screens
    window.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerdown", track);
      window.removeEventListener("pointerout", leave);
    };
  }, []);

  return <FaceView ref={ref} expression={expression} gaze={gaze} className={className} />;
};

export default Face;
