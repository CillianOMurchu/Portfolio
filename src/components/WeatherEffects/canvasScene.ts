// Generic canvas driver shared by the weather effects: DPR-aware sizing, a
// requestAnimationFrame loop with real delta time, rAF-throttled resizing,
// pausing while the tab is hidden, and full cleanup. Each effect supplies a
// Scene; the driver owns the canvas and the clock.

export interface Scene {
  /** Called on start and whenever the canvas's CSS size changes. Context state has just been reset. */
  resize(width: number, height: number, ctx: CanvasRenderingContext2D): void;
  /** Advance by `dt` seconds (0 on the first frame and after a pause, capped at MAX_FRAME_DT). */
  update(dt: number): void;
  /** Draw onto the already-cleared canvas, in CSS pixels. Must leave the transform as it found it. */
  draw(ctx: CanvasRenderingContext2D): void;
}

export const MAX_PIXEL_RATIO = 2;
export const MAX_FRAME_DT = 0.05; // s

/** Runs several scenes on one canvas, in order (later scenes draw on top). */
export function composeScenes(...scenes: Scene[]): Scene {
  return {
    resize(width, height, ctx) {
      for (let i = 0; i < scenes.length; i++) scenes[i].resize(width, height, ctx);
    },
    update(dt) {
      for (let i = 0; i < scenes.length; i++) scenes[i].update(dt);
    },
    draw(ctx) {
      for (let i = 0; i < scenes.length; i++) scenes[i].draw(ctx);
    },
  };
}

/** Starts `scene` on `canvas`; returns a cleanup function. No-op if there's no 2D context. */
export function startCanvasScene(canvas: HTMLCanvasElement, scene: Scene): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
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
    scene.resize(w, h, ctx);
  };

  const frame = (now: number) => {
    const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, MAX_FRAME_DT);
    lastTime = now;
    scene.update(dt);
    ctx.clearRect(0, 0, width, height);
    scene.draw(ctx);
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
