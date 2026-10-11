// Decorative figure that flies in from the left once its image has loaded and
// decoded, then rests against the left edge of the page area. Images come from
// scripts/optimize-character.mjs. Faded so it sits behind the content
// without competing with it.
//
// Render it as the last child of a `relative` page wrapper: it fills that
// wrapper's height as a column and the image sticks to the top of the
// scrolling <main>, so it stays put while the page scrolls.
import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import avif720 from "../../assets/character/character-720.avif";
import avif1080 from "../../assets/character/character-1080.avif";
import avif1440 from "../../assets/character/character-1440.avif";
import webp720 from "../../assets/character/character-720.webp";
import webp1080 from "../../assets/character/character-1080.webp";
import webp1440 from "../../assets/character/character-1440.webp";

/** Trimmed source size; the variants share its aspect ratio. */
const WIDTH = 547;
const HEIGHT = 1475;

// Rendered height is the page area (viewport minus 4rem navbar + 4rem footer).
const SIZES = `calc((100vh - 8rem) * ${WIDTH / HEIGHT})`;
const srcSet = (files: [string, number][]) => files.map(([src, h]) => `${src} ${Math.round((h * WIDTH) / HEIGHT)}w`).join(", ");

type Phase = "hidden" | "entering" | "done";

const Character: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("hidden");
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    const img = imgRef.current;
    if (!img || phase !== "hidden") return;
    // decode() rejects if the image was swapped mid-decode; showing it anyway is fine.
    img
      .decode()
      .catch(() => undefined)
      .then(() => setPhase("entering"));
  };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-1 select-none">
      <picture className="sticky top-0 block">
        <source
          type="image/avif"
          sizes={SIZES}
          srcSet={srcSet([
            [avif720, 720],
            [avif1080, 1080],
            [avif1440, 1440],
          ])}
        />
        <source
          type="image/webp"
          sizes={SIZES}
          srcSet={srcSet([
            [webp720, 720],
            [webp1080, 1080],
            [webp1440, 1440],
          ])}
        />
        <img
          ref={imgRef}
          src={webp1080}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          decoding="async"
          // React 18 drops camelCase fetchPriority (supported from React 19); the lowercase attribute passes through.
          {...{ fetchpriority: "low" }}
          draggable={false}
          onLoad={handleLoad}
          onTransitionEnd={() => setPhase("done")}
          className={cn(
            "block h-[calc(100dvh-8rem)] w-auto drop-shadow-rim",
            "transition-transform duration-800 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-opacity motion-reduce:duration-300",
            phase === "hidden"
              ? "-translate-x-[calc(100%+3rem)] motion-reduce:translate-x-0 motion-reduce:opacity-0"
              : "translate-x-0 opacity-20",
            phase !== "done" && "will-change-[translate]",
          )}
        />
      </picture>
    </div>
  );
};

export default Character;
