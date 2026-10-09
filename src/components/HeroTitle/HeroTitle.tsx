import React, { useState } from "react";

const HERO_ITEMS = [{ text: "SASS" }, { text: "Hospitality" }, { text: "iGaming" }] as const;

const HeroTitle: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="hero-titles-container">
      {HERO_ITEMS.map((item) => (
        <div
          key={item.text}
          className={`hero-title ${hoveredItem === item.text ? "hero-title--hovered" : ""}`}
          onMouseEnter={() => setHoveredItem(item.text)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default HeroTitle;
