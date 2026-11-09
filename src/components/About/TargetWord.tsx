// Text where the o's of one word become targets while a role opens ("Roadoo" in
// Maslo / Roadoo Network). When the nearest `group` with aria-expanded="true"
// (WorkEntry's row button) opens, each o fades out as a target grows in over it,
// an arrow flies in from the upper left and quivers in the bullseye, then the
// target and arrow fade and the o returns (`target-letter`, `target-show`,
// `arrow-fly` in index.css). Targets start STAGGER_MS apart. The letters stay in
// the DOM, so screen readers read the plain text; the targets are aria-hidden.
import React from "react";

const START_MS = 120;
const STAGGER_MS = 200;

// A target the size of a lowercase o. As an inline-block with only block content,
// its bottom sits on the baseline, so its centre is the o's centre.
const Target: React.FC = () => (
  <span className="relative inline-block size-[0.56em] align-baseline">
    <svg
      viewBox="0 0 24 24"
      className="block size-full opacity-0 motion-safe:group-aria-expanded:animate-[target-show_2000ms_ease-out_var(--t-at)_both]"
    >
      <circle cx="12" cy="12" r="11.5" className="fill-highlight" />
      <circle cx="12" cy="12" r="8.6" className="fill-card" />
      <circle cx="12" cy="12" r="6" className="fill-highlight" />
      <circle cx="12" cy="12" r="3.3" className="fill-card" />
      <circle cx="12" cy="12" r="1.6" className="fill-highlight" />
    </svg>
    {/* A zero-size point at the bullseye; the arrow's tip sits on it and it rotates about it. */}
    <span className="absolute top-1/2 left-1/2 size-0 opacity-0 motion-safe:group-aria-expanded:animate-[arrow-fly_2000ms_linear_var(--t-at)_both]">
      <svg viewBox="0 0 44 8" className="absolute top-[-0.1em] left-[-1.04em] h-[0.2em] w-[1.1em] overflow-visible text-strong">
        <line x1="5" y1="4" x2="38" y2="4" stroke="currentColor" strokeWidth="1.6" />
        <polygon points="36,0.8 44,4 36,7.2" fill="currentColor" />
        <path d="M0 0.5 7 4 0 7.5 3 4Z" className="fill-accent" />
      </svg>
    </span>
  </span>
);

// One o: the real letter (fades out and back) with the target laid over it on the same baseline.
const TargetO: React.FC<{ index: number }> = ({ index }) => (
  <span className="relative inline-block" style={{ "--t-at": `${START_MS + index * STAGGER_MS}ms` } as React.CSSProperties}>
    <span className="motion-safe:group-aria-expanded:animate-[target-letter_2000ms_linear_var(--t-at)_both]">o</span>
    <span aria-hidden className="pointer-events-none absolute inset-0 text-center whitespace-nowrap">
      <Target />
    </span>
  </span>
);

export const TargetWord: React.FC<{ text: string; word: string }> = ({ text, word }) => {
  const at = text.indexOf(word);
  if (at === -1) return <>{text}</>;
  let targets = 0;
  return (
    <>
      {text.slice(0, at)}
      {word.split(/(o)/).map((part, i) => (part === "o" ? <TargetO key={i} index={targets++} /> : part))}
      {text.slice(at + word.length)}
    </>
  );
};
