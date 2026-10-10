// Imperative canvas driver for <RainEffect />. Kept out of the component so the
// loop, resize and visibility handling can be tested without a DOM.

import { createDrops, updateDrops, type Drop } from "./rainSimulation";

export interface RainOptions {
  intensity: number; // drops per 10,000 px² of canvas
  wind: number; // px/s, positive = rightwards
  color: string;
}

export const MAX_DROPS = 500;
export const MAX_PIXEL_RATIO = 2;
const AREA_UNIT = 10_000; // px²

export function dropCountFor(width: number, height: number, intensity: number): number {
  const count = Math.round(((width * height) / AREA_UNIT) * Math.max(intensity, 0));
  return Math.min(count, MAX_DROPS);
}

/** Starts the rain on `canvas`; returns a cleanup function. No-op if there's no 2D context. */
export function startRain(canvas: HTMLCanvasElement, { intensity, wind, color }: RainOptions): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
  let drops: Drop[] = [];
  let frameId: number | null = null;
  let resizeFrameId: number | null = null;
  let lastTime: number | null = null;

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;

    const scale = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale); // also resets context state
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.lineWidth = 1;
    drops = createDrops(dropCountFor(w, h, intensity), w, h);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      // Slant the streak along its direction of travel.
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + (wind / drop.speed) * drop.length, drop.y + drop.length);
    }
    ctx.stroke();
  };

  const frame = (now: number) => {
    const dt = lastTime === null ? 0 : (now - lastTime) / 1000;
    lastTime = now;
    updateDrops(drops, dt, width, height, wind);
    draw();
    frameId = requestAnimationFrame(frame);
  };

  const start = () => {
    if (frameId !== null) return;
    lastTime = null; // no dt jump after a pause
    frameId = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (frameId === null) return;
    cancelAnimationFrame(frameId);
    frameId = null;
  };

  const onVisibilityChange = () => (document.hidden ? stop() : start());

  const onResize = () => {
    if (resizeFrameId !== null) return; // already scheduled for this frame
    resizeFrameId = requestAnimationFrame(() => {
      resizeFrameId = null;
      resize();
    });
  };

  resize();
  document.addEventListener("visibilitychange", onVisibilityChange);

  let observer: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(onResize);
    observer.observe(canvas);
  } else {
    window.addEventListener("resize", onResize);
  }

  if (!document.hidden) start();

  return () => {
    stop();
    if (resizeFrameId !== null) cancelAnimationFrame(resizeFrameId);
    resizeFrameId = null;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (observer) observer.disconnect();
    else window.removeEventListener("resize", onResize);
  };
}
