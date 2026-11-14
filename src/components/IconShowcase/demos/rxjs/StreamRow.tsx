import type { Ref } from "react";
import { AnimatePresence, m } from "framer-motion";
import type { StreamEvent } from "./constants";
import TransformingValue from "./TransformingValue";
import {
  BUBBLE_MOTION, EVENT_BUBBLE, EVENT_TONE, STREAM_EMPTY, STREAM_LABEL, STREAM_ROW, STREAM_TRACK,
  bubbleExit, bubbleTarget,
} from "./styles";

interface StreamRowProps {
  label: string;
  events: StreamEvent[];
  tone: keyof typeof EVENT_TONE;
  capacity: number;
  trackRef?: Ref<HTMLDivElement>;
}

function EventValue({ event }: { event: StreamEvent }) {
  if (event.from === undefined) return <>{event.value}</>;
  return <TransformingValue from={event.from} to={event.value} />;
}

export default function StreamRow({ label, events, tone, capacity, trackRef }: StreamRowProps) {
  const newestFirst = [...events].reverse();
  const isEmpty = events.length === 0;

  return (
    <div className={STREAM_ROW}>
      <span className={STREAM_LABEL}>{label}</span>
      <div className={STREAM_TRACK} ref={trackRef}>
        <AnimatePresence initial={false}>
          {newestFirst.map((event, slot) => (
            <m.div
              key={event.id}
              className={`${EVENT_BUBBLE} ${EVENT_TONE[tone]}`}
              {...BUBBLE_MOTION}
              animate={bubbleTarget(slot, slot >= capacity)}
              exit={bubbleExit(capacity)}
            >
              <EventValue event={event} />
            </m.div>
          ))}
        </AnimatePresence>
        {isEmpty && <span className={STREAM_EMPTY}>— waiting —</span>}
      </div>
    </div>
  );
}
