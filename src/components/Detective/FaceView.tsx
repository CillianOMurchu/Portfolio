// The face itself, drawn for a given expression. On mount the circle pops in,
// then the eyes, eyebrows and mouth grow in one after another. Each feature has
// its variants drawn on top of each other and cross-fades between them.
import React from "react";
import { cn } from "../../lib/utils";
import type { Expression, Gaze } from "./faceExpression";

interface FaceViewProps {
  expression: Expression;
  /** Eye offset towards the pointer, in viewBox units. */
  gaze?: Gaze;
  className?: string;
}

// Entry animation on the wrapping <g>s, so its delay never delays the inner
// expression transitions.
const GROW =
  "animate-in zoom-in fade-in fill-mode-backwards duration-400 origin-center [transform-box:fill-box] motion-reduce:animate-none";
const FADE = "transition-opacity duration-200 motion-reduce:transition-none";
const shown = (visible: boolean) => (visible ? "opacity-100" : "opacity-0");
// Short, decelerating follow so the eyes glide after the pointer instead of snapping.
const FOLLOW = "transition-transform duration-(--dur-base) ease-out motion-reduce:transition-none";
const AHEAD: Gaze = { x: 0, y: 0 };

const FaceView = React.forwardRef<SVGSVGElement, FaceViewProps>(({ expression, gaze = AHEAD, className }, ref) => {
  const happy = expression === "happy";
  const curious = expression === "curious";

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      role="img"
      aria-label="A round face"
      data-expression={expression}
      className={cn("aspect-square overflow-visible", className)}
    >
      <circle cx="100" cy="100" r="90" strokeWidth="4" className={cn(GROW, "fill-card stroke-strong")} />

      <g className="fill-none stroke-strong" strokeWidth="5" strokeLinecap="round">
        <g className={cn(GROW, "delay-400")} data-part="eyes">
          {/* CSS px on SVG children are viewBox units. */}
          <g className={FOLLOW} style={{ transform: `translate(${gaze.x}px, ${gaze.y}px)` }} data-part="gaze">
            <g className={cn(FADE, shown(!happy))} data-state="open">
              <circle cx="70" cy="88" r="7" className="fill-strong stroke-none" />
              <circle cx="130" cy="88" r="7" className="fill-strong stroke-none" />
            </g>
            <path d="M60 90 Q70 79 80 90 M120 90 Q130 79 140 90" className={cn(FADE, shown(happy))} data-state="closed" />
          </g>
        </g>

        <g className={cn(GROW, "delay-600")} data-part="brows">
          <path
            d="M58 63 L82 64 M118 64 L142 63"
            className={cn("transition-[translate] duration-200 motion-reduce:transition-none", curious && "-translate-y-[10px]")}
            data-state={curious ? "raised" : "rest"}
          />
        </g>

        <g className={cn(GROW, "delay-800")} data-part="mouth">
          <path d="M82 138 L118 138" className={cn(FADE, shown(expression === "neutral"))} data-state="line" />
          <ellipse cx="100" cy="139" rx="10" ry="12" className={cn(FADE, shown(curious))} data-state="o" />
          <path d="M74 128 Q100 156 126 128" className={cn(FADE, shown(happy))} data-state="smile" />
          <path d="M78 146 Q100 126 122 146" className={cn(FADE, shown(expression === "sad"))} data-state="frown" />
        </g>

        <g className={cn(happy ? "transition-none" : FADE, shown(happy), "fill-accent/40 stroke-none")} data-part="cheeks">
          <ellipse cx="52" cy="116" rx="14" ry="8" />
          <ellipse cx="148" cy="116" rx="14" ry="8" />
        </g>
      </g>
    </svg>
  );
});
FaceView.displayName = "FaceView";

export default FaceView;
