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
