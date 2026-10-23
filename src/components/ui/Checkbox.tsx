// 18px square with a hairline border; ink fill and a tick when checked. Controlled.
import React from "react";
import { cn } from "../../lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled = false, className }) => (
  <label className={cn("group relative inline-flex items-center gap-[.65em] font-sans select-none", disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer", className)}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden
      className={cn(
        "grid size-[18px] flex-none place-items-center rounded-none border transition-[background-color,border-color] duration-(--dur-base) ease-out peer-focus-visible:shadow-focus",
        checked ? "border-inverse bg-inverse" : "border-line bg-transparent",
        !disabled && !checked && "group-hover:border-line-strong",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="square"
        className={cn("size-3 text-on-inverse transition-opacity duration-(--dur-fast) ease-out", checked ? "opacity-100" : "opacity-0")}
      >
        <path d="M4 12.5 9.5 18 20 6" />
      </svg>
    </span>
    <span className="text-md text-strong">{label}</span>
  </label>
);
