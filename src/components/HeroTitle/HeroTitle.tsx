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
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
};

export default HeroTitle;
