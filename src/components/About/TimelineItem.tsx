import { m } from "framer-motion";
import { Cog, Lightbulb, type LucideIcon } from "lucide-react";
import { Card } from "../ui/card";
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
  icon: LucideIcon;
  title: string;
  bullet: string;
  items?: string[];
}

// Renders **bold** segments; the only markdown used in experience-data.
const withBold = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
  );

const TimelineSection = ({ icon: Icon, title, bullet, items }: TimelineSectionProps) => {
  if (!items?.length) return null;

  return (
    <section className="rounded-lg border bg-black/20 p-4">
      <h4 className="mb-3 flex items-center gap-2 border-b pb-2 font-semibold text-primary">
        <Icon className="size-4" />
        {title}
      </h4>
      <m.ul className="space-y-3" variants={scrollVariants.listContainer}>
        {items.map((item, i) => (
          <m.li key={i} variants={scrollVariants.listItem} className="flex gap-2 text-secondary-foreground">
            <span className="shrink-0 text-lg font-extrabold leading-6 text-primary">{bullet}</span>
            <p>{withBold(item)}</p>
          </m.li>
        ))}
      </m.ul>
    </section>
  );
};

export const TimelineItem = ({ work, index }: TimelineItemProps) => {
  const heading = (
    <h3 className="text-2xl font-extrabold text-primary transition-colors group-hover:text-accent-foreground group-hover:underline">
      {work.name}
    </h3>
  );

  return (
    <Reveal variants={scrollVariants.card} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
      <Card className="grid grid-cols-1 gap-6 bg-card/40 p-6 text-base ring-primary/30 backdrop-blur-md sm:grid-cols-3">
        <div className="sm:col-span-1">
          {work.projectImage && (
            <a href={work.link} target="_blank" rel="noopener noreferrer" title={`Visit ${work.name} website`}>
              <img
                src={work.projectImage}
                alt={`Screenshot of ${work.name}`}
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="mx-auto h-auto w-full rounded-lg object-cover shadow-xl transition hover:opacity-80 hover:shadow-primary/30 sm:mx-0 sm:max-h-60 sm:w-auto"
              />
            </a>
          )}
        </div>

        <div className="flex flex-col gap-6 sm:col-span-2">
          <div>
            {work.link ? (
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${work.name} website`}
                className="group"
              >
                {heading}
              </a>
            ) : (
              heading
            )}
            <p className="text-lg font-semibold text-foreground">
              {work.title} <span className="font-normal text-muted-foreground">({work.dates})</span>
            </p>
          </div>

          <TimelineSection icon={Lightbulb} title="Primary Responsibilities" bullet="•" items={work.responsibilities} />
          <TimelineSection icon={Cog} title="Key Features & Contributions" bullet="»" items={work.keyFeatures} />
        </div>
      </Card>
    </Reveal>
  );
};
