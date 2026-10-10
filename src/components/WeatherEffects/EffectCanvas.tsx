// Shared full-viewport canvas for the weather effects. Decorative only: hidden
// from assistive tech, click-through, and not rendered at all when the user
// prefers reduced motion.
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { startCanvasScene, type Scene } from "./canvasScene";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface EffectCanvasProps {
  /** Must be referentially stable (useCallback); a new function restarts the scene. */
  createScene: () => Scene;
  className?: string;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(REDUCED_MOTION_QUERY).matches
    : false;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

const EffectCanvas: React.FC<EffectCanvasProps> = ({ createScene, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reducedMotion || !canvas) return;
    return startCanvasScene(canvas, createScene());
  }, [reducedMotion, createScene]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-10 h-full w-full", className)}
    />
  );
};

export default EffectCanvas;
