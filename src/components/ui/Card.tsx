// Flush, square surface. `interactive` lifts it 4px on hover, slowly.
import React from "react";
import { cn } from "../../lib/utils";

type CardVariant = "framed" | "paper" | "stone" | "marble";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
}

const VARIANTS: Record<CardVariant, string> = {
  framed: "border bg-card",
  paper: "bg-card shadow-paper",
  stone: "bg-sunken",
  // The marble texture is always light, so its text stays dark in both themes.
  marble: "bg-(--marble-0) [background-image:var(--texture-marble),var(--texture-grain)] bg-[length:cover,220px] text-(--stone-800)",
};

const PADDING: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-(--space-4)",
  md: "p-(--space-6)",
  lg: "p-(--space-7)",
};

const INTERACTIVE =
  "cursor-pointer [transition:transform_var(--dur-slow)_var(--ease-gallery),box-shadow_var(--dur-slow)_var(--ease-gallery),border-color_var(--dur-base)_var(--ease-out)] hover:-translate-y-1 hover:shadow-lift";

export const Card: React.FC<CardProps> = ({ variant = "framed", padding = "md", interactive = false, className, ...props }) => (
  <div
    className={cn(
      "relative block rounded-none text-body",
      VARIANTS[variant],
      PADDING[padding],
      interactive && INTERACTIVE,
      interactive && variant === "framed" && "hover:border-line-strong",
      className,
    )}
    {...props}
  />
);
