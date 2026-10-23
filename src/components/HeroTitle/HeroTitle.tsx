import React from "react";

const HERO_ITEMS = ["SASS", "Hospitality", "iGaming"] as const;

// Gallery wall text: faint Bodoni, every other line italic; ink on hover.
const HeroTitle: React.FC = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    {HERO_ITEMS.map((item) => (
      <div
        key={item}
        className="cursor-default font-display text-6xl leading-(--leading-tight) tracking-display whitespace-nowrap text-strong/10 transition-colors duration-(--dur-slow) ease-out select-none even:italic hover:text-strong"
      >
        {item}
      </div>
    ))}
  </div>
);

export default HeroTitle;
