import { AnimatePresence, m } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { X } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { iconDemos } from "../../data/icon-demos";
import GenericDemo from "./demos/GenericDemo";
import { CUSTOM_DEMOS } from "./demos/index";
import { DUR_BASE, DUR_SLOW, EASE_GALLERY, EASE_OUT } from "../../utils/animations";

const ICON_SIZE = 44;
const NAVBAR_HEIGHT = 64; // px — matches top: 4rem on .showcase-backdrop
const HEADER_ICON_TOP = 12; // px — margin-top on .showcase-header (0.75rem)
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

  // Final resting position of the icon in viewport coords
  const iconTargetX = window.innerWidth / 2 - ICON_SIZE / 2;
  const iconTargetY = NAVBAR_HEIGHT + HEADER_ICON_TOP;

  // Initial offset from resting position (where the click happened)
  const iconInitialX = clickedIcon.screenX - ICON_SIZE / 2 - iconTargetX;
  const iconInitialY = clickedIcon.screenY - ICON_SIZE / 2 - iconTargetY;

  return (
    <AnimatePresence>
      <m.div
        key="showcase-backdrop"
        className="fixed inset-x-0 bottom-0 z-10000 flex h-[calc(100dvh-8rem)] w-full flex-col items-center overflow-x-hidden overflow-y-auto bg-scrim px-4 backdrop-blur-lg md:overflow-x-visible md:px-0 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <IconButton
          round
          size="sm"
          className="fixed top-4 right-6 z-10002 bg-card"
          onClick={close}
          label="Close showcase"
          icon={<X strokeWidth={1.5} strokeLinecap="square" />}
        />

        {/* Header — icon sits above the title as a normal flex item */}
        <div className="mt-3 flex w-full max-w-(--container-sm) flex-col items-center justify-center gap-1.5 px-6 pt-2 text-center">
          <m.img
            src={clickedIcon.svgUrl}
            alt={displayName}
            style={{
              width: ICON_SIZE,
              height: ICON_SIZE,
              pointerEvents: "none",
              flexShrink: 0,
            }}
            initial={{ x: iconInitialX, y: iconInitialY }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: DUR_SLOW, ease: EASE_GALLERY }}
          />

          {/* Title and tagline fade in after icon lands */}
          {contentVisible && (
            <div className="flex min-w-0 flex-col items-center gap-0.5">
              <m.h2
                className="m-0 text-3xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR_BASE, ease: EASE_OUT }}
              >
                {displayName}
              </m.h2>
              {meta && (
                <m.p
                  className="m-0 max-w-64 text-sm leading-snug text-muted"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR_BASE, ease: EASE_OUT, delay: 0.05 }}
                >
                  {meta.tagline}
                </m.p>
              )}
            </div>
          )}
        </div>

        {/* Demo area — scrollable content below header. The demos mock other tools'
          dark UIs, so the stage is a local dark-mode scope in both themes. */}
        <AnimatePresence>
          {contentVisible && (
            <m.div
              key="content"
              data-theme="dark"
              className="demo-stage my-4 flex min-h-0 w-full max-w-(--container-sm) flex-1 flex-col overflow-y-auto bg-page px-6 py-6 text-body shadow-float *:flex *:min-h-0 *:flex-1 *:flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR_SLOW, ease: EASE_GALLERY, delay: 0.1 }}
            >
              <Suspense fallback={<p className="label text-center">Loading</p>}>
                {DemoComponent ? (
                  <DemoComponent />
                ) : (
                  meta && <GenericDemo name={displayName} meta={meta} />
                )}
              </Suspense>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </AnimatePresence>
  );
};

export default IconShowcase;
