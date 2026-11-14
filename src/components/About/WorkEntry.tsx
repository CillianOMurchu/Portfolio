// One role: a compact hairline row (a button) over a panel that opens instantly
// (no animation). Open state lives in WorkHistory, which keeps
// one role open at a time. An open row keeps its hover look (indent, logo in
// colour, accent ×) via aria-expanded.
import { Plus } from "lucide-react";
import React, { useEffect, useId, useRef } from "react";
import { cn } from "../../lib/utils";
import type { Work } from "../../data/experience-data";
import { scrollIntoMain } from "./scrollIntoMain";
import { WorkDetails } from "./WorkDetails";

interface WorkEntryProps {
  work: Work;
  index: number;
  open: boolean;
  onToggle: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const WorkEntry: React.FC<WorkEntryProps> = ({ work, index, open, onToggle }) => {
  const panelId = useId();
  const articleRef = useRef<HTMLElement>(null);

  // On open, scroll the role into view on the next frame, once its panel is laid out.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (articleRef.current) scrollIntoMain(articleRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <article ref={articleRef} className="border-b">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-(--space-5) py-(--space-6) text-left transition-[padding] duration-(--dur-slow) ease-gallery hover:pl-[14px] aria-expanded:pl-[14px] focus-visible:shadow-focus focus-visible:outline-none md:grid-cols-[4rem_1fr_16rem_auto]"
        >
          <span className="font-mono text-2xs text-highlight-text">{pad(index + 1)}</span>
          <span className="flex min-w-0 flex-col items-start gap-(--space-3) sm:flex-row sm:items-center sm:gap-(--space-5)">
            {work.logo && (
              // Mounted on a white plate so the wordmark reads in dark mode too; greyscale until hovered or open.
              <span className="grid shrink-0 place-items-center border bg-(--slate-0) px-(--space-3) py-(--space-2)">
                <img
                  src={work.logo}
                  alt=""
                  height={64}
                  className="block h-8 w-auto grayscale transition-[filter] duration-(--dur-slow) ease-gallery group-hover:grayscale-0 group-aria-expanded:grayscale-0"
                />
              </span>
            )}
            <span className="min-w-0">
              <span className="block font-display text-3xl leading-(--leading-tight) tracking-display text-strong transition-colors duration-(--dur-slow) ease-gallery group-hover:text-accent-text group-aria-expanded:text-accent-text">
                {work.displayName ?? work.name}
              </span>
              <span className="mt-1 block font-sans text-sm tracking-normal text-muted">{work.title}</span>
            </span>
          </span>
          <span className="label hidden md:block">{work.dates}</span>
          <Plus
            strokeWidth={1.5}
            strokeLinecap="square"
            className={cn(
              "size-5 self-center text-strong transition-[rotate,color] duration-(--dur-slow) ease-gallery group-hover:text-accent group-aria-expanded:text-accent",
              open && "rotate-45",
            )}
          />
        </button>
      </h3>

      <div id={panelId} hidden={!open}>
        <div className="grid gap-(--space-7) pb-(--space-8) md:grid-cols-12 md:pl-[calc(4rem+var(--space-5))]">
          <p className="label md:hidden">{work.dates}</p>
          <div className="md:col-span-9">
            <WorkDetails name={work.name} link={work.link} responsibilities={work.responsibilities} keyFeatures={work.keyFeatures} />
          </div>
        </div>
      </div>
    </article>
  );
};
