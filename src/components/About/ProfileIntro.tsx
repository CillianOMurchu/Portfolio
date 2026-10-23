// Name at the top of the About page. The detective's face lives inside the Ó.
import React from "react";
import Face from "../Detective/Face";
import { scrollVariants } from "../../utils/animations";
import { Reveal } from "../ui/Reveal";

// The face sits in the italic Ó's counter: centred on the bowl, below the accent.
const FaceInO: React.FC = () => (
  <span className="relative inline-block">
    Ó
    <span aria-hidden className="absolute top-[0.45em] cursor-pointer select-none left-[0.42em] w-[0.3em] -translate-x-1/2 -translate-y-1/2">
      <Face className="block w-full" />
    </span>
  </span>
);

export const ProfileIntro: React.FC = () => (
  <Reveal variants={scrollVariants.section} transition={{ duration: 0.7 }} className="w-full max-w-6xl">
    <p className="label mb-(--space-4)">01 — Profile</p>
    <h1 className="mb-(--space-5) cursor-pointer">
      Cillian
      <em className="block">
        <FaceInO /> Murchú
      </em>
    </h1>
    <p className="label">Creative Engineer</p>
  </Reveal>
);
