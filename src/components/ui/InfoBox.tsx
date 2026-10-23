import React from "react";
import { cn } from "../../lib/utils";

interface InfoBoxProps {
  text: string;
  displayedText?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Floating caption. A first line ending in "\n" is set as its title.
const InfoBox: React.FC<InfoBoxProps> = ({ text, displayedText, className, style }) => {
  const shown = displayedText ?? text;
  const isTyping = displayedText !== undefined && displayedText.length < text.length;
  const titleEnd = shown.indexOf("\n");

  return (
    <div className={cn("w-72 border bg-overlay p-4 shadow-float", className)} style={style}>
      <p className="m-0 text-sm leading-relaxed whitespace-pre-line text-body">
        {titleEnd === -1 ? (
          shown
        ) : (
          <>
            <strong className="font-medium text-strong">{shown.slice(0, titleEnd)}</strong>
            {"\n"}
            {shown.slice(titleEnd + 1)}
          </>
        )}
        {isTyping && <span className="ml-[2px] inline-block h-[1em] w-px animate-pulse bg-accent align-middle" />}
      </p>
    </div>
  );
};

export default InfoBox;
