import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiRadio, FiMenu, FiX } from "react-icons/fi";
import { Name } from "../name/Name";

const NAV_LINKS = [
  { href: "/",          icon: FiHome,  label: "Home" },
  { href: "/about",     icon: FiUser,  label: "About" },
  { href: "/streaming", icon: FiRadio, label: "Streaming" },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const goTo = (href: string) => {
    navigate(href);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="navbar fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 bg-black/90 backdrop-blur border-b border-emerald-500/20">
        <div className="navbar-logo">
          <Name />
        </div>

        {/* Desktop links */}
        <nav className="navbar-desktop hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <button
              key={href}
              onClick={() => pathname !== href && goTo(href)}
              disabled={pathname === href}
              className={`navbar-link ${
                pathname === href
                  ? "navbar-link--active"
                  : "navbar-link--inactive"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger md:hidden text-gray-400 hover:text-gray-100 transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="navbar-mobile fixed top-16 left-0 right-0 z-40 bg-black/95 border-b border-emerald-500/20 md:hidden">
          <nav className="navbar-mobile-nav flex flex-col py-2">
            {NAV_LINKS.map(({ href, icon: Icon, label }) => (
              <button
                key={href}
                onClick={() => pathname !== href && goTo(href)}
                disabled={pathname === href}
                className={`navbar-mobile-link ${
                  pathname === href
                    ? "navbar-mobile-link--active"
                    : "navbar-mobile-link--inactive"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
