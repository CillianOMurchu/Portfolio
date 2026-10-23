// Round greyscale portrait, or serif-italic initials (up to two words) without `src`.
import React from "react";
import { cn } from "../../lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";
type AvatarColor = "stone" | "ink" | "accent";

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  color?: AvatarColor;
  square?: boolean;
  className?: string;
}

const SIZES: Record<AvatarSize, { box: string; px: number }> = {
  xs: { box: "size-7 text-[13px]", px: 28 },
  sm: { box: "size-9 text-[16px]", px: 36 },
  md: { box: "size-12 text-[21px]", px: 48 },
  lg: { box: "size-[72px] text-[30px]", px: 72 },
};

const COLORS: Record<AvatarColor, string> = {
  stone: "bg-inset text-strong",
  ink: "bg-inverse text-on-inverse",
  accent: "bg-accent text-on-accent",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = "md", color = "stone", square = false, className }) => {
  const { box, px } = SIZES[size];
  return (
    <span
      className={cn(
        "inline-grid flex-none place-items-center overflow-hidden font-display leading-none italic",
        square ? "rounded-none" : "rounded-full",
        box,
        COLORS[color],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} width={px * 2} height={px * 2} className="block size-full object-cover grayscale" />
      ) : (
        <span role="img" aria-label={name}>
          {initials(name)}
        </span>
      )}
    </span>
  );
};
