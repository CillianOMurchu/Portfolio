import React from "react";
import { m } from "framer-motion";
import { DUR_BASE, EASE_GALLERY } from "../../utils/animations";

interface MenuToggleIconProps {
  isOpen: boolean;
}

const LINE_CLASSES = "absolute h-px w-5 bg-strong";
const EASE = { duration: DUR_BASE, ease: EASE_GALLERY };
const LINE_OFFSET_PX = 6;

// Three lines that morph into an X when the menu is open.
export const MenuToggleIcon: React.FC<MenuToggleIconProps> = ({ isOpen }) => (
  <span className="relative flex size-6 items-center justify-center" aria-hidden="true">
    <m.span
      className={LINE_CLASSES}
      initial={false}
      animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -LINE_OFFSET_PX }}
      transition={EASE}
    />
    <m.span
      className={LINE_CLASSES}
      initial={false}
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={EASE}
    />
    <m.span
      className={LINE_CLASSES}
      initial={false}
      animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: LINE_OFFSET_PX }}
      transition={EASE}
    />
  </span>
);
