// The written part of an expanded role: two indexed lists and the site link.
// `effect` adds a panel flourish when the role opens: "reels" spins each row in
// like a slot reel.
import { ArrowUpRight } from "lucide-react";
import React from "react";
import type { PanelEffect } from "../../data/experience-data";
import { Button } from "../ui/Button";
import { ReelRow } from "./ReelRow";

interface WorkDetailsProps {
  name: string;
  link?: string;
  responsibilities?: string[];
  keyFeatures?: string[];
  effect?: PanelEffect;
  open?: boolean;
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

interface DetailListProps {
  title: string;
  items: string[];
  effect?: PanelEffect;
  open: boolean;
  offset: number; // index of this list's first row across both lists
  ghosts: string[]; // every sentence, for the reels' blurred ghost lines
}

const DetailList: React.FC<DetailListProps> = ({ title, items, effect, open, offset, ghosts }) => {
  if (!items.length) return null;
  return (
    <section>
      <h4 className="label mb-(--space-3)">{title}</h4>
      <ul className="m-0 list-none border-t p-0">
        {items.map((item, i) => {
          const text = <p className="m-0">{withBold(item)}</p>;
          return (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] border-b py-(--space-3)">
              <span className="font-mono text-2xs leading-6 text-highlight-text">{pad(i + 1)}</span>
              {effect === "reels" ? (
                <ReelRow index={offset + i} ghosts={ghosts} open={open}>
                  {text}
                </ReelRow>
              ) : (
                text
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export const WorkDetails: React.FC<WorkDetailsProps> = ({ name, link, responsibilities = [], keyFeatures = [], effect, open = false }) => {
  const ghosts = [...responsibilities, ...keyFeatures];
  const shared = { effect, open, ghosts };
  return (
    <div className="flex flex-col gap-(--space-6)">
      <DetailList title="Responsibilities" items={responsibilities} offset={0} {...shared} />
      <DetailList title="Key contributions" items={keyFeatures} offset={responsibilities.length} {...shared} />
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
};
