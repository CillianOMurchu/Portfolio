// A word whose first "i" wears a lightbulb instead of a dot ("Lighthouse").
// The visual uses a dotless ı; screen readers get the plain word. The bulb is
// off until the nearest `group` with aria-expanded="true" (WorkEntry's row
// button) opens, then it lights up.
import { Lightbulb } from "lucide-react";
import React from "react";

export const LightbulbWord: React.FC<{ word: string }> = ({ word }) => {
  const at = word.indexOf("i");
  if (at === -1) return <>{word}</>;

  return (
    <>
      <span className="sr-only">{word}</span>
      <span aria-hidden>
        {word.slice(0, at)}
        <span className="relative inline-block">
          ı
          <Lightbulb
            strokeWidth={2.25}
            className="absolute bottom-[0.7em] left-1/2 size-[0.38em] -translate-x-1/2 fill-transparent text-faint transition-[color,fill,filter] duration-(--dur-slow) ease-gallery group-hover:fill-highlight/35 group-hover:text-highlight group-hover:drop-shadow-[0_0_0.12em_var(--highlight)] group-aria-expanded:fill-highlight/35 group-aria-expanded:text-highlight group-aria-expanded:drop-shadow-[0_0_0.12em_var(--highlight)]"
          />
        </span>
        {word.slice(at + 1)}
      </span>
    </>
  );
};
