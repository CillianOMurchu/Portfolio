// Underline tabs with an optional zero-padded mono count. Controlled; arrow
// keys move between tabs (roving tabindex).
import React, { useRef } from "react";
import { cn } from "../../lib/utils";

interface TabItem<T extends string> {
  value: T;
  label: React.ReactNode;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  label?: string;
  className?: string;
}

const pad = (count: number) => String(count).padStart(2, "0");

export function Tabs<T extends string>({ items, value, onChange, fullWidth = false, label, className }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const moveFocus = (event: React.KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = items[(index + step + items.length) % items.length];
    onChange(next.value);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[items.indexOf(next)]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      className={cn("gap-(--space-5) border-b", fullWidth ? "flex w-full" : "inline-flex", className)}
    >
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => moveFocus(event, index)}
            className={cn(
              "-mb-px inline-flex items-baseline gap-[.45em] border-b bg-transparent py-[.7em] font-sans text-sm whitespace-nowrap",
              "transition-[color,border-color] duration-(--dur-base) ease-out hover:text-strong focus-visible:shadow-focus focus-visible:outline-none",
              selected ? "border-line-strong text-strong" : "border-transparent text-muted",
            )}
          >
            {item.label}
            {item.count !== undefined && <span className="font-mono text-2xs text-faint">{pad(item.count)}</span>}
          </button>
        );
      })}
    </div>
  );
}
