// "02 — Work": a full-width rising title, then one expanding row per role.
import React, { useState } from "react";
import { experienceData } from "../../data/experience-data";
import { WorkEntry } from "./WorkEntry";
import { WorkTitle } from "./WorkTitle";

const years = experienceData.flatMap((work) => work.dates.match(/\d{4}/g) ?? []).map(Number);
const SPAN = `${Math.min(...years)}–${Math.max(...years)}`;

export const WorkHistory: React.FC = () => {
  // One role open at a time; opening another closes it.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section aria-labelledby="work-history-label" className="w-full py-(--space-9)">
      <div className="mb-(--space-6) flex items-baseline justify-between">
        <p id="work-history-label" className="label m-0">
          02 — Work
        </p>
        <p className="label m-0">
          {String(experienceData.length).padStart(2, "0")} roles · {SPAN}
        </p>
      </div>
      <WorkTitle />
      <div className="mx-auto mt-(--space-8) max-w-(--container-lg)">
        {experienceData.map((work, index) => (
          <WorkEntry
            key={work.id}
            work={work}
            index={index}
            open={openId === work.id}
            onToggle={() => setOpenId((current) => (current === work.id ? null : work.id))}
          />
        ))}
      </div>
    </section>
  );
};
