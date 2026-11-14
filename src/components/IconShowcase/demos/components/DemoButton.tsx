import type { ButtonHTMLAttributes } from "react";
import { DARK_MUTED, GHOST_BG, MUTED_COLOR, SUBTLE_BORDER, tint } from "../constants";

interface DemoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  variant?: "accent" | "ghost";
}

export default function DemoButton({ color, variant, disabled, className = "", ...props }: DemoButtonProps) {
  const resolvedVariant = variant ?? (color ? "accent" : "ghost");

  const accentStyle = {
    background: tint(color ?? MUTED_COLOR, 10),
    border: `1px solid ${tint(color ?? MUTED_COLOR, 30)}`,
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
      className={`rounded-xs transition-colors duration-(--dur-base) ease-out focus-visible:shadow-focus focus-visible:outline-none ${className}`}
      style={resolvedVariant === "accent" ? accentStyle : ghostStyle}
      {...props}
    />
  );
}
