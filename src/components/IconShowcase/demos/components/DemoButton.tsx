import type { ButtonHTMLAttributes } from "react";
import { DARK_MUTED, GHOST_BG, MUTED_COLOR, SUBTLE_BORDER } from "../constants";

interface DemoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  variant?: "accent" | "ghost";
}

export default function DemoButton({ color, variant, disabled, className = "", ...props }: DemoButtonProps) {
  const resolvedVariant = variant ?? (color ? "accent" : "ghost");

  const accentStyle = {
    background: `${color}1a`,
    border: `1px solid ${color}4d`,
    color: disabled ? DARK_MUTED : color,
    cursor: disabled ? ("default" as const) : ("pointer" as const),
  };

  const ghostStyle = {
    background: GHOST_BG,
    border: `1px solid ${SUBTLE_BORDER}`,
    color: MUTED_COLOR,
  };

  return (
    <button
      disabled={disabled}
      className={`rounded-lg transition-all ${className}`}
      style={resolvedVariant === "accent" ? accentStyle : ghostStyle}
      {...props}
    />
  );
}
