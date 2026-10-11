// Fades/slides its children in once they scroll into view, using one of the
// shared scrollVariants from utils/animations.ts.
import { m, type Transition, type UseInViewOptions, type Variants } from "framer-motion";
import React from "react";
import { scrollTiming, scrollViewport } from "../../utils/animations";

interface RevealProps {
  variants: Variants;
  transition?: Transition;
  viewport?: Pick<UseInViewOptions, "once" | "amount">;
  className?: string;
  children: React.ReactNode;
}

export const Reveal: React.FC<RevealProps> = ({ variants, transition = scrollTiming, viewport = scrollViewport, className, children }) => (
  <m.div initial="hidden" whileInView="visible" viewport={viewport} variants={variants} transition={transition} className={className}>
    {children}
  </m.div>
);
