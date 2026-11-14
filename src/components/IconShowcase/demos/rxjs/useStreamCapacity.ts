import { useLayoutEffect, useRef, useState } from "react";
import { DEFAULT_CAPACITY, EVENT_SLOT_PX } from "./constants";

/** How many event bubbles fit on one line of the measured track. */
export function useStreamCapacity() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setCapacity(Math.max(1, Math.floor(track.clientWidth / EVENT_SLOT_PX)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return { trackRef, capacity };
}
