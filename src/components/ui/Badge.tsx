// Catalogue-style mono uppercase label. `dot` adds a leading dot (red on neutral).
import React from "react";
import { cn } from "../../lib/utils";

type BadgeColor = "neutral" | "ink" | "accent" | "success" | "danger";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: "sm" | "lg";
  dot?: boolean;
  plain?: boolean;
}

const COLORS: Record<BadgeColor, string> = {
  neutral: "border-hairline bg-transparent text-body",
  ink: "border-inverse bg-inverse text-on-inverse",
  accent: "border-accent bg-accent text-on-accent",
  success: "border-current text-success",
  danger: "border-current text-danger",
};

// Plain badges drop the box, so filled colours fall back to their text tone.
const PLAIN_COLORS: Partial<Record<BadgeColor, string>> = {
  ink: "bg-transparent text-strong",
  accent: "bg-transparent text-accent-text",
};

export const Badge: React.FC<BadgeProps> = ({ color = "neutral", size = "sm", dot = false, plain = false, className, children, ...props }) => (
  <span
    className={cn(
      "inline-flex items-center gap-[.5em] rounded-xs border font-mono leading-none font-normal tracking-label whitespace-nowrap uppercase",
      size === "lg" ? "px-[.8em] py-[.55em] text-xs" : "px-[.65em] py-[.45em] text-2xs",
      COLORS[color],
      plain && cn("border-transparent px-0", PLAIN_COLORS[color]),
      className,
    )}
    {...props}
  >
    {dot && <span aria-hidden className={cn("size-[.6em] rounded-full", color === "neutral" ? "bg-accent" : "bg-current")} />}
    {children}
  </span>
);
