// Interactive face: watches the pointer and updates the expression (curious
// when it comes close, happy when it's on the face, neutral otherwise).
import React, { useEffect, useRef, useState } from "react";
import FaceView from "./FaceView";
import { FACE_RADIUS_RATIO, getExpression, type Expression } from "./faceExpression";

interface FaceProps {
  className?: string;
}

const Face: React.FC<FaceProps> = ({ className }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [expression, setExpression] = useState<Expression>("neutral");

  useEffect(() => {
    const track = (event: PointerEvent) => {
      const svg = ref.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2));
      setExpression(getExpression(distance, (box.width / 2) * FACE_RADIUS_RATIO));
    };
    // Pointer left the window (relatedTarget is null): relax.
    const leave = (event: PointerEvent) => event.relatedTarget === null && setExpression("neutral");

    window.addEventListener("pointermove", track, { passive: true });
    window.addEventListener("pointerdown", track, { passive: true }); // taps on touch screens
    window.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", track);
      window.removeEventListener("pointerdown", track);
      window.removeEventListener("pointerout", leave);
    };
  }, []);

  return <FaceView ref={ref} expression={expression} className={className} />;
};

export default Face;
