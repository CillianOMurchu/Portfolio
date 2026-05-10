import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { iconDemos } from "../../data/icon-demos";
import GenericDemo from "./demos/GenericDemo";
import { CUSTOM_DEMOS } from "./demos/index";

const ICON_SIZE = 72;
const TARGET_Y = 64;
const CONTENT_DELAY_MS = 550;

const IconShowcase: React.FC = () => {
  const { clickedIcon, setClickedIcon } = useOrbOrigin();
  const [contentVisible, setContentVisible] = useState(false);
  const [DemoComponent, setDemoComponent] = useState<React.ComponentType | null>(null);

  const meta = clickedIcon ? (iconDemos[clickedIcon.name] ?? null) : null;
  const displayName = meta?.displayName ?? clickedIcon?.name ?? "";

  useEffect(() => {
    if (!clickedIcon) {
      setContentVisible(false);
      setDemoComponent(null);
      return;
    }

    const t = setTimeout(() => setContentVisible(true), CONTENT_DELAY_MS);

    const loader = CUSTOM_DEMOS[clickedIcon.name];
    if (loader) {
      loader().then((mod) => setDemoComponent(() => mod.default));
    } else {
      setDemoComponent(null);
    }

    return () => clearTimeout(t);
  }, [clickedIcon]);

  const close = () => setClickedIcon(null);

  if (!clickedIcon) return null;

  const accentColor = meta?.accentColor ?? "var(--color-accent-primary)";
  const targetX = window.innerWidth / 2 - ICON_SIZE / 2;

  return (
    <AnimatePresence>
      <motion.div
        key="showcase-backdrop"
        className="showcase-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <button
          className="showcase-close"
          onClick={close}
          aria-label="Close showcase"
        >
          ✕
        </button>

        {/* Floating icon — animates from click position to header */}
        <motion.img
          src={clickedIcon.svgUrl}
          alt={displayName}
          style={{
            position: "fixed",
            width: ICON_SIZE,
            height: ICON_SIZE,
            left: 0,
            top: '4rem',
            zIndex: 10001,
            borderRadius: 12,
            pointerEvents: "none",
          }}
          initial={{
            x: clickedIcon.screenX - ICON_SIZE / 2,
            y: clickedIcon.screenY - ICON_SIZE / 2,
            scale: 1,
          }}
          animate={{
            x: targetX,
            y: TARGET_Y,
            scale: 1,
          }}
          transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9 }}
        />

        {/* Header text — fades in after icon lands */}
        <AnimatePresence>
          {contentVisible && (
            <motion.div
              key="header"
              className="showcase-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ height: ICON_SIZE + 16 }} /> {/* spacer for floating icon */}
              <h2 className="showcase-title" style={{ color: accentColor }}>
                {displayName}
              </h2>
              {meta && (
                <p className="showcase-tagline">{meta.tagline}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Demo area — scrollable content below header */}
        <AnimatePresence>
          {contentVisible && (
            <motion.div
              key="content"
              className="showcase-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Suspense fallback={<p className="text-gray-500 text-sm text-center">Loading...</p>}>
                {DemoComponent ? (
                  <DemoComponent />
                ) : (
                  meta && <GenericDemo name={displayName} meta={meta} />
                )}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default IconShowcase;
