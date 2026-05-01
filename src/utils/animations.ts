export const fadeUpPreset = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: {
    duration: 1,
    delay: 0.5,
    ease: [0.42, 0, 0.58, 1],
  },
} as const;

export const fadeInFast = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" },
};

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
export const scrollTiming = { duration: 0.8 };
