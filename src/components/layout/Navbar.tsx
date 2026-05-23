import React, { useEffect } from "react";
import { Name } from "../name/Name";
import { MobileMenu } from "../navigation/MobileMenu";

const Navbar: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <header className="border-bottom-neon fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur z-50">
      <Name />
      <MobileMenu />
    </header>
  );
};

export default Navbar;
