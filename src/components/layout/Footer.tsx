import React from "react";
import { SocialLinks } from "../ui/SocialLinks";

const Footer: React.FC = () => (
  <footer className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-center border-t bg-page/88 px-(--gutter) backdrop-blur-[10px]">
    <SocialLinks />
  </footer>
);

export default Footer;
