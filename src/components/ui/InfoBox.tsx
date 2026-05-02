import React from "react";

interface InfoBoxProps {
  text: string;
  displayedText?: string;
  className?: string;
  style?: React.CSSProperties;
}

const InfoBox: React.FC<InfoBoxProps> = ({ text, displayedText, className = "", style }) => {
  const shown = displayedText ?? text;
  const isTyping = displayedText !== undefined && displayedText.length < text.length;

  return (
    <div
      className={`w-72 border border-accent-subtle bg-black/80 backdrop-blur-sm p-4 rounded ${className}`}
      style={{
        boxShadow:
          "0 0 10px rgba(16,185,129,0.3), 0 0 20px rgba(16,185,129,0.2), inset 0 0 20px rgba(16,185,129,0.05)",
        ...style,
      }}
    >
      <p
        className="text-accent text-sm tracking-wide leading-relaxed"
        style={{
          textShadow: "0 0 3px rgba(16,185,129,0.5)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          whiteSpace: "pre-line",
        }}
      >
        {(() => {
          const idx = shown.indexOf("\n");
          if (idx === -1) return shown;
          return (
            <>
              <strong>{shown.slice(0, idx)}</strong>
              {"\n"}
              {shown.slice(idx + 1)}
            </>
          );
        })()}
        {isTyping && (
          <span className="inline-block w-[2px] h-[1em] bg-accent ml-[2px] animate-pulse" />
        )}
      </p>
    </div>
  );
};

export default InfoBox;
