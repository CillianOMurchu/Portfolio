import React from "react";
import { Button } from "@/components/ui/button";

interface SocialLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  icon: Icon,
  children,
}) => (
  <Button asChild variant="ghost" className="text-primary hover:text-accent-foreground">
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Icon className="size-5" />
      {children}
    </a>
  </Button>
);
