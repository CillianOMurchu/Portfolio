import React, { useState } from "react";

type ItemType = "SASS" | "Hospitality" | "iGaming" | null;

interface HeroTitleProps {
  selectedItem?: ItemType;
}

const HERO_ITEMS = [
  { text: "SASS",        bold: true  },
  { text: "Hospitality", bold: false },
  { text: "iGaming",     bold: true  },
] as const;

const HeroTitle: React.FC<HeroTitleProps> = ({ selectedItem }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="hero-titles-container">
      {HERO_ITEMS.map((item) => {
        const deemphasised = selectedItem && selectedItem !== item.text;
        const isHovered = hoveredItem === item.text;

        return (
          <div
            key={item.text}
            className={`hero-title ${isHovered ? "hero-title--hovered" : ""} ${deemphasised ? "hero-title--deemphasised" : ""}`}
            onMouseEnter={() => setHoveredItem(item.text)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              fontSize: "clamp(4rem, 12vw, 10rem)",
              fontWeight: item.bold ? 800 : 400,
              color: isHovered ? "var(--color-accent-primary)" : "rgba(148, 163, 184, 0.15)",
              whiteSpace: "nowrap",
              opacity: deemphasised ? 0.3 : 1,
              transition: "color 0.2s, opacity 0.3s, transform 0.3s, text-shadow 0.2s",
              transform: deemphasised ? "scale(0.95)" : "scale(1)",
              textShadow: isHovered ? "var(--neon-glow-primary)" : "none",
              lineHeight: 1.1,
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

export default HeroTitle;
