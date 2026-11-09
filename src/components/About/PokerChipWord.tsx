// Text whose o's are drawn as poker chips ("PokerStars"), alternating coral
// and blue like a mixed stack. Screen readers get the plain text.
//
// When the nearest `group` with aria-expanded="true" (WorkEntry's row button)
// opens, each chip flips in 3D about its vertical axis like a flicked coin: a
// few turns on a fast-start ease-out. Flips end on whole turns (a half turn
// would show the chip mirrored), so the instant, untransitioned snap back to 0
// on close is invisible. Transform only, so it runs on the compositor; the
// perspective() is in each transform so the near edge swells as it turns.
import React from "react";
import { cn } from "../../lib/utils";

const FLIP =
  "[transform:perspective(2em)_rotateY(0deg)] transition-transform duration-0 group-aria-expanded:duration-[1100ms] group-aria-expanded:ease-flick";

// Per chip: colour and flip. The second flick is a touch harder and a beat later.
const CHIP_STYLES = [
  "text-highlight motion-safe:group-aria-expanded:[transform:perspective(2em)_rotateY(1080deg)]",
  "text-accent motion-safe:group-aria-expanded:[transform:perspective(2em)_rotateY(1440deg)] group-aria-expanded:delay-75",
] as const;

// A chip the size of a lowercase o: solid disc, six notches round the rim, inner ring.
const Chip: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={cn("mx-[0.02em] inline-block size-[0.56em] align-baseline", FLIP, className)}>
    <circle cx="12" cy="12" r="11.5" fill="currentColor" />
    <circle cx="12" cy="12" r="9.25" fill="none" strokeWidth="3.5" strokeDasharray="4.84 4.84" className="stroke-card" />
    <circle cx="12" cy="12" r="5.5" fill="none" strokeWidth="1.25" className="stroke-card" />
  </svg>
);

export const PokerChipWord: React.FC<{ text: string }> = ({ text }) => {
  let chips = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(/(o)/).map((part, i) =>
          part === "o" ? <Chip key={i} className={CHIP_STYLES[chips++ % CHIP_STYLES.length]} /> : part,
        )}
      </span>
    </>
  );
};
