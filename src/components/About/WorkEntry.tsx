// One role. Starts as a compact hairline row and opens by itself when its row
// reaches the reading line (upper half of the screen); the row is also a
// button that toggles it. The panel grows via grid-template-rows 0fr → 1fr.
import { useInView } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import type { Work } from "../../data/experience-data";
import { useScrollContainer } from "./useScrollContainer";
import { WorkDetails } from "./WorkDetails";
import { WorkVisual } from "./WorkVisual";

interface WorkEntryProps {
  work: Work;
  index: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const WorkEntry: React.FC<WorkEntryProps> = ({ work, index }) => {
  const rowRef = useRef<HTMLButtonElement>(null);
  const container = useScrollContainer(rowRef);
  const reachedReadingLine = useInView(rowRef, { root: container, margin: "0px 0px -45% 0px", once: true });
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const year = work.dates.match(/\d{4}/)?.[0] ?? "";

  useEffect(() => {
    if (reachedReadingLine) setOpen(true);
  }, [reachedReadingLine]);

  return (
    <article className="border-b">
      <h3 className="m-0">
        <button
          ref={rowRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-(--space-5) py-(--space-6) text-left transition-[padding] duration-(--dur-slow) ease-gallery hover:pl-[14px] focus-visible:shadow-focus focus-visible:outline-none md:grid-cols-[4rem_1fr_16rem_auto]"
        >
          <span className="font-mono text-2xs text-faint">{pad(index + 1)}</span>
          <span className="min-w-0">
            <span className="block font-display text-3xl leading-(--leading-tight) tracking-display text-strong">{work.name}</span>
            <span className="mt-1 block font-sans text-sm tracking-normal text-muted">{work.title}</span>
          </span>
          <span className="label hidden md:block">{work.dates}</span>
          <Plus
            strokeWidth={1.5}
            strokeLinecap="square"
            className={cn("size-5 self-center text-strong transition-[rotate,color] duration-(--dur-slow) ease-gallery group-hover:text-accent", open && "rotate-45")}
          />
        </button>
      </h3>

      <div
        id={panelId}
        className={cn("grid transition-[grid-template-rows] duration-(--dur-slower) ease-gallery", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
        // React 18 has no typed `inert`; it keeps the collapsed links out of the tab order.
        {...{ inert: open ? undefined : "" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "grid gap-(--space-7) pb-(--space-8) transition-[opacity,translate] duration-(--dur-slower) ease-gallery md:grid-cols-12 md:pl-[calc(4rem+var(--space-5))]",
              open ? "translate-y-0 opacity-100 delay-150" : "translate-y-6 opacity-0",
            )}
          >
            <p className="label md:hidden">{work.dates}</p>
            <div className={cn("md:col-span-6", index % 2 === 1 && "md:order-2 md:col-start-7")}>
              <WorkDetails name={work.name} link={work.link} responsibilities={work.responsibilities} keyFeatures={work.keyFeatures} />
            </div>
            <div className={cn("md:col-span-6", index % 2 === 1 ? "md:order-1 md:col-start-1 md:row-start-1" : "md:col-start-7")}>
              <WorkVisual image={work.projectImage} name={work.name} year={year} open={open} flip={index % 2 === 1} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
