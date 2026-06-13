import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiRadio } from "react-icons/fi";
import { Name } from "../name/Name";
import { MobileMenu } from "../navigation/MobileMenu";
import ToggleSphere from "../sphere/ToggleSphere";

const NAV_LINKS = [
  { href: "/",          icon: FiHome,  label: "Home" },
  { href: "/about",     icon: FiUser,  label: "About" },
  { href: "/streaming", icon: FiRadio, label: "Streaming" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="border-neon-bottom fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur z-50">
      <Name />

      {/* Desktop nav — hidden on mobile */}
      <nav className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => { e.preventDefault(); navigate(href); }}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              pathname === href
                ? "text-accent neon"
                : "text-gray-400 hover:text-gray-100"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <ToggleSphere />
        {/* Hamburger — mobile only */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
