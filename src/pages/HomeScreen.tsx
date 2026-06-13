import React from "react";
import HeroTitle from "../components/HeroTitle/HeroTitle";
import IconShowcase from "../components/IconShowcase/IconShowcase";
import ItemSphere from "../components/sphere/ItemSphere";
import ToggleSphere from "../components/sphere/ToggleSphere";
import { useOrbOrigin } from "../context/OrbOriginContext";

const HomeScreen: React.FC = () => {
  const { showSphere } = useOrbOrigin();

  return (
    <div className="home-screen" style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #0a0e1a 0%, #131a28 100%)", position: "relative" }}>
      <div className="home-screen-toggle" style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 20 }}>
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
