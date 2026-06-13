import type { ReactNode } from "react";
import { CODE_BG } from "../constants";

interface CodePanelProps {
  accent: string;
  children: ReactNode;
  className?: string;
}

// className replaces the default "p-4 font-mono text-xs" — pass it explicitly when you need different padding, font, or overflow.
export default function CodePanel({ accent, children, className = "p-4 font-mono text-xs" }: CodePanelProps) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{ background: CODE_BG, border: `1px solid ${accent}4d` }}
    >
      {children}
    </div>
  );
}
