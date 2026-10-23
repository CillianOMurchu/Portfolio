// Light (default) / dark mode, applied as <html data-theme="dark">. Tokens live
// in src/index.css; index.html applies the saved choice before first paint.

export const THEMES = ["light", "dark"] as const;
export type ThemeId = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeId = "light";

const STORAGE_KEY = "portfolio-theme";

export const isThemeId = (value: unknown): value is ThemeId => THEMES.some((id) => id === value);

export function getStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeId(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function setTheme(id: ThemeId): void {
  const root = document.documentElement;
  if (id === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;

  const page = getComputedStyle(root).getPropertyValue("--surface-page").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", page);

  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage unavailable (private mode etc.) — the theme still applies for this visit.
  }
}
