import React from "react";
import { SocialLinks } from "../ui/SocialLinks";

const Footer: React.FC = () => (
  <footer className="footer fixed bottom-0 left-0 right-0 h-16 z-50 flex items-center justify-center bg-black/90 backdrop-blur border-t border-emerald-500/20 py-3">
    <SocialLinks />
  </footer>
);

export default Footer;
