import React from "react";
import HeroTitle from "../components/HeroTitle/HeroTitle";
import IconShowcase from "../components/IconShowcase/IconShowcase";
import ItemSphere from "../components/sphere/ItemSphere";
import ToggleSphere from "../components/sphere/ToggleSphere";
import { useOrbOrigin } from "../context/OrbOriginContext";

const HomeScreen: React.FC = () => {
  const { showSphere } = useOrbOrigin();

  return (
    <div className="home-screen">
      <div className="home-screen-toggle">
        <ToggleSphere />
      </div>

      <div className={`home-screen-sphere ${showSphere ? "home-screen-sphere--visible" : "home-screen-sphere--hidden"}`}>
        <ItemSphere visible={showSphere} />
      </div>

      <HeroTitle />
      <IconShowcase />
    </div>
  );
};

export default HomeScreen;
