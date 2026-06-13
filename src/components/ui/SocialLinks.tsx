import React from "react";
import { SocialLink } from "./SocialLink";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const SocialLinks: React.FC = () => (
  <div className="social-links flex gap-3 justify-center items-center">
    <SocialLink href="https://github.com/CillianOMurchu" icon={FaGithub}>
      Github
    </SocialLink>
    <SocialLink href="https://linkedin.com/in/CillianOMurchu" icon={FaLinkedin}>
      LinkedIn
    </SocialLink>
  </div>
);
