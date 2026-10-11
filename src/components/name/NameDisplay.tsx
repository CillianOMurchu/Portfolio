import React from "react";

interface NameDisplayProps {
  letters: string[];
  oIndex: number;
  oCharRef: React.Ref<HTMLSpanElement>;
}

const NameDisplay: React.FC<NameDisplayProps> = ({
  letters,
  oIndex,
  oCharRef,
}) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <a href="/">
      <span
        className="text-primary text-xs tracking-wider"
        style={{
          cursor: "pointer",
          textShadow:
            "0 0 5px color-mix(in srgb, var(--primary) 80%, transparent), 0 0 10px color-mix(in srgb, var(--primary) 60%, transparent), 0 0 15px color-mix(in srgb, var(--primary) 40%, transparent), 0 0 20px color-mix(in srgb, var(--primary) 30%, transparent)",
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
