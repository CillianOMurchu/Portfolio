import React from "react";
import HeroTitle from "../HeroTitle/HeroTitle";
import ItemSphere from "../sphere/ItemSphere";
import "./HeroSection.css";

export type ItemType = "SASS" | "Hospitality" | "iGaming" | null;

interface HeroSectionProps {
  selectedItem: ItemType;
  showSphere: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ selectedItem, showSphere }) => {
  return (
    <div className="hero-section">
      <HeroTitle selectedItem={selectedItem} />
      <div className={`sphere-overlay ${showSphere ? "sphere-overlay--visible" : "sphere-overlay--hidden"}`}>
        <ItemSphere visible={showSphere} />
      </div>
    </div>
  );
};

export default HeroSection;
