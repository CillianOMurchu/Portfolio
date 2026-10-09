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
      className={`w-72 border border-primary/30 bg-black/80 backdrop-blur-xs p-4 rounded-sm ${className}`}
      style={{
        boxShadow:
          "0 0 10px color-mix(in srgb, var(--primary) 30%, transparent), 0 0 20px color-mix(in srgb, var(--primary) 20%, transparent), inset 0 0 20px color-mix(in srgb, var(--primary) 5%, transparent)",
        ...style,
      }}
    >
      <p
        className="text-primary text-sm tracking-wide leading-relaxed"
        style={{
          textShadow: "0 0 3px color-mix(in srgb, var(--primary) 50%, transparent)",
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
          <span className="inline-block w-[2px] h-[1em] bg-primary ml-[2px] animate-pulse" />
        )}
      </p>
    </div>
  );
};

export default InfoBox;
