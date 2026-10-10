// The project's Vitest environment is `node` (no jsdom / Testing Library), so:
// - markup and reduced-motion behaviour are checked with react-dom/server;
// - the effect's canvas loop (startRain) is driven directly with stub
//   canvas/context/window/document objects and a manual rAF queue.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import RainEffect from "./RainEffect";
import { dropCountFor, MAX_DROPS, startRain } from "./rainLoop";

// ─── Stubs ────────────────────────────────────────────────────────────────────

function stubContext() {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setTransform: vi.fn(),
    scale: vi.fn(),
    strokeStyle: "",
    lineWidth: 0,
  };
}
type StubContext = ReturnType<typeof stubContext>;

function stubCanvas(ctx: StubContext | null, width = 800, height = 600) {
  return {
    clientWidth: width,
    clientHeight: height,
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
  };
}
const asCanvas = (c: ReturnType<typeof stubCanvas>) => c as unknown as HTMLCanvasElement;

let rafQueue: Map<number, FrameRequestCallback>;
let nextFrameId: number;
const requestAnimationFrameMock = vi.fn((cb: FrameRequestCallback) => {
  const id = nextFrameId++;
  rafQueue.set(id, cb);
  return id;
});
const cancelAnimationFrameMock = vi.fn((id: number) => {
  rafQueue.delete(id);
});

/** Runs every callback queued for the next frame. */
function runFrame(time: number) {
  const callbacks = [...rafQueue.values()];
  rafQueue.clear();
  callbacks.forEach((cb) => cb(time));
}

let doc: EventTarget & { hidden: boolean };
let win: EventTarget & { devicePixelRatio: number; matchMedia: (query: string) => { matches: boolean } };

function setReducedMotion(reduce: boolean) {
  win.matchMedia = vi.fn((query: string) => ({ matches: reduce && query === "(prefers-reduced-motion: reduce)" }));
}

