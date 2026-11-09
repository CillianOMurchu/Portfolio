// A burst of tiny ruby shards that blow away on the wind. When the nearest
// `group` with aria-expanded="true" (WorkEntry's row button) opens, each shard
// waits until `startMs` (plus a small random stagger, so the shape comes apart
// gradually), then flies right and up, spinning and fading (`wind-dust` in
// index.css). Placement and paths are random once per mount. Transform/opacity only.
import React, { useState } from "react";
import { cn } from "../../lib/utils";

const SHARDS = 14;
const COLOURS = ["bg-(--gem-ruby)", "bg-(--gem-ruby-hi)", "bg-(--gem-ruby-deep)", "bg-(--gem-ruby)", "bg-(--gem-shine)"] as const; // ruby, with a white sparkle
const between = (min: number, max: number) => min + Math.random() * (max - min);

export const WindDust: React.FC<{ startMs: number }> = ({ startMs }) => {
  const [shards] = useState(() =>
    Array.from({ length: SHARDS }, (_, i) => {
      const size = `${between(0.035, 0.08)}em`;
      return {
        colour: COLOURS[i % COLOURS.length],
        style: {
          left: `calc(50% + ${between(-0.2, 0.2)}em)`,
          top: `calc(50% + ${between(-0.14, 0.14)}em)`,
          width: size,
          height: size,
          "--dx": `${between(0.5, 1.7)}em`,
          "--dy": `${between(-0.75, 0.05)}em`,
          "--rot": `${between(90, 540)}deg`,
          "--shard-at": `${Math.round(startMs + between(0, 240))}ms`,
        } as React.CSSProperties,
      };
    }),
  );

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {shards.map((shard, i) => (
        <span
          key={i}
          className={cn(
            "absolute opacity-0 motion-safe:group-aria-expanded:animate-[wind-dust_900ms_var(--ease-out)_var(--shard-at)_forwards]",
            shard.colour,
          )}
          style={shard.style}
        />
      ))}
    </span>
  );
};
