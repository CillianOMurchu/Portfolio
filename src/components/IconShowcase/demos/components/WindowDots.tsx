const DOT = "size-2.5 rounded-full";

/** The red / amber / green buttons on a mock browser or editor window. */
export default function WindowDots() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      <div className={`${DOT} bg-danger/70`} />
      <div className={`${DOT} bg-warning/70`} />
      <div className={`${DOT} bg-success/70`} />
    </div>
  );
}
