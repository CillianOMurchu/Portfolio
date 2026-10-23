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
    <a href="/" className="no-underline focus-visible:shadow-focus focus-visible:outline-none">
      <span className="font-mono text-xs tracking-label whitespace-nowrap text-strong">
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
