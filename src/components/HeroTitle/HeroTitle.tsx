import React from "react";

const HERO_ITEMS = ["SASS", "Hospitality", "iGaming"] as const;

const HeroTitle: React.FC = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    {HERO_ITEMS.map((item) => (
      <div
        key={item}
        className="cursor-pointer text-[length:clamp(4rem,12vw,10rem)] leading-[1.1] font-extrabold whitespace-nowrap text-slate-400/15 transition-[color,text-shadow] duration-200 select-none even:font-normal hover:text-primary hover:text-shadow-(--glow-primary)"
      >
        {item}
      </div>
    ))}
  </div>
);

export default HeroTitle;
