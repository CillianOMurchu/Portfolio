// Motion tokens for Framer Motion, mirroring --ease-* / --dur-* in src/index.css
// (JS can't read the CSS custom properties at animation time).
export const EASE_GALLERY = [0.4, 0, 0, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const DUR_BASE = 0.28;
export const DUR_SLOW = 0.52;
export const DUR_SLOWER = 0.9;

// Shared scroll-triggered variants used by About and TimelineItem
export const scrollVariants = {
  section: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
  slideInRight: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  slideInLeft: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  card: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  listContainer: { visible: { transition: { staggerChildren: 0.05 } } },
  listItem: { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } },
};

export const scrollViewport = { once: true, amount: 0.8 };
export const scrollTiming = { duration: DUR_SLOWER, ease: EASE_GALLERY };
