import React, { useEffect } from "react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { Name } from "../name/Name";
import { MobileMenu } from "../navigation/MobileMenu";

const Navbar: React.FC = () => {
  const scrollDirection = useScrollDirection();
  const hideHeader = scrollDirection === "down" && window.scrollY > 200;

  // Scroll to top on page refresh
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <header
      className={`border-bottom-neon fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur z-50 transition-transform duration-300 ${hideHeader ? "-translate-y-20" : "translate-y-0"}`}
    >
      <Name />
      <MobileMenu />
    </header>
  );
};

export default Navbar;
