// The work timeline, one card per role from data/experience-data.
import React from "react";
import { experienceData } from "../../data/experience-data";
import { TimelineItem } from "./TimelineItem";

export const JobHistory: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col space-y-12 px-4 py-8">
    {experienceData.map((work, index) => (
      <TimelineItem key={work.id} work={work} index={index} />
    ))}
  </div>
);
