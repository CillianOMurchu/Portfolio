// Drives startCanvasScene with stub canvas/window/document objects and a manual
// rAF queue (the Vitest environment is `node`, with no DOM).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { composeScenes, MAX_FRAME_DT, startCanvasScene, type Scene } from "./canvasScene";
import { createStubContext, type StubContext } from "./testUtils";

// ─── Stubs ────────────────────────────────────────────────────────────────────

function stubCanvas(ctx: StubContext | null, width = 800, height = 600) {
  return { clientWidth: width, clientHeight: height, width: 0, height: 0, getContext: vi.fn(() => ctx) };
}
const asCanvas = (c: ReturnType<typeof stubCanvas>) => c as unknown as HTMLCanvasElement;

function stubScene() {
  return { resize: vi.fn(), update: vi.fn(), draw: vi.fn() } satisfies Scene;
}

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
let win: EventTarget & { devicePixelRatio: number };

beforeEach(() => {
  rafQueue = new Map();
  nextFrameId = 1;
  requestAnimationFrameMock.mockClear();
  cancelAnimationFrameMock.mockClear();
  doc = Object.assign(new EventTarget(), { hidden: false });
  win = Object.assign(new EventTarget(), { devicePixelRatio: 1 });
  vi.stubGlobal("document", doc);
  vi.stubGlobal("window", win);
  vi.stubGlobal("requestAnimationFrame", requestAnimationFrameMock);
  vi.stubGlobal("cancelAnimationFrame", cancelAnimationFrameMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─── startCanvasScene ─────────────────────────────────────────────────────────

describe("startCanvasScene", () => {
  it("sizes the scene, then per frame updates with real dt, clears and draws", () => {
    const ctx = createStubContext();
    const scene = stubScene();
    startCanvasScene(asCanvas(stubCanvas(ctx)), scene);

    expect(scene.resize).toHaveBeenCalledWith(800, 600, ctx);
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    runFrame(1000);
    expect(scene.update).toHaveBeenLastCalledWith(0); // first frame: no dt
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    expect(scene.draw).toHaveBeenCalledWith(ctx);

    runFrame(1016);
    expect(scene.update.mock.lastCall?.[0]).toBeCloseTo(0.016);
    expect(scene.draw).toHaveBeenCalledTimes(2);
    expect(rafQueue.size).toBe(1); // keeps scheduling itself
  });

  it("doesn't clear between frames when the scene opts out", () => {
    const ctx = createStubContext();
    const scene = { ...stubScene(), clearEachFrame: false };
    startCanvasScene(asCanvas(stubCanvas(ctx)), scene);
    runFrame(0);
    runFrame(16);
    expect(ctx.clearRect).not.toHaveBeenCalled();
    expect(scene.draw).toHaveBeenCalledTimes(2);
  });

  it("caps dt after a slow frame", () => {
    const scene = stubScene();
    startCanvasScene(asCanvas(stubCanvas(createStubContext())), scene);
    runFrame(0);
    runFrame(2000);
    expect(scene.update).toHaveBeenLastCalledWith(MAX_FRAME_DT);
  });

  it("does not crash or start a loop when getContext returns null", () => {
    const scene = stubScene();
    const cleanup = startCanvasScene(asCanvas(stubCanvas(null)), scene);
    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
    expect(scene.resize).not.toHaveBeenCalled();
    expect(() => cleanup()).not.toThrow();
  });

  it("cancels the frame and removes listeners on cleanup", () => {
    const docRemove = vi.spyOn(doc, "removeEventListener");
    const winRemove = vi.spyOn(win, "removeEventListener");
    const cleanup = startCanvasScene(asCanvas(stubCanvas(createStubContext())), stubScene());
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
    const canvas = asCanvas(stubCanvas(createStubContext()));
    startCanvasScene(canvas, stubScene())();
    const cleanup = startCanvasScene(canvas, stubScene());
    expect(rafQueue.size).toBe(1);
    cleanup();
    expect(rafQueue.size).toBe(0);
  });

  it("pauses when hidden and resumes without a dt jump when visible", () => {
    const scene = stubScene();
    startCanvasScene(asCanvas(stubCanvas(createStubContext())), scene);
    runFrame(0);
    runFrame(16);

    doc.hidden = true;
    doc.dispatchEvent(new Event("visibilitychange"));
    expect(cancelAnimationFrameMock).toHaveBeenCalledTimes(1);
    expect(rafQueue.size).toBe(0);

    doc.hidden = false;
    doc.dispatchEvent(new Event("visibilitychange"));
    expect(rafQueue.size).toBe(1);

    runFrame(60_000); // a minute later
    expect(scene.update).toHaveBeenLastCalledWith(0);
  });

  it("doesn't start the loop while the page is hidden", () => {
    doc.hidden = true;
    startCanvasScene(asCanvas(stubCanvas(createStubContext())), stubScene());
    expect(requestAnimationFrameMock).not.toHaveBeenCalled();
  });

  it("caps the backing-store scale at 2 when devicePixelRatio is 3", () => {
    win.devicePixelRatio = 3;
    const ctx = createStubContext();
    const canvas = stubCanvas(ctx, 800, 600);
    const scene = stubScene();
    startCanvasScene(asCanvas(canvas), scene);
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
    expect(scene.resize).toHaveBeenCalledWith(800, 600, ctx); // scenes work in CSS px
  });

  it("throttles window resizes to one per frame and skips unchanged sizes", () => {
    const canvas = stubCanvas(createStubContext(), 800, 600);
    const scene = stubScene();
    startCanvasScene(asCanvas(canvas), scene);
    requestAnimationFrameMock.mockClear();

    canvas.clientWidth = 1000;
    canvas.clientHeight = 500;
    win.dispatchEvent(new Event("resize"));
    win.dispatchEvent(new Event("resize"));
    win.dispatchEvent(new Event("resize"));
    expect(requestAnimationFrameMock).toHaveBeenCalledTimes(1);

    runFrame(0);
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(500);
    expect(scene.resize).toHaveBeenCalledTimes(2);
    expect(scene.resize).toHaveBeenLastCalledWith(1000, 500, expect.anything());

    win.dispatchEvent(new Event("resize")); // same size
    runFrame(16);
    expect(scene.resize).toHaveBeenCalledTimes(2);
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
    const canvas = stubCanvas(createStubContext(), 800, 600);

    const cleanup = startCanvasScene(asCanvas(canvas), stubScene());
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

// ─── composeScenes ────────────────────────────────────────────────────────────

describe("composeScenes", () => {
  it("forwards resize, update and draw to each scene in order", () => {
    const order: string[] = [];
    const tracked = (name: string): Scene => ({
      resize: (w, h) => order.push(`${name}.resize(${w},${h})`),
      update: (dt) => order.push(`${name}.update(${dt})`),
      draw: () => order.push(`${name}.draw`),
    });
    const scene = composeScenes(tracked("back"), tracked("front"));
    const ctx = createStubContext() as unknown as CanvasRenderingContext2D;

    scene.resize(10, 20, ctx);
    scene.update(0.5);
    scene.draw(ctx);

    expect(order).toEqual([
      "back.resize(10,20)",
      "front.resize(10,20)",
      "back.update(0.5)",
      "front.update(0.5)",
      "back.draw",
      "front.draw",
    ]);
  });
});
