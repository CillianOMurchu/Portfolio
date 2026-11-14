import { m } from "framer-motion";
import gitlabSvg from "../../../../assets/programming-icons/gitlab.svg";
import { OUTCOME_TEXT, STAGES, type JobStatuses } from "./constants";
import { stageStatus } from "./pipeline";
import {
  EYES_DRIFT, FACE_EYE, FACE_EYES, FACE_MOUTH, FACE_NOSE, FACE_OVERLAY, FADE, MOUTH_DRAW, MOUTH_FADE, NOSE_POP, OUTCOME,
  OUTCOME_DELAY_S, STATUS_TONE, TRY_AGAIN, TRY_AGAIN_DELAY_S, delayedFade, eyeDrop, stageDotPop,
} from "./styles";

interface Point { x: number; y: number }

const MOUTH_SIZE = { width: 140, height: 55 };
const STAGE_DOT_RADIUS = 4;
/** Quadratic curve control points (start, bend, end) for each mood. */
const CURVES: Record<"smile" | "frown", [Point, Point, Point]> = {
  smile: [{ x: 15, y: 12 }, { x: 70, y: 52 }, { x: 125, y: 12 }],
  frown: [{ x: 15, y: 43 }, { x: 70, y: 3 }, { x: 125, y: 43 }],
};

const curvePath = ([start, bend, end]: [Point, Point, Point]) => `M ${start.x},${start.y} Q ${bend.x},${bend.y} ${end.x},${end.y}`;

function pointOnCurve([start, bend, end]: [Point, Point, Point], t: number): Point {
  const along = (a: number, b: number, c: number) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;
  return { x: along(start.x, bend.x, end.x), y: along(start.y, bend.y, end.y) };
}

interface PipelineFaceProps {
  statuses: JobStatuses;
  hasPassed: boolean;
  restart: () => void;
}

/** The finished pipeline as a face: GitLab-logo eyes, and the stages curled into a smile or frown. */
export default function PipelineFace({ statuses, hasPassed, restart }: PipelineFaceProps) {
  const curve = hasPassed ? CURVES.smile : CURVES.frown;
  const outcome = hasPassed ? "passed" : "failed";
  const outcomeTone = STATUS_TONE[outcome];

  return (
    <m.div className={FACE_OVERLAY} {...FADE}>
      <m.div className={FACE_EYES} {...EYES_DRIFT}>
        {[0, 1].map(index => <m.img key={index} src={gitlabSvg} alt="" className={FACE_EYE} {...eyeDrop(index)} />)}
      </m.div>

      <m.div className={FACE_NOSE} {...NOSE_POP} />

      <m.svg {...MOUTH_SIZE} viewBox={`0 0 ${MOUTH_SIZE.width} ${MOUTH_SIZE.height}`} className={FACE_MOUTH} {...MOUTH_FADE}>
        <m.path d={curvePath(curve)} fill="none" strokeWidth="3" strokeLinecap="round" className={outcomeTone.stroke} {...MOUTH_DRAW} />
        {STAGES.map((stage, index) => {
          const point = pointOnCurve(curve, index / (STAGES.length - 1));
          const fill = STATUS_TONE[stageStatus(statuses, stage)].fill;
          return <m.circle key={stage} cx={point.x} cy={point.y} r={STAGE_DOT_RADIUS} className={fill} {...stageDotPop(index)} />;
        })}
      </m.svg>

      <m.p className={`${OUTCOME} ${outcomeTone.text}`} {...delayedFade(OUTCOME_DELAY_S)}>{OUTCOME_TEXT[outcome]}</m.p>
      <m.button type="button" onClick={restart} className={TRY_AGAIN} {...delayedFade(TRY_AGAIN_DELAY_S)}>↺ try again</m.button>
    </m.div>
  );
}
