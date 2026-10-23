import React from "react";
import { Link } from "react-router-dom";

interface NameDisplayProps {
  letters: string[];
  oIndex: number;
  oCharRef: React.Ref<HTMLSpanElement>;
  onPointerDown?: (event: React.PointerEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
}

const NameDisplay: React.FC<NameDisplayProps> = ({
  letters,
  oIndex,
  oCharRef,
  onPointerDown,
  onClick,
}) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <Link to="/about" aria-label="About Cillian Ó Murchú" onPointerDown={onPointerDown} onClick={onClick} className="no-underline focus-visible:shadow-focus focus-visible:outline-none">
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
    </Link>
  </div>
);

export default NameDisplay;
