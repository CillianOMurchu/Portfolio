import React from "react";
import type { IconDemoMeta } from "../../../data/icon-demos";
import DemoShell from "./components/DemoShell";
import { GHOST_BG, SUBTLE_BORDER } from "./constants";

interface GenericDemoProps {
  name: string;
  meta: IconDemoMeta;
}

const PANEL_STYLE: React.CSSProperties = { background: GHOST_BG, borderColor: SUBTLE_BORDER };

const proficiency = (yearsUsed: number) => (yearsUsed >= 5 ? "★★★★★" : yearsUsed >= 3 ? "★★★★☆" : "★★★☆☆");

const GenericDemo: React.FC<GenericDemoProps> = ({ name, meta }) => (
  <DemoShell className="gap-6">
    <div className="border p-6" style={PANEL_STYLE}>
      <p className="label mb-2">Cillian's take</p>
      <p className="font-display text-xl leading-snug text-strong italic">"{meta.personalNote}"</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center gap-2 border p-4" style={PANEL_STYLE}>
        <span className="font-display text-3xl text-strong">{meta.yearsUsed}</span>
        <span className="text-center text-sm text-muted">years using {name}</span>
      </div>

      <div className="flex flex-col items-center gap-2 border p-4" style={PANEL_STYLE}>
        <span className="text-3xl text-strong">{proficiency(meta.yearsUsed)}</span>
        <span className="text-center text-sm text-muted">proficiency</span>
      </div>
    </div>

    <div className="border p-4" style={PANEL_STYLE}>
      <p className="label mb-2">Used in</p>
      <p className="text-sm text-body">{meta.tagline}</p>
    </div>
  </DemoShell>
);

export default GenericDemo;
