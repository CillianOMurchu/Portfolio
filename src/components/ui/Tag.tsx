// Hairline pill for keywords and filters. `onClick` makes it a button;
// `onRemove` adds a small × that doesn't trigger the tag's own click.
import { X } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";

interface TagProps {
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({ active = false, onClick, onRemove, removeLabel = "Remove", className, children }) => {
  const classes = cn(
    "inline-flex items-center gap-[.5em] rounded-pill border px-[.85em] py-[.5em] font-sans text-sm leading-none",
    "transition-[background-color,color,border-color] duration-(--dur-base) ease-out focus-visible:shadow-focus focus-visible:outline-none",
    active ? "border-inverse bg-inverse text-on-inverse" : "border-hairline bg-transparent text-body",
    onClick && !active && "hover:border-line-strong hover:text-strong",
    className,
  );

  const remove = onRemove && (
    <span
      role="button"
      tabIndex={0}
      aria-label={removeLabel}
      onClick={(event) => {
        event.stopPropagation();
        onRemove();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        onRemove();
      }}
      className="-mr-[.2em] grid size-[1em] place-items-center opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:shadow-focus focus-visible:outline-none"
    >
      <X strokeWidth={1.5} strokeLinecap="square" className="size-2.5" />
    </span>
  );

  if (!onClick) {
    return (
      <span className={classes}>
        {children}
        {remove}
      </span>
    );
  }

  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={classes}>
      {children}
      {remove}
    </button>
  );
};
