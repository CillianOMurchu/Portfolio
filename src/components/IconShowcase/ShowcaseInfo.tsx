import type { Ref } from "react";
import { m } from "framer-motion";
import type { IconDemoMeta } from "../../data/icon-demos";
import { DUR_BASE, EASE_OUT } from "../../utils/animations";

interface ShowcaseInfoProps {
  displayName: string;
  svgUrl: string;
  meta: IconDemoMeta | null;
  isContentVisible: boolean;
  iconRef: Ref<HTMLImageElement>;
}

const ASIDE =
  "flex w-full shrink-0 flex-col items-center gap-2 text-center lg:w-72 lg:items-start lg:gap-4 lg:pt-6 lg:text-left";
const ICON = "pointer-events-none size-11 shrink-0 lg:size-16";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DUR_BASE, ease: EASE_OUT, delay },
});

/** Icon, name and context for the selected tool — a header on mobile, a sidebar on desktop. */
export default function ShowcaseInfo({ displayName, svgUrl, meta, isContentVisible, iconRef }: ShowcaseInfoProps) {
  return (
    <aside className={ASIDE}>
      <img ref={iconRef} src={svgUrl} alt={displayName} className={ICON} />
      {isContentVisible && (
        <>
          <m.h2 className="m-0 max-w-full text-3xl wrap-break-word" {...fadeIn(0)}>{displayName}</m.h2>
          {meta && (
            <m.p className="m-0 max-w-64 text-sm leading-snug text-muted lg:max-w-none lg:text-md" {...fadeIn(0.05)}>
              {meta.tagline}
            </m.p>
          )}
        </>
      )}
    </aside>
  );
}
