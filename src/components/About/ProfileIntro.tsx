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
    className={cn("rounded-full border-4 border-primary/30 object-cover shadow-lg", className)}
  />
);

const ProfileHeader: React.FC = () => (
  <>
    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-primary">
      Cillian
      <span className="block">Ó Murchú</span>
    </h1>
    <p className="mt-8 text-lg text-muted-foreground">Creative Engineer</p>
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
