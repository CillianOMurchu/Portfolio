import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { iconDemos } from "../../data/icon-demos";
import GenericDemo from "./demos/GenericDemo";
import { CUSTOM_DEMOS } from "./demos/index";

const ICON_SIZE = 72;
const NAVBAR_HEIGHT = 64; // px — matches top: 4rem on .showcase-backdrop
const HEADER_ICON_TOP = 48; // px — margin-top on .showcase-header (3rem)
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

  // Final resting position of the icon in viewport coords
  const iconTargetX = window.innerWidth / 2 - ICON_SIZE / 2;
  const iconTargetY = NAVBAR_HEIGHT + HEADER_ICON_TOP;

  // Initial offset from resting position (where the click happened)
  const iconInitialX = clickedIcon.screenX - ICON_SIZE / 2 - iconTargetX;
  const iconInitialY = clickedIcon.screenY - ICON_SIZE / 2 - iconTargetY;

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

        {/* Header — icon sits above the title as a normal flex item */}
        <div className="showcase-header">
          <motion.img
            src={clickedIcon.svgUrl}
            alt={displayName}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              borderRadius: 12,
              pointerEvents: "none",
              flexShrink: 0,
            }}
            initial={{ x: iconInitialX, y: iconInitialY }}
            animate={{ x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9 }}
          />

          {/* Title and tagline fade in after icon lands */}
          {contentVisible && (
            <>
              <motion.h2
                className="showcase-title"
                style={{ color: accentColor }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {displayName}
              </motion.h2>
              {meta && (
                <motion.p
                  className="showcase-tagline"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                >
                  {meta.tagline}
                </motion.p>
              )}
            </>
          )}
        </div>

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
