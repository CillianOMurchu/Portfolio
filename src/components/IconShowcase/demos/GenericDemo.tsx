import React from "react";
import type { IconDemoMeta } from "../../../data/icon-demos";
import DemoShell from "./components/DemoShell";

interface GenericDemoProps {
  name: string;
  meta: IconDemoMeta;
}

const PANEL = "border border-hairline bg-card";

const proficiency = (yearsUsed: number) => (yearsUsed >= 5 ? "★★★★★" : yearsUsed >= 3 ? "★★★★☆" : "★★★☆☆");

const GenericDemo: React.FC<GenericDemoProps> = ({ name, meta }) => (
  <DemoShell className="gap-6">
    <div className={`${PANEL} p-6`}>
      <p className="label mb-2">Cillian's take</p>
      <p className="font-display text-xl leading-snug text-strong italic">"{meta.personalNote}"</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className={`${PANEL} flex flex-col items-center gap-2 p-4`}>
        <span className="font-display text-3xl text-strong">{meta.yearsUsed}</span>
        <span className="text-center text-sm text-muted">years using {name}</span>
      </div>

      <div className={`${PANEL} flex flex-col items-center gap-2 p-4`}>
        <span className="text-3xl text-strong">{proficiency(meta.yearsUsed)}</span>
        <span className="text-center text-sm text-muted">proficiency</span>
      </div>
    </div>

    <div className={`${PANEL} p-4`}>
      <p className="label mb-2">Used in</p>
      <p className="text-sm text-body">{meta.tagline}</p>
    </div>
  </DemoShell>
);

export default GenericDemo;
