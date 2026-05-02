import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import InfoBox from "../ui/InfoBox";
import { iconDescriptions } from "../../data/icon-descriptions";

const ORB_SIZE = 8;
const LINE_WIDTH = 56;
const SETTLE_DELAY_MS = 450;
const TYPING_INTERVAL_MS = 22;

const SphereOrb: React.FC = () => {
  const { orbOrigin, hoveredIcon } = useOrbOrigin();
  const [settled, setSettled] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const iconName = hoveredIcon?.name ?? null;

  // Reset and start settle timer whenever the hovered icon name changes
  useEffect(() => {
    setSettled(false);
    setDisplayedText("");
    if (!iconName) return;
    const t = setTimeout(() => setSettled(true), SETTLE_DELAY_MS);
    return () => clearTimeout(t);
  }, [iconName]);

  // Typing effect once settled
  useEffect(() => {
    if (!settled || !iconName) return;
    const desc = iconDescriptions[iconName] ?? iconName;
    let i = 0;
    const t = setInterval(() => {
      if (i < desc.length) {
        setDisplayedText(desc.slice(0, i + 1));
        i++;
      } else {
        clearInterval(t);
      }
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(t);
  }, [settled, iconName]);

  if (!orbOrigin) return null;

  const lineLeft = hoveredIcon ? hoveredIcon.x + ORB_SIZE / 2 : 0;
  const lineTop = hoveredIcon ? hoveredIcon.y - 1 : 0;
  const boxLeft = lineLeft + LINE_WIDTH;
  const boxTop = hoveredIcon ? hoveredIcon.y : 0;
  const desc = iconName ? (iconDescriptions[iconName] ?? iconName) : "";

  return (
    <>
      {/* Flying orb */}
      <AnimatePresence>
        {hoveredIcon && (
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
              x: hoveredIcon.x - ORB_SIZE / 2,
              y: hoveredIcon.y - ORB_SIZE / 2,
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.15 } }}
            transition={{
              x: { type: "spring", stiffness: 280, damping: 22, delay: 0.12 },
              y: { type: "spring", stiffness: 280, damping: 22, delay: 0.12 },
              opacity: { duration: 0.12, ease: "easeOut" },
              scale: { duration: 0.12, ease: "easeOut" },
            }}
          />
        )}
      </AnimatePresence>

      {/* Growing line */}
      <AnimatePresence>
        {settled && hoveredIcon && (
          <motion.div
            key={`line-${iconName}`}
            style={{
              position: "fixed",
              left: lineLeft,
              top: lineTop,
              height: 2,
              backgroundColor: "#10b981",
              boxShadow: "0 0 6px #10b981",
              pointerEvents: "none",
              zIndex: 9998,
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: LINE_WIDTH, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Info box */}
      <AnimatePresence>
        {settled && hoveredIcon && (
          <motion.div
            key={`info-${iconName}`}
            style={{
              position: "fixed",
              left: boxLeft,
              top: boxTop,
              pointerEvents: "none",
              zIndex: 9998,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <div style={{ transform: "translateY(-50%)" }}>
              <InfoBox text={desc} displayedText={displayedText} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SphereOrb;
