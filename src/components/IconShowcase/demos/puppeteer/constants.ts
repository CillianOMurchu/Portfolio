export type RunState = "idle" | "running" | "done";

export const SCRIPT = [
  { code: "const browser = await puppeteer.launch({ headless: true })", message: "Launching headless Chrome…" },
  { code: "const page = await browser.newPage()", message: "New page created" },
  { code: "await page.goto('https://cillianomurchu.vercel.app')", message: "Navigating to portfolio…" },
  { code: "await page.waitForSelector('.sphere-toggle')", message: "Waiting for sphere toggle…" },
  { code: "await page.click('.sphere-toggle')", message: "Clicked sphere toggle ✓" },
  { code: "await page.waitForSelector('.sphere canvas')", message: "Sphere canvas loaded ✓" },
  { code: "await page.screenshot({ path: 'sphere.png' })", message: "Screenshot captured ✓" },
  { code: "await browser.close()", message: "Browser closed" },
];

export const SCRIPT_FILE = "scraper.js";
export const SCREENSHOT_NAME = "sphere.png — 1280×720";
export const LINE_INTERVAL_MS = 550;

export const RUN_STATE_LABEL: Record<RunState, string> = {
  idle: "idle",
  running: "▶ running",
  done: "✓ done (4.2s)",
};
