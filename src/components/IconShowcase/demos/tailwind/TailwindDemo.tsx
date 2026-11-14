import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { DEFAULT_UTILITIES, UTILITIES } from "./constants";
import {
  CLASS_LIST, CLASS_PANEL, CLASS_QUOTE, PREVIEW_BADGE, PREVIEW_CARD, TAILWIND_COLOR, TOGGLE_OFF, TOGGLE_ON,
} from "./styles";

export default function TailwindDemo() {
  const [activeUtilities, setActiveUtilities] = useState<ReadonlySet<string>>(() => new Set(DEFAULT_UTILITIES));

  const appliedClasses = UTILITIES.map(utility => utility.classes).filter(classes => activeUtilities.has(classes)).join(" ");

  const toggleUtility = (classes: string) => setActiveUtilities(current => {
    const next = new Set(current);
    if (next.has(classes)) next.delete(classes);
    else next.add(classes);
    return next;
  });

  return (
    <DemoShell className="gap-5">
      <p className="text-center text-sm text-muted">Toggle utilities and watch the card update in real time</p>

      <div className="flex justify-center py-4">
        <div className={`${PREVIEW_CARD} ${appliedClasses}`}>
          <p className="text-sm font-semibold text-strong">Cillian.tsx</p>
          <p className="mt-1 text-sm text-muted">Senior Frontend Dev</p>
          <span className={PREVIEW_BADGE}>Available</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {UTILITIES.map(({ classes }) => {
          const isOn = activeUtilities.has(classes);
          return (
            <button key={classes} type="button" aria-pressed={isOn} onClick={() => toggleUtility(classes)} className={isOn ? TOGGLE_ON : TOGGLE_OFF}>
              {isOn ? "✓ " : "  "}{classes}
            </button>
          );
        })}
      </div>

      <CodePanel accent={TAILWIND_COLOR} className={CLASS_PANEL}>
        <span className="text-muted">className=</span>
        <span className={CLASS_QUOTE}>"</span>
        <span className={CLASS_LIST}>{appliedClasses || <span className="text-muted">no classes</span>}</span>
        <span className={CLASS_QUOTE}>"</span>
      </CodePanel>
    </DemoShell>
  );
}
