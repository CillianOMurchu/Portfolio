// Full-width "Work history" title. Each word rises quickly out of a masked
// line as the title scrolls in ("Work" first, "history" just behind), then
// both keep drifting up slowly; a hairline draws in underneath.
import { cubicBezier, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { EASE_GALLERY } from "../../utils/animations";
import { useScrollContainer } from "./useScrollContainer";

const RISE = cubicBezier(...EASE_GALLERY);
const DRIFT = (t: number) => t;
const WORD = "inline-block will-change-transform";

export const WorkTitle: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const container = useScrollContainer(ref);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });

  const first = useTransform(scrollYProgress, [0.12, 0.32, 1], ["110%", "0%", "-18%"], { ease: [RISE, DRIFT] });
  const second = useTransform(scrollYProgress, [0.2, 0.4, 1], ["110%", "0%", "-30%"], { ease: [RISE, DRIFT] });
  const rule = useTransform(scrollYProgress, [0.3, 0.55], [0, 1], { ease: RISE });

  return (
    <div ref={ref} className="w-full">
      {/* Arbitrary vw size: the one display exception, sized to span the page. */}
      <h2 className="m-0 flex justify-between overflow-hidden pb-[0.12em] text-[15vw] leading-(--leading-none) whitespace-nowrap">
        <m.span className={WORD} style={reduce ? undefined : { y: first }}>
          Work
        </m.span>
        <m.em className={`${WORD} pr-[0.1em]`} style={reduce ? undefined : { y: second }}>
          history
        </m.em>
      </h2>
      <m.hr className="origin-left border-line-strong" style={reduce ? undefined : { scaleX: rule }} />
    </div>
  );
};
