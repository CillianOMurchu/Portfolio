import React from "react";
import "./HeroTitle.anim.css";

type ItemType = "SASS" | "Hospitality" | "iGaming" | null;

interface HeroTitleProps {
  className?: string;
  selectedItem?: ItemType;
}

const HERO_ITEMS = [
  { text: "SASS", className: " text-8xl lg:text-[12rem] xl:text-[14rem]" },
  { text: "Hospitality", className: "text-6xl lg:text-[8rem] xl:text-[10rem]" },
  { text: "iGaming", className: "text-8xl lg:text-[12rem] xl:text-[14rem]" },
] as const;

const HeroTitle: React.FC<HeroTitleProps> = ({ selectedItem }) => {
  const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    HERO_ITEMS.forEach((item) => {
      const btn = itemRefs.current[item.text];
      if (!btn) return;

      if (selectedItem === (item.text as ItemType)) {
        btn.style.boxShadow = "var(--neon-glow-primary)";
        btn.style.color = "var(--color-accent-primary)";
      } else {
        btn.style.boxShadow = "";
        btn.style.color = "";
      }
    });
  }, [selectedItem]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedItem) {
      e.currentTarget.style.boxShadow = "var(--neon-glow-primary)";
      e.currentTarget.style.color = "var(--color-accent-primary)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedItem) {
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.color = "";
    }
  };

  return (
    <div className="hero-title hero-title-wrapper">
      <div className="flex flex-col items-center justify-center h-full">
        {HERO_ITEMS.map((item, i) => {
          const isDeemphasised = selectedItem && selectedItem !== (item.text as ItemType);
          return (
            <button
              key={item.text}
              ref={(el) => {
                if (el) itemRefs.current[item.text] = el;
              }}
              className={`hero-title-btn p-4 block text-slate-500/15${item.text === "Hospitality" ? "" : " font-bold"} ${item.className} whitespace-nowrap transition-all duration-300 cursor-pointer`}
              style={{
                opacity: isDeemphasised ? 0.3 : 0,
                transform: isDeemphasised ? "scale(0.9) translateY(20px)" : "translateY(0)",
                animationDelay: `${i * 0.15}s`,
              }}
              aria-label={item.text}
              title={item.text}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroTitle;
