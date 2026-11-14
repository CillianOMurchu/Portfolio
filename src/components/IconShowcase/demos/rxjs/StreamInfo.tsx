import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { OPERATORS } from "./constants";
import {
  INFO_TRIGGER, INFO_TRIGGER_ICON, MODAL_BACKDROP, MODAL_BADGE, MODAL_BODY, MODAL_CLOSE, MODAL_FADE,
  MODAL_OPERATOR_CHIP, MODAL_OPERATOR_LIST, MODAL_OPERATOR_ROW, MODAL_PANEL, MODAL_POP, MODAL_TITLE,
} from "./styles";

function StreamInfoModal({ close }: { close: () => void }) {
  return (
    <m.div className={MODAL_BACKDROP} {...MODAL_FADE} onClick={close}>
      <m.div className={MODAL_PANEL} {...MODAL_POP} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={MODAL_CLOSE} onClick={close} aria-label="Close">✕</button>
        <div className={MODAL_BADGE}>~</div>
        <h3 className={MODAL_TITLE}>What is a stream?</h3>
        <p className={MODAL_BODY}>
          A <strong>stream</strong> is a river of events flowing over time —
          clicks, keystrokes, API responses, anything that happens more than once.
        </p>
        <p className={MODAL_BODY}>
          RxJS lets you attach <strong>operators</strong> to that river to
          transform, filter, or combine values before they reach your code.
        </p>
        <div className={MODAL_OPERATOR_LIST}>
          {OPERATORS.map(op => (
            <div key={op.id} className={MODAL_OPERATOR_ROW}>
              <span className={MODAL_OPERATOR_CHIP}>{op.id}</span>
              <span>{op.explanation}</span>
            </div>
          ))}
        </div>
      </m.div>
    </m.div>
  );
}

export default function StreamInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="flex justify-center">
        <button type="button" onClick={() => setIsOpen(true)} className={INFO_TRIGGER} aria-label="What is an RxJS stream?">
          <span className={INFO_TRIGGER_ICON}>ℹ</span>
          What is a stream?
        </button>
      </div>
      <AnimatePresence>{isOpen && <StreamInfoModal close={close} />}</AnimatePresence>
    </>
  );
}
