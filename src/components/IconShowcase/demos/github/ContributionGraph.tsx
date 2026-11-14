import { useState } from "react";
import { DAYS, MAX_ACTIVITY_LEVEL, MILESTONES, QUIET_DAY_CHANCE, WEEKS, type Milestone } from "./constants";
import { ACTIVITY_LEVEL, CELL, GRAPH_PANEL, MILESTONE_LABEL, MILESTONE_TONE } from "./styles";

const randomActivity = () => (Math.random() > QUIET_DAY_CHANCE ? Math.ceil(Math.random() * MAX_ACTIVITY_LEVEL) : 0);

const ACTIVITY: number[][] = Array.from({ length: WEEKS }, () => Array.from({ length: DAYS }, randomActivity));

const milestoneAt = (week: number, day: number) => MILESTONES.find(m => m.week === week && m.day === day);

function cellClass(week: number, day: number) {
  const milestone = milestoneAt(week, day);
  const fill = milestone ? MILESTONE_TONE[milestone.tone].cell : ACTIVITY_LEVEL[ACTIVITY[week][day]];
  return `${CELL} ${fill}`;
}

export default function ContributionGraph() {
  const [hoveredMilestone, setHoveredMilestone] = useState<Milestone | null>(null);
  const milestoneTone = hoveredMilestone ? MILESTONE_TONE[hoveredMilestone.tone].text : "";

  return (
    <div className={GRAPH_PANEL}>
      <p className="mb-2 text-sm text-muted">Contribution graph — hover the glowing cells</p>
      <div className="flex gap-0.5">
        {ACTIVITY.map((days, week) => (
          <div key={week} className="flex flex-col gap-0.5">
            {days.map((_, day) => (
              <div
                key={day}
                className={cellClass(week, day)}
                onMouseEnter={() => setHoveredMilestone(milestoneAt(week, day) ?? null)}
                onMouseLeave={() => setHoveredMilestone(null)}
              />
            ))}
          </div>
        ))}
      </div>
      <p className={`${MILESTONE_LABEL} ${milestoneTone}`} aria-live="polite">
        {hoveredMilestone && `★ ${hoveredMilestone.label}`}
      </p>
    </div>
  );
}
