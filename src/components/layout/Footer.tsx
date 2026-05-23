import React from "react";
import { SocialLinks } from "../ui/SocialLinks";
import "./site-footer.css";

const Footer: React.FC = () => (
  <footer
    className="site-footer fixed bottom-0 left-0 z-50 w-full bg-gray-900 text-gray-300 py-2 flex items-center justify-center border-top-neon"
  >
    <div className="absolute top-0 left-0 w-full" />
    <SocialLinks />
    {/* <a
      href="/contact"
      className="mt-4 text-emerald-400 hover:underline cursor-pointer transition-colors duration-200"
      aria-label="Contact via email"
    >
      cillian.murchu@gmail.com
    </a> */}
  </footer>
);

export default Footer;
