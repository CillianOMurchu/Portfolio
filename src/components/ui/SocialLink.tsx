import { ArrowUpRight } from "lucide-react";
import React from "react";
import { Button } from "./Button";

interface SocialLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

// External link: brand mark, label, then the ↗ arrow, which turns red on hover.
export const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, children }) => (
  <Button
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    variant="ghost"
    size="sm"
    leftIcon={<Icon />}
    rightIcon={<ArrowUpRight strokeWidth={1.5} strokeLinecap="square" />}
    className="[&>span:last-child]:transition-colors hover:[&>span:last-child]:text-accent"
  >
    {children}
  </Button>
);
