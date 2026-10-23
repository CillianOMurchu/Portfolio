// Portrait + name at the top of the About page. Desktop sets them side by side,
// each sliding in from its own side; mobile stacks them and reveals them together.
import React from "react";
import profileImage from "../../assets/about/profile.webp";
import { cn } from "../../lib/utils";
import { scrollVariants } from "../../utils/animations";
import { Reveal } from "../ui/Reveal";

const ProfileImage: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={profileImage}
    alt="Portrait of Cillian O'Murchu"
    width={800}
    height={800}
    decoding="async"
    className={cn("rounded-full object-cover grayscale", className)}
  />
);

const ProfileHeader: React.FC = () => (
  <>
    <p className="label mb-(--space-4)">01 — Profile</p>
    <h1 className="mb-(--space-5)">
      Cillian
      <em className="block">Ó Murchú</em>
    </h1>
    <p className="label">Creative Engineer</p>
  </>
);

export const ProfileIntro: React.FC = () => (
  <>
    <div className="hidden w-full max-w-6xl items-start gap-12 md:flex">
      <Reveal variants={scrollVariants.slideInRight} className="shrink-0">
        <ProfileImage className="size-80" />
      </Reveal>
      <Reveal variants={scrollVariants.slideInLeft} className="flex flex-1 flex-col justify-center self-center">
        <ProfileHeader />
      </Reveal>
    </div>

    <Reveal variants={scrollVariants.section} transition={{ duration: 0.7 }} className="flex flex-col items-center text-center md:hidden">
      <ProfileImage className="mb-6 aspect-square w-full max-w-100" />
      <ProfileHeader />
    </Reveal>
  </>
);
