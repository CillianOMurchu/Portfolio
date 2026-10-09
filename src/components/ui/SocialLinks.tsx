import React from "react";
import { SocialLink } from "./SocialLink";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

export const SocialLinks: React.FC = () => (
  <div className="flex items-center justify-center gap-3">
    <SocialLink href="https://github.com/CillianOMurchu" icon={GithubIcon}>
      GitHub
    </SocialLink>
    <SocialLink href="https://linkedin.com/in/CillianOMurchu" icon={LinkedinIcon}>
      LinkedIn
    </SocialLink>
  </div>
);
