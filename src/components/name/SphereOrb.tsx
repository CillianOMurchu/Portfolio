import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrbOrigin } from "../../context/OrbOriginContext";

const ORB_SIZE = 8;

const SphereOrb: React.FC = () => {
  const { orbOrigin, hoveredIconPosition } = useOrbOrigin();

  if (!orbOrigin) return null;

  return (
    <AnimatePresence>
      {hoveredIconPosition && (
        <motion.div
          key="sphere-orb"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: ORB_SIZE,
            height: ORB_SIZE,
            borderRadius: "50%",
            backgroundColor: "#10b981",
            boxShadow: "0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981",
            pointerEvents: "none",
            zIndex: 9999,
          }}
          initial={{
            x: orbOrigin.x - ORB_SIZE / 2,
            y: orbOrigin.y - ORB_SIZE / 2,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: hoveredIconPosition.x - ORB_SIZE / 2,
            y: hoveredIconPosition.y - ORB_SIZE / 2,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0,
            transition: { duration: 0.15 },
          }}
          transition={{
            x: { type: "spring", stiffness: 280, damping: 22, delay: 0.12 },
            y: { type: "spring", stiffness: 280, damping: 22, delay: 0.12 },
            opacity: { duration: 0.12, ease: "easeOut" },
            scale: { duration: 0.12, ease: "easeOut" },
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default SphereOrb;
