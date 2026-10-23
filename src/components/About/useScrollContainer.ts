import { useLayoutEffect, useRef, type RefObject } from "react";

// Pages scroll inside App's fixed <main>, not the window, so scroll-linked
// hooks (useScroll's `container`, useInView's `root`) need that element.
// Call this before those hooks so the ref is set when their effects run.
export function useScrollContainer(target: RefObject<HTMLElement | null>) {
  const container = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    container.current = target.current?.closest("main") ?? null;
  }, [target]);
  return container;
}
