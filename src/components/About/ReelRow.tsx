// One details row as a slot reel: when the panel opens, the row's window rolls
// downward through blurred ghost lines (the list's other sentences) and stops on
// its real text. Each row gets a random spin length and start delay (picked
// once per mount), so rows run out of sync and stop in a random order. Once
// stopped it's ordinary text; ghosts are aria-hidden. Transform only.
import React, { useState } from "react";
import { cn } from "../../lib/utils";

const GHOST_LINES = 4; // each h-6 (1.5rem), so the strip starts 6rem up
const OPEN_DELAY_MS = 150; // matches the panel content's fade-in delay
const between = (min: number, max: number) => Math.round(min + Math.random() * (max - min));
const CLOSED_RESET_DELAY = "delay-(--dur-slower)"; // re-arm only after the panel has closed

interface ReelRowProps {
  index: number;
  ghosts: string[];
  open: boolean;
  children: React.ReactNode;
}

export const ReelRow: React.FC<ReelRowProps> = ({ index, ghosts, open, children }) => {
  // Random once per mount: lazy state keeps it stable across re-renders.
  const [timing] = useState(() => ({
    duration: between(1300, 2300),
    delay: OPEN_DELAY_MS + between(0, 200),
  }));
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "relative transition-transform",
          open ? "translate-y-0 ease-reel" : cn("duration-0 motion-safe:-translate-y-[6rem]", CLOSED_RESET_DELAY),
        )}
        style={
          open
            ? {
                transitionDuration: `${timing.duration}ms`,
                transitionDelay: `${timing.delay}ms`,
              }
            : undefined
        }
      >
        {children}
        <div aria-hidden className="absolute inset-x-0 top-full text-faint opacity-70 blur-[1.5px]">
          {Array.from({ length: GHOST_LINES }, (_, i) => (
            <p key={i} className="m-0 h-6 truncate leading-6">
              {ghosts[(index + i + 1) % ghosts.length]?.replace(/\*\*/g, "")}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
