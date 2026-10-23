// Two depth layers for one role. Far: a marble slab holding a ghost of the
// photo and the start year, drifting with the scroll so it lags the page.
// Near: the photo as a mounted print, moving against the scroll so it runs
// ahead of the page. It opens out from a small window when the role expands.
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "../../lib/utils";
import { useScrollContainer } from "./useScrollContainer";

interface WorkVisualProps {
  image: string;
  name: string;
  year: string;
  open: boolean;
  flip: boolean;
}

export const WorkVisual: React.FC<WorkVisualProps> = ({ image, name, year, open, flip }) => {
  const ref = useRef<HTMLDivElement>(null);
  const container = useScrollContainer(ref);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  const far = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const near = useTransform(scrollYProgress, [0, 1], [110, -110]);

  return (
    <div ref={ref} aria-hidden className="relative isolate h-[28rem] md:h-[36rem]">
      <m.div
        style={reduce ? undefined : { y: far }}
        className={cn("surface-marble absolute top-[8%] bottom-[8%] -z-1 w-[78%] overflow-hidden", flip ? "left-0" : "right-0")}
      >
        <img
          src={image}
          alt=""
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
          className="size-full object-cover opacity-15 mix-blend-multiply blur-[2px] grayscale dark:opacity-25 dark:mix-blend-screen"
        />
        <span className={cn("absolute bottom-[-0.12em] font-display text-6xl leading-none text-strong/10 italic", flip ? "right-[0.1em]" : "left-[0.1em]")}>
          {year}
        </span>
      </m.div>

      <m.figure
        style={reduce ? undefined : { y: near }}
        className={cn(
          "absolute top-[18%] m-0 w-[58%] bg-card p-3 shadow-lift transition-[clip-path] delay-150 duration-(--dur-slower) ease-gallery",
          flip ? "right-0" : "left-0",
          open ? "[clip-path:inset(0)]" : "[clip-path:inset(38%_38%_38%_38%)]",
        )}
      >
        <img src={image} alt="" width={800} height={800} loading="lazy" decoding="async" className="block aspect-square w-full object-cover grayscale" />
        <figcaption className="label mt-3">{name}</figcaption>
      </m.figure>
    </div>
  );
};
