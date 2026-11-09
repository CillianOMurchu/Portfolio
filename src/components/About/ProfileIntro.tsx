// Name at the top of the About page, filling the first screen (the work history
// starts below the fold). On desktop the detective's face lives inside the Ó.
import React from "react";
import Face from "../Detective/Face";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { scrollVariants } from "../../utils/animations";
import { Reveal } from "../ui/Reveal";

// Tailwind's md breakpoint. Touch screens get no face: it's a hover toy.
const DESKTOP = "(min-width: 48rem)";

// The face sits in the Ó's counter: centred on the bowl, below the accent.
// Not rendered at all on mobile, so its pointer listeners don't run either.
const FaceInO: React.FC = () => {
  const isDesktop = useMediaQuery(DESKTOP);
  if (!isDesktop) return <>Ó</>;

  return (
    <span className="relative inline-block">
      Ó
      <span
        aria-hidden
        className="absolute top-[0.45em] cursor-pointer select-none left-[0.33em] w-[0.28em] -translate-x-1/2 -translate-y-1/2"
      >
        <Face className="block w-full" />
      </span>
    </span>
  );
};

export const ProfileIntro: React.FC = () => (
  <Reveal
    variants={scrollVariants.section}
    transition={{ duration: 0.7 }}
    className="flex min-h-[calc(100dvh-8rem)] w-full max-w-6xl flex-col justify-center"
  >
    <p className="label mb-(--space-4)">01 — Profile</p>
    <h1 className="mb-(--space-5) md:cursor-pointer">
      Cillian
      <em className="block">
        <FaceInO /> Murchú
      </em>
    </h1>
    <p className="label">Creative Engineer</p>
  </Reveal>
);
