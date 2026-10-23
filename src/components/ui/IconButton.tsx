// Square button holding a single icon. `label` is required: it is the
// accessible name and the tooltip. Forwards its ref for Radix `asChild` triggers.
import React from "react";
import { cn } from "../../lib/utils";

type IconButtonVariant = "default" | "solid" | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: React.ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  round?: boolean;
}

const BASE =
  "inline-grid shrink-0 place-items-center rounded-xs border bg-transparent text-strong " +
  "transition-[background-color,color,border-color] duration-(--dur-base) ease-out " +
  "focus-visible:shadow-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-[1.125em]";

const VARIANTS: Record<IconButtonVariant, string> = {
  default:
    "border-hairline hover:not-disabled:border-inverse hover:not-disabled:bg-inverse hover:not-disabled:text-on-inverse",
  solid:
    "border-inverse bg-inverse text-on-inverse hover:not-disabled:border-accent hover:not-disabled:bg-accent hover:not-disabled:text-on-accent",
  ghost: "border-transparent hover:not-disabled:bg-sunken",
};

const SIZES: Record<IconButtonSize, string> = { sm: "size-8", md: "size-10", lg: "size-12" };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "default", size = "md", round = false, type = "button", className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      data-variant={variant}
      className={cn(BASE, VARIANTS[variant], SIZES[size], round && "rounded-pill", className)}
      {...props}
    >
      {icon}
    </button>
  );
});
