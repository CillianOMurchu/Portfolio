import React from "react";

interface NameDisplayProps {
  letters: string[];
  oIndex: number;
  oCharRef: React.RefObject<HTMLSpanElement | null>;
}

const NameDisplay: React.FC<NameDisplayProps> = ({
  letters,
  oIndex,
  oCharRef,
}) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <a href="/about">
      <span
        className="text-accent text-[11px] tracking-wider"
        style={{
          cursor: "pointer",
          textShadow:
            "0 0 5px rgba(16,185,129,0.8),0 0 10px rgba(16,185,129,0.6),0 0 15px rgba(16,185,129,0.4),0 0 20px rgba(16,185,129,0.3)",
        }}
      >
        {letters.map((char, i) => (
          <span
            key={i}
            className="fadein-letter"
            style={{ animationDelay: `${i * 80}ms` }}
            ref={i === oIndex ? oCharRef : null}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </a>
  </div>
);

export default NameDisplay;
