import React from "react";

interface NameInfoBoxProps {
  showText: boolean;
  displayedText: string;
  bioText: string;
}

const NameInfoBox: React.FC<NameInfoBoxProps> = ({ showText, displayedText, bioText }) => (
  <div
    className="info-box absolute left-0 mt-8 w-80 max-w-[calc(100vw-40px)] h-24 border border-accent-subtle bg-black/80 backdrop-blur-sm p-4 rounded"
    style={{
      boxShadow:
        "0 0 10px rgba(16,185,129,0.3), 0 0 20px rgba(16,185,129,0.2), inset 0 0 20px rgba(16,185,129,0.05)",
    }}
  >
    <p
      className="text-accent text-sm tracking-wide leading-relaxed"
      style={{
        textShadow: "0 0 3px rgba(16,185,129,0.5)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {displayedText}
      {showText && displayedText.length < bioText.length && (
        <span className="inline-block w-[2px] h-[1em] bg-accent ml-[2px] animate-pulse" />
      )}
    </p>
  </div>
);

export default NameInfoBox;
