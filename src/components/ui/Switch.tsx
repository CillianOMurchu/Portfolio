// Thin hairline pill; on = ink track with a red thumb. Controlled. The real
// control is a visually hidden checkbox with role="switch".
import React from "react";
import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: React.ReactNode;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

const TRACK = { sm: "h-[18px] w-8", md: "h-[22px] w-10" };
const THUMB = { sm: "size-2.5", md: "size-3.5" };
const THUMB_ON = { sm: "translate-x-[14px]", md: "translate-x-[18px]" };

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, size = "md", disabled = false, className, labelClassName }) => (
  <label className={cn("relative inline-flex items-center gap-[.7em] font-sans select-none", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer", className)}>
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden
      className={cn(
        "relative flex-none rounded-pill border transition-[background-color,border-color] duration-(--dur-base) ease-out peer-focus-visible:shadow-focus",
        checked ? "border-inverse bg-inverse" : "border-line bg-transparent",
        TRACK[size],
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] left-[3px] rounded-full [transition:transform_var(--dur-base)_var(--ease-gallery),background-color_var(--dur-base)_var(--ease-out)]",
          checked ? cn("bg-accent", THUMB_ON[size]) : "bg-strong",
          THUMB[size],
        )}
      />
    </span>
    <span className={labelClassName ?? "text-md text-strong"}>{label}</span>
  </label>
);
