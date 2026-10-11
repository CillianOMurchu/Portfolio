// The detective puzzle on the About page. For now: the face, centred in a
// screen-height section and mounted once scrolled into view so its entry
// animation is actually seen.
import { useInView } from "framer-motion";
import React, { useRef } from "react";
import Face from "./Face";

const DetectiveSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} aria-label="Detective puzzle" className="flex min-h-[calc(100dvh-8rem)] w-full items-center justify-center">
      {inView && <Face className="w-48 md:w-64" />}
    </section>
  );
};

export default DetectiveSection;
