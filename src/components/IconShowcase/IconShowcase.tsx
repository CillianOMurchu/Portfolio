import { AnimatePresence, m } from "framer-motion";
import React, { Suspense, useEffect, useState } from "react";
import { X } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { iconDemos } from "../../data/icon-demos";
import GenericDemo from "./demos/GenericDemo";
import { CUSTOM_DEMOS } from "./demos/index";
import ShowcaseInfo from "./ShowcaseInfo";
import { useIconFlight } from "./useIconFlight";
import { DUR_SLOW, EASE_GALLERY } from "../../utils/animations";

const CONTENT_DELAY_MS = 550;

const BACKDROP =
  "fixed inset-x-0 bottom-0 z-10000 h-[calc(100dvh-8rem)] w-full overflow-x-hidden overflow-y-auto bg-scrim backdrop-blur-lg lg:overflow-hidden";
const LAYOUT =
  "mx-auto flex min-h-full w-full max-w-(--container-lg) flex-col items-center gap-4 px-4 py-4 md:px-8 lg:h-full lg:flex-row lg:items-center lg:gap-10 lg:py-10";
const STAGE =
  "demo-stage flex w-full min-w-0 flex-1 flex-col bg-page px-6 py-6 text-body shadow-float md:px-10 md:py-10 lg:max-h-full lg:min-h-0 lg:flex-none lg:basis-auto lg:overflow-y-auto lg:self-center " +
  "lg:w-auto lg:grow *:flex *:min-h-0 *:flex-col";

const IconShowcase: React.FC = () => {
  const { clickedIcon, setClickedIcon } = useOrbOrigin();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [DemoComponent, setDemoComponent] = useState<React.ComponentType | null>(null);
  const iconRef = useIconFlight(clickedIcon);

  const meta = clickedIcon ? (iconDemos[clickedIcon.name] ?? null) : null;
  const displayName = meta?.displayName ?? clickedIcon?.name ?? "";

  useEffect(() => {
    if (!clickedIcon) {
      setIsContentVisible(false);
      setDemoComponent(null);
      return;
    }

    const timer = setTimeout(() => setIsContentVisible(true), CONTENT_DELAY_MS);

    const loader = CUSTOM_DEMOS[clickedIcon.name];
    if (loader) {
      loader().then((mod) => setDemoComponent(() => mod.default));
    } else {
      setDemoComponent(null);
    }

    return () => clearTimeout(timer);
  }, [clickedIcon]);

  const close = () => setClickedIcon(null);

  if (!clickedIcon) return null;

  return (
    <AnimatePresence>
      <m.div
        key="showcase-backdrop"
        className={BACKDROP}
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

        <div className={LAYOUT} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <ShowcaseInfo
            displayName={displayName}
            svgUrl={clickedIcon.svgUrl}
            meta={meta}
            isContentVisible={isContentVisible}
            iconRef={iconRef}
          />

          <AnimatePresence>
            {isContentVisible && (
              <m.div
                key="content"
                className={STAGE}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR_SLOW, ease: EASE_GALLERY, delay: 0.1 }}
              >
                <Suspense fallback={<p className="label text-center">Loading</p>}>
                  {DemoComponent ? <DemoComponent /> : meta && <GenericDemo name={displayName} meta={meta} />}
                </Suspense>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </AnimatePresence>
  );
};

export default IconShowcase;
