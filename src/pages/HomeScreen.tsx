import React from "react";
import HeroTitle from "../components/HeroTitle/HeroTitle";
import IconShowcase from "../components/IconShowcase/IconShowcase";
import ItemSphere from "../components/sphere/ItemSphere";
import ToggleSphere from "../components/sphere/ToggleSphere";
import { useOrbOrigin } from "../context/OrbOriginContext";

const HomeScreen: React.FC = () => {
  const { showSphere } = useOrbOrigin();

  return (
    <div className="relative h-full w-full bg-linear-135 from-background to-card">
      <div className="absolute top-4 right-4 z-20 md:top-6 md:right-6">
        <ToggleSphere />
      </div>

      <div className={`fixed inset-0 z-1 transition-opacity duration-400 ${showSphere ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <ItemSphere visible={showSphere} />
      </div>

      <HeroTitle />
      <IconShowcase />
    </div>
  );
};

export default HomeScreen;
