import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { VALUE_SWAP_DELAY_MS } from "./constants";
import { DIGIT_BRIGHTENED, DIGIT_MOTION, DIGIT_SETTLED, FLASH_MOTION, VALUE_DIGIT, VALUE_FLASH } from "./styles";

interface TransformingValueProps {
  from: number;
  to: number;
}

export default function TransformingValue({ from, to }: TransformingValueProps) {
  const [shownValue, setShownValue] = useState(from);
  const isChanged = from !== to;
  const isTransformed = isChanged && shownValue === to;
  const digitTarget = isTransformed ? DIGIT_BRIGHTENED : DIGIT_SETTLED;

  useEffect(() => {
    if (!isChanged) return;
    const timer = setTimeout(() => setShownValue(to), VALUE_SWAP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isChanged, to]);

  return (
    <>
      {isTransformed && <m.span aria-hidden className={VALUE_FLASH} {...FLASH_MOTION} />}
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span key={shownValue} className={VALUE_DIGIT} {...DIGIT_MOTION} animate={digitTarget}>
          {shownValue}
        </m.span>
      </AnimatePresence>
    </>
  );
}
