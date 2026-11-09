// Card suits as small velvet gems, to sit beside the ruby diamond: a deep body
// that brightens toward the edges (velvet catching the light), a rim (dark on
// the light theme, light on the dark one, so black suits never sink into the
// page), a glossy highlight up and to the left, and a soft drop shadow. Hearts are ruby, spades and clubs
// onyx; colours are the --gem-* tokens in index.css.
import React, { useId } from "react";
import { cn } from "../../lib/utils";

export type Suit = "spade" | "club" | "heart";

const SHAPES: Record<Suit, React.ReactNode> = {
  heart: (
    <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  ),
  spade: (
    <path d="M12 1.5C9.2 5.6 3 9.2 3 14a4.6 4.6 0 0 0 7.7 3.4c-.3 1.8-1.1 3.3-2.7 4.6h8c-1.6-1.3-2.4-2.8-2.7-4.6A4.6 4.6 0 0 0 21 14c0-4.8-6.2-8.4-9-12.5z" />
  ),
  club: (
    <>
      <circle cx="12" cy="7" r="4.6" />
      <circle cx="6.6" cy="13.4" r="4.6" />
      <circle cx="17.4" cy="13.4" r="4.6" />
      <path d="M10.8 12h2.4l1.8 10H9z" />
    </>
  ),
};

const TONE: Record<Suit, "ruby" | "onyx"> = { heart: "ruby", spade: "onyx", club: "onyx" };

export const SuitGem: React.FC<{ suit: Suit; className?: string }> = ({ suit, className }) => {
  const id = useId().replace(/:/g, ""); // gradient/clip ids must be unique per instance
  const tone = TONE[suit];
  const shape = SHAPES[suit];

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("inline-block overflow-visible [filter:drop-shadow(0_0.04em_0.05em_var(--gem-shadow))]", className)}
    >
      <defs>
        <radialGradient id={`${id}-velvet`} cx="12" cy="11" r="12.5" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: `var(--gem-${tone})` }} />
          <stop offset="0.5" style={{ stopColor: `var(--gem-${tone}-deep)` }} />
          <stop offset="0.78" style={{ stopColor: `var(--gem-${tone})` }} />
          <stop offset="1" style={{ stopColor: `var(--gem-${tone}-hi)` }} />
        </radialGradient>
        <radialGradient id={`${id}-shine`} cx="8" cy="6" r="7.5" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: "var(--gem-shine)", stopOpacity: 0.8 }} />
          <stop offset="0.45" style={{ stopColor: "var(--gem-shine)", stopOpacity: 0.18 }} />
          <stop offset="1" style={{ stopColor: "var(--gem-shine)", stopOpacity: 0 }} />
        </radialGradient>
        <clipPath id={`${id}-clip`}>{shape}</clipPath>
      </defs>
      <g fill={`url(#${id}-velvet)`} style={{ stroke: `var(--gem-${tone}-rim)` }} strokeWidth="0.7">
        {shape}
      </g>
      <g clipPath={`url(#${id}-clip)`}>
        <ellipse cx="8.5" cy="7" rx="7" ry="5" fill={`url(#${id}-shine)`} />
      </g>
    </svg>
  );
};
