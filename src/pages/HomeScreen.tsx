import React from "react";
import { motion } from "framer-motion";
import HeroSection, { type ItemType } from "../components/HeroSection/HeroSection";
import IconShowcase from "../components/IconShowcase/IconShowcase";
import { useOrbOrigin } from "../context/OrbOriginContext";

const BACKGROUND = "linear-gradient(135deg, #0a0e1a 0%, #131a28 100%)";
const selectedItem: ItemType = null;

const HomeScreen: React.FC = () => {
  const { showSphere } = useOrbOrigin();

  return (
    <motion.div
      className="home-screen relative h-full"
      animate={{ background: BACKGROUND }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <HeroSection selectedItem={selectedItem} showSphere={showSphere} />
      <IconShowcase />
    </motion.div>
  );
};

export default HomeScreen;
