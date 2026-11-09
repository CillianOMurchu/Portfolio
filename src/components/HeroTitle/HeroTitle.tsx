import React from "react";
import { Link } from "react-router-dom";

// Each industry links to the role it came from: About opens that role's panel from the fragment.
const HERO_ITEMS = [
  { label: "SASS", slug: "maslo", role: "Maslo" },
  { label: "Hospitality", slug: "lighthouse", role: "Lighthouse" },
  { label: "iGaming", slug: "betsson", role: "Betsson Group" },
] as const;

// Wall text: faint tinted words that fill with colour on hover, blue and coral alternating.
const HeroTitle: React.FC = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    {HERO_ITEMS.map(({ label, slug, role }) => (
      <Link
        key={slug}
        to={`/about#${slug}`}
        aria-label={`${label}: my work at ${role}`}
        className="font-display text-6xl leading-(--leading-tight) tracking-display whitespace-nowrap text-accent/20 no-underline transition-colors duration-(--dur-slow) ease-out select-none even:text-highlight/20 hover:text-accent focus-visible:text-accent focus-visible:outline-none even:hover:text-highlight even:focus-visible:text-highlight"
      >
        {label}
      </Link>
    ))}
  </div>
);

export default HeroTitle;
