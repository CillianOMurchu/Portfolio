// Underline-only text field with a mono uppercase label above. An error
// replaces the hint and turns the underline red; `lg` sets the text in Bodoni.
import React, { useId } from "react";
import { cn } from "../../lib/utils";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const WRAP_SIZES: Record<InputSize, string> = { sm: "min-h-[34px]", md: "min-h-11", lg: "min-h-14" };
const ICON = "grid place-items-center text-muted [&_svg]:size-[1.125em]";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, size = "md", leftIcon, rightIcon, required, disabled, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span aria-hidden className="ml-[3px] text-accent-text">*</span>}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-[.6em] border-b border-line transition-[border-color,box-shadow] duration-(--dur-base) ease-out",
          "hover:border-muted focus-within:border-focus focus-within:shadow-[0_1px_0_0_var(--border-focus)]",
          error && "border-danger shadow-[0_1px_0_0_var(--danger)] hover:border-danger focus-within:border-danger focus-within:shadow-[0_1px_0_0_var(--danger)]",
          disabled && "pointer-events-none opacity-45",
          WRAP_SIZES[size],
        )}
      >
        {leftIcon && <span className={ICON}>{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={cn(
            "min-w-0 flex-1 border-none bg-transparent py-[.55em] text-strong outline-none placeholder:text-faint",
            size === "lg" ? "font-display text-xl" : "font-sans text-md",
          )}
          {...props}
        />
        {rightIcon && <span className={ICON}>{rightIcon}</span>}
      </div>
      {message && (
        <p id={messageId} role={error ? "alert" : undefined} className={cn("m-0 text-xs", error ? "text-danger" : "text-muted")}>
          {message}
        </p>
      )}
    </div>
  );
});
