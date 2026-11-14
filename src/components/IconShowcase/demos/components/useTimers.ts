import { useEffect, useRef } from "react";

/** Schedules timeouts that are all cleared together, and on unmount. */
export function useTimers() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current.length = 0; // emptied in place so the unmount cleanup still sees later timers
  };

  const schedule = (run: () => void, delayMs: number) => {
    timers.current.push(setTimeout(run, delayMs));
  };

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return { schedule, clearAll };
}
