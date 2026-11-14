import { useLayoutEffect } from "react";
import { useAnimate } from "framer-motion";
import type { ClickedIcon } from "../../context/OrbOriginContext";
import { DUR_SLOW, EASE_GALLERY } from "../../utils/animations";

/**
 * Flies the showcase icon from where it was clicked on the sphere to wherever the
 * layout places it. Measures the landing spot, so it works for any layout.
 */
export function useIconFlight(clickedIcon: ClickedIcon) {
  const [iconRef, animate] = useAnimate<HTMLImageElement>();

  useLayoutEffect(() => {
    const icon = iconRef.current;
    if (!clickedIcon || !icon) return;
    const landing = icon.getBoundingClientRect();
    const fromX = clickedIcon.screenX - (landing.left + landing.width / 2);
    const fromY = clickedIcon.screenY - (landing.top + landing.height / 2);
    // Start at the click point before the first paint, then fly home.
    icon.style.transform = `translate(${fromX}px, ${fromY}px)`;
    animate(icon, { x: [fromX, 0], y: [fromY, 0] }, { duration: DUR_SLOW, ease: EASE_GALLERY });
  }, [clickedIcon, animate, iconRef]);

  return iconRef;
}
