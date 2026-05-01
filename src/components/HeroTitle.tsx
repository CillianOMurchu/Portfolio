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

  // Update glow state when selectedItem changes
  React.useEffect(() => {
    HERO_ITEMS.forEach((item) => {
      const btn = itemRefs.current[item.text];
      if (!btn) return;

      if (selectedItem === (item.text as ItemType)) {
        // Selected item always has glow
        btn.style.boxShadow = "var(--neon-glow-primary)";
        btn.style.color = "var(--color-accent-primary)";
      } else {
        // Clear styles for non-selected items
        btn.style.boxShadow = "";
        btn.style.color = "";
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Apply glow only on hover when nothing is selected
    if (!selectedItem) {
      e.currentTarget.style.boxShadow = "var(--neon-glow-primary)";
      e.currentTarget.style.color = "var(--color-accent-primary)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Clear hover styles only if nothing is selected
    if (!selectedItem) {
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.color = "";
    }
    // If something is selected, keep the glow managed by useEffect
  };

  return (
    <div
      className="hero-title "
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: -1,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {HERO_ITEMS.map((item, i) => (
          <button
            key={item.text}
            ref={(el) => {
              if (el) itemRefs.current[item.text] = el;
            }}
            className={`p-4 block text-slate-500/15${item.text === "Hospitality" ? "" : " font-bold"} ${item.className} whitespace-nowrap transition-all duration-300 cursor-pointer`}
            style={{
              opacity:
                selectedItem && selectedItem !== (item.text as ItemType)
                  ? 0.3
                  : 0,
              transform:
                selectedItem && selectedItem !== (item.text as ItemType)
                  ? "scale(0.9) translateY(20px)"
                  : "translateY(0)",
              animation: `flyInUp 0.8s cubic-bezier(.4,0,.2,1) forwards`,
              animationDelay: `${i * 0.15}s`,
              textAlign: "center",
              width: "100%",
              left: 0,
              right: 0,
              margin: "0 auto",
              position: "relative",
              willChange: "opacity, transform",
              outline: "none",
              ...(item.text === "Hospitality" ? {} : { fontWeight: 700 }),
            }}
            aria-label={item.text}
            title={
              selectedItem === (item.text as ItemType)
                ? "Click to deactivate"
                : "Click to explore"
            }
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {item.text}
          </button>
        ))}
      </div>
      <style>{`
            @keyframes flyInUp {
              0% {
                opacity: 0;
                transform: translateY(80px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
    </div>
  );
};

export default HeroTitle;
