import React from "react";

const HERO_ITEMS = ["SASS", "Hospitality", "iGaming"] as const;

// Wall text: faint tinted words that fill with colour on hover, blue and coral alternating.
const HeroTitle: React.FC = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    {HERO_ITEMS.map((item) => (
      <div
        key={item}
        className="cursor-default font-display text-6xl leading-(--leading-tight) tracking-display whitespace-nowrap text-accent/20 transition-colors duration-(--dur-slow) ease-out select-none even:text-highlight/20 hover:text-accent even:hover:text-highlight"
      >
        {item}
      </div>
    ))}
  </div>
);

export default HeroTitle;
