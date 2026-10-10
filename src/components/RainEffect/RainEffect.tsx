/**
 * Decorative full-viewport rain, drawn on a single canvas. Clicks pass through it,
 * and it renders nothing when the user prefers reduced motion.
 *
 * Usage:
 *   <RainEffect />                                  // light rain
 *   <RainEffect intensity={2} wind={-120} />        // heavier, blowing left
 *   <RainEffect color="rgba(255,255,255,0.4)" className="z-0" />
 */
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { startRain } from "./rainLoop";

const DEFAULT_INTENSITY = 1; // ~207 drops on a 1920×1080 viewport
const DEFAULT_COLOR = "rgba(174,194,224,0.5)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface RainEffectProps {
  /** Drops per 10,000 px² of viewport (capped at 500 drops in total). */
  intensity?: number;
  /** Horizontal drift in px/s; positive blows right. */
  wind?: number;
  /** Any canvas strokeStyle colour. */
  color?: string;
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

const RainEffect: React.FC<RainEffectProps> = ({
  intensity = DEFAULT_INTENSITY,
  wind = 0,
  color = DEFAULT_COLOR,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reducedMotion || !canvas) return;
    return startRain(canvas, { intensity, wind, color });
  }, [reducedMotion, intensity, wind, color]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-10 h-full w-full", className)}
    />
  );
};

export default RainEffect;
