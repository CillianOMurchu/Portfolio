import React from "react";
import type { IconDemoMeta } from "../../../data/icon-demos";

interface GenericDemoProps {
  name: string;
  meta: IconDemoMeta;
}

const GenericDemo: React.FC<GenericDemoProps> = ({ name, meta }) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div
        className="rounded-xl p-6 border"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: `${meta.accentColor}33`,
        }}
      >
        <p className="text-sm uppercase tracking-widest mb-2" style={{ color: meta.accentColor }}>
          Cillian's take
        </p>
        <p className="text-gray-200 text-lg leading-relaxed italic">
          "{meta.personalNote}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-lg p-4 flex flex-col items-center gap-2 border"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span className="text-3xl font-bold" style={{ color: meta.accentColor }}>
            {meta.yearsUsed}
          </span>
          <span className="text-xs text-gray-400 text-center">years using {name}</span>
        </div>

        <div
          className="rounded-lg p-4 flex flex-col items-center gap-2 border"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          <span className="text-3xl font-bold" style={{ color: meta.accentColor }}>
            {meta.yearsUsed >= 5 ? "★★★★★" : meta.yearsUsed >= 3 ? "★★★★☆" : "★★★☆☆"}
          </span>
          <span className="text-xs text-gray-400 text-center">proficiency</span>
        </div>
      </div>

      <div
        className="rounded-lg p-4 border"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">used in</p>
        <p className="text-gray-300 text-sm">{meta.tagline}</p>
      </div>
    </div>
  );
};

export default GenericDemo;
