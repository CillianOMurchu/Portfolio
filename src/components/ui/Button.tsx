// Text button. Hover inverts (ink → red, outline → ink fill, ghost draws an
// underline in). `href` renders an <a>. Forwards its ref so Radix `asChild`
// triggers can position menus and restore focus.
import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

type ButtonProps = ButtonOwnProps &
  (
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string; disabled?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  );

const BASE =
  "inline-flex items-center justify-center gap-[.6em] rounded-xs border border-transparent font-sans font-medium leading-none tracking-tight whitespace-nowrap no-underline select-none " +
  "[transition:background-color_var(--dur-base)_var(--ease-out),color_var(--dur-base)_var(--ease-out),border-color_var(--dur-base)_var(--ease-out),transform_var(--dur-fast)_var(--ease-out)] " +
  "active:not-disabled:translate-y-px focus-visible:shadow-focus focus-visible:outline-none " +
  "disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border-inverse bg-inverse text-on-inverse hover:not-disabled:border-accent hover:not-disabled:bg-accent hover:not-disabled:text-on-accent",
  secondary:
    "border-line-strong bg-transparent text-strong hover:not-disabled:bg-inverse hover:not-disabled:text-on-inverse",
  accent:
    "border-accent bg-accent text-on-accent hover:not-disabled:border-inverse hover:not-disabled:bg-inverse hover:not-disabled:text-on-inverse",
  ghost:
    "rounded-none bg-transparent bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-[position:0_calc(100%-.45em)] bg-no-repeat text-strong " +
    "[transition:background-size_var(--dur-slow)_var(--ease-gallery),color_var(--dur-base)_var(--ease-out)] hover:not-disabled:bg-[length:100%_1px]",
  danger:
    "border-danger bg-transparent text-danger hover:not-disabled:bg-danger hover:not-disabled:text-on-inverse",
};

// Ghost buttons sit flush with text, so they keep the vertical padding only.
const SIZES: Record<ButtonSize, { text: string; padY: string; padX: string }> = {
  sm: { text: "text-sm", padY: "py-[.6em]", padX: "px-[.95em]" },
  md: { text: "text-md", padY: "py-[.85em]", padX: "px-[1.3em]" },
  lg: { text: "text-lg", padY: "py-[1em]", padX: "px-[1.6em]" },
};

const ICON = "inline-grid place-items-center transition-transform duration-(--dur-base) ease-out [&_svg]:size-[1em]";
const ICON_NUDGE = "[:hover:not(:disabled)>&]:translate-x-[3px]";

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", leftIcon, rightIcon, loading = false, fullWidth = false, className, children, ...props },
  ref,
) {
  const { text, padY, padX } = SIZES[size];
  const classes = cn(BASE, VARIANTS[variant], text, padY, variant !== "ghost" && padX, fullWidth && "w-full", className);
  const content = (
    <>
      {loading ? (
        <span aria-hidden className="size-[.9em] animate-spin rounded-full border-[1.5px] border-current border-t-transparent [animation-duration:.8s]" />
      ) : (
        leftIcon && <span className={ICON}>{leftIcon}</span>
      )}
      {children}
      {rightIcon && <span className={cn(ICON, ICON_NUDGE)}>{rightIcon}</span>}
    </>
  );

  if (props.href !== undefined) {
    const { disabled, ...anchorProps } = props;
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} aria-disabled={disabled || undefined} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { disabled, type = "button", ...buttonProps } = props;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
});
