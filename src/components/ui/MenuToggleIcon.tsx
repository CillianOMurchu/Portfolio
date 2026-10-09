import React from "react";
import { m } from "framer-motion";

interface MenuToggleIconProps {
  isOpen: boolean;
}

const LINE_CLASSES = "absolute h-0.5 w-6 rounded-full bg-primary";
const SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;
const LINE_OFFSET_PX = 7;

// Three lines that morph into an X when the menu is open.
export const MenuToggleIcon: React.FC<MenuToggleIconProps> = ({ isOpen }) => (
  <span className="relative flex size-6 items-center justify-center" aria-hidden="true">
    <m.span
      className={LINE_CLASSES}
      initial={false}
      animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -LINE_OFFSET_PX }}
      transition={SPRING}
    />
    <m.span
      className={LINE_CLASSES}
      initial={false}
      animate={{ opacity: isOpen ? 0 : 1 }}
      transition={SPRING}
    />
    <m.span
      className={LINE_CLASSES}
      initial={false}
      animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: LINE_OFFSET_PX }}
      transition={SPRING}
    />
  </span>
);
