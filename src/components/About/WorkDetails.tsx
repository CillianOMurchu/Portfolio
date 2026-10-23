// The written part of an expanded role: two indexed lists and the site link.
import { ArrowUpRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";

interface WorkDetailsProps {
  name: string;
  link?: string;
  responsibilities?: string[];
  keyFeatures?: string[];
}

const pad = (n: number) => String(n).padStart(2, "0");

// Renders **bold** segments; the only markdown used in experience-data.
const withBold = (text: string) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-medium text-strong">
        {part}
      </strong>
    ) : (
      part
    ),
  );

const DetailList: React.FC<{ title: string; items?: string[] }> = ({ title, items }) => {
  if (!items?.length) return null;
  return (
    <section>
      <h4 className="label mb-(--space-3)">{title}</h4>
      <ul className="m-0 list-none border-t p-0">
        {items.map((item, i) => (
          <li key={i} className="grid grid-cols-[2.5rem_1fr] border-b py-(--space-3)">
            <span className="font-mono text-2xs leading-6 text-faint">{pad(i + 1)}</span>
            <p className="m-0">{withBold(item)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const WorkDetails: React.FC<WorkDetailsProps> = ({ name, link, responsibilities, keyFeatures }) => (
  <div className="flex flex-col gap-(--space-6)">
    <DetailList title="Responsibilities" items={responsibilities} />
    <DetailList title="Key contributions" items={keyFeatures} />
    {link && (
      <Button
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
        className="self-start"
        rightIcon={<ArrowUpRight strokeWidth={1.5} strokeLinecap="square" />}
      >
        Visit {name}
      </Button>
    )}
  </div>
);
