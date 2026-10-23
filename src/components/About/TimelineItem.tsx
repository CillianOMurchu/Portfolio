import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Reveal } from "../ui/Reveal";
import { scrollVariants } from "../../utils/animations";

interface TimelineWork {
  id: string | number;
  name: string;
  title: string;
  dates: string;
  projectImage?: string;
  link?: string;
  responsibilities?: string[];
  keyFeatures?: string[];
}

interface TimelineItemProps {
  work: TimelineWork;
  index: number;
}

interface TimelineSectionProps {
  title: string;
  items?: string[];
}

const pad = (n: number) => String(n).padStart(2, "0");

// Renders **bold** segments; the only markdown used in experience-data.
const withBold = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-medium text-strong">{part}</strong> : part
  );

const TimelineSection = ({ title, items }: TimelineSectionProps) => {
  if (!items?.length) return null;

  return (
    <section className="rule pt-(--space-4)">
      <h4 className="label mb-(--space-3)">{title}</h4>
      <m.ul className="m-0 list-none p-0" variants={scrollVariants.listContainer}>
        {items.map((item, i) => (
          <m.li key={i} variants={scrollVariants.listItem} className="grid grid-cols-[2.5rem_1fr] border-b py-(--space-3) last:border-b-0">
            <span className="font-mono text-2xs leading-6 text-faint">{pad(i + 1)}</span>
            <p className="m-0">{withBold(item)}</p>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
};

export const TimelineItem = ({ work, index }: TimelineItemProps) => {
  const heading = (
    <h3 className="m-0 flex items-baseline gap-(--space-3)">
      {work.name}
      {work.link && <ArrowUpRight strokeWidth={1.5} strokeLinecap="square" className="size-5 shrink-0 transition-colors duration-(--dur-base) group-hover:text-accent" />}
    </h3>
  );

  return (
    <Reveal variants={scrollVariants.card} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
      <Card padding="md" className="grid grid-cols-1 gap-(--space-6) sm:grid-cols-3">
        <div className="sm:col-span-1">
          <p className="label mb-(--space-4)">{pad(index + 1)} — {work.dates}</p>
          {work.projectImage && (
            <a href={work.link} target="_blank" rel="noopener noreferrer" title={`Visit ${work.name} website`} className="surface-marble block">
              <img
                src={work.projectImage}
                alt={`Screenshot of ${work.name}`}
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="mx-auto h-auto w-full object-cover grayscale transition-[filter] duration-(--dur-slow) ease-gallery hover:grayscale-0 sm:mx-0 sm:max-h-60 sm:w-auto"
              />
            </a>
          )}
        </div>

        <div className="flex flex-col gap-(--space-5) sm:col-span-2">
          <div>
            {work.link ? (
              <a href={work.link} target="_blank" rel="noopener noreferrer" title={`Visit ${work.name} website`} className="group no-underline">
                {heading}
              </a>
            ) : (
              heading
            )}
            <p className="m-0 mt-(--space-2) text-muted">{work.title}</p>
          </div>

          <TimelineSection title="Primary responsibilities" items={work.responsibilities} />
          <TimelineSection title="Key features & contributions" items={work.keyFeatures} />
        </div>
      </Card>
    </Reveal>
  );
};