beforeEach(() => {
  rafQueue = new Map();
  nextFrameId = 1;
  requestAnimationFrameMock.mockClear();
  cancelAnimationFrameMock.mockClear();

  doc = Object.assign(new EventTarget(), { hidden: false });
  win = Object.assign(new EventTarget(), { devicePixelRatio: 1, matchMedia: () => ({ matches: false }) });
  setReducedMotion(false);

  vi.stubGlobal("document", doc);
  vi.stubGlobal("window", win);
  vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
  vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── <RainEffect /> markup ────────────────────────────────────────────────────

describe("<RainEffect />", () => {
  it("renders a decorative, click-through, full-viewport canvas", () => {
    const html = renderToStaticMarkup(<RainEffect />);
    expect(html).toMatch(/^<canvas /);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("pointer-events-none");
    expect(html).toContain("fixed");
    expect(html).toContain("inset-0");
  });

  it("merges a custom className", () => {
    expect(renderToStaticMarkup(<RainEffect className="opacity-50" />)).toContain("opacity-50");
  });

  it("renders nothing when prefers-reduced-motion is reduce", () => {
    setReducedMotion(true);
    expect(renderToStaticMarkup(<RainEffect />)).toBe("");
    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });
});

// ─── startRain (the component's effect) ──────────────────────────────────────

const OPTIONS = { intensity: 1, wind: 0, color: "rgba(174,194,224,0.5)" };

describe("startRain", () => {
  it("starts the loop and strokes once per frame, not once per drop", () => {
    const ctx = stubContext();
    startRain(asCanvas(stubCanvas(ctx)), OPTIONS);
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    runFrame(0);
    const drops = dropCountFor(800, 600, 1);
    expect(drops).toBeGreaterThan(1);
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.moveTo).toHaveBeenCalledTimes(drops);
    expect(ctx.lineTo).toHaveBeenCalledTimes(drops);
    expect(ctx.stroke).toHaveBeenCalledTimes(1);
    expect(ctx.strokeStyle).toBe(OPTIONS.color);

    runFrame(16);
    expect(ctx.stroke).toHaveBeenCalledTimes(2);
    expect(rafQueue.size).toBe(1); // keeps scheduling itself
  });

  it("caps the total number of drops", () => {
    expect(dropCountFor(3840, 2160, 10)).toBe(MAX_DROPS);
    expect(dropCountFor(800, 600, 0)).toBe(0);
  });

  it("does not crash or start a loop when getContext returns null", () => {
    const cleanup = startRain(asCanvas(stubCanvas(null)), OPTIONS);
    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });

  it("cancels the frame and removes listeners on cleanup", () => {
    const docRemove = vi.spyOn(doc, "removeEventListener");
    const winRemove = vi.spyOn(win, "removeEventListener");
    const cleanup = startRain(asCanvas(stubCanvas(stubContext())), OPTIONS);
    const [frameId] = rafQueue.keys();

    cleanup();

    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(frameId);
    expect(rafQueue.size).toBe(0);
    expect(docRemove).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(winRemove).toHaveBeenCalledWith("resize", expect.any(Function));

    // Late events must not restart anything.
    doc.dispatchEvent(new Event("visibilitychange"));
    win.dispatchEvent(new Event("resize"));
    expect(rafQueue.size).toBe(0);
  });

  it("is safe to start, clean up and start again (StrictMode double effect)", () => {
    const canvas = asCanvas(stubCanvas(stubContext()));
    startRain(canvas, OPTIONS)();
    const cleanup = startRain(canvas, OPTIONS);
    expect(rafQueue.size).toBe(1);
    cleanup();
    expect(rafQueue.size).toBe(0);
  });

  it("pauses when hidden and resumes without a dt jump when visible", () => {
    const ctx = stubContext();
    startRain(asCanvas(stubCanvas(ctx)), OPTIONS);
    runFrame(0);
    runFrame(16);
    const lastPositions = ctx.moveTo.mock.calls.slice(-dropCountFor(800, 600, 1));

    doc.hidden = true;
    doc.dispatchEvent(new Event("visibilitychange"));
    expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);
    expect(rafQueue.size).toBe(0);

    doc.hidden = false;
    doc.dispatchEvent(new Event("visibilitychange"));
    expect(rafQueue.size).toBe(1);

    ctx.moveTo.mockClear();
    runFrame(60_000); // a minute later: first frame after resume uses dt = 0
    expect(ctx.moveTo.mock.calls).toEqual(lastPositions);
  });

  it("doesn't start the loop while the page is hidden", () => {
    doc.hidden = true;
    startRain(asCanvas(stubCanvas(stubContext())), OPTIONS);
    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });

  it("caps the backing-store scale at 2 when devicePixelRatio is 3", () => {
    win.devicePixelRatio = 3;
    const ctx = stubContext();
    const canvas = stubCanvas(ctx, 800, 600);
    startRain(asCanvas(canvas), OPTIONS);
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it("throttles window resizes to one per frame and resizes the canvas", () => {
    const ctx = stubContext();
    const canvas = stubCanvas(ctx, 800, 600);
    startRain(asCanvas(canvas), OPTIONS);
    requestAnimationFrameMock.mockClear();

    canvas.clientWidth = 1000;
    canvas.clientHeight = 500;
    win.dispatchEvent(new Event("resize"));
    win.dispatchEvent(new Event("resize"));
    win.dispatchEvent(new Event("resize"));
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    runFrame(0); // runs the queued resize
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(500);

    ctx.moveTo.mockClear();
    runFrame(16); // next draw uses drops recreated for the new size
    expect(ctx.moveTo).toHaveBeenCalledTimes(dropCountFor(1000, 500, 1));
  });

  it("uses ResizeObserver when available and disconnects it on cleanup", () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    let callback: (() => void) | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: () => void) {
          callback = cb;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    const winAdd = vi.spyOn(win, "addEventListener");
    const canvas = stubCanvas(stubContext(), 800, 600);

    const cleanup = startRain(asCanvas(canvas), OPTIONS);
    expect(observe).toHaveBeenCalledWith(canvas);
    expect(winAdd).not.toHaveBeenCalledWith("resize", expect.any(Function));

    canvas.clientWidth = 400;
    callback?.();
    runFrame(0);
    expect(canvas.width).toBe(400);

    cleanup();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
