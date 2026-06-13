import React from "react";
import type { IconType } from "react-icons/lib";

interface SocialLinkProps {
  href: string;
  icon: IconType;
  children: React.ReactNode;
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon: Icon,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="social-link flex items-center gap-2 px-4 py-2 rounded text-emerald-400 hover:text-emerald-200 transition-colors"
  >
    <Icon className="social-link-icon w-5 h-5" />
    <span className="social-link-text text-sm font-medium">{children}</span>
  </a>
);
