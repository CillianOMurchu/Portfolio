// Colour themes. Palettes live in src/index.css; index.html applies the saved one before first paint.

export const THEMES = [
  { id: "emerald", label: "Neon Emerald", swatch: "#10b981" },
  { id: "ultraviolet", label: "Ultraviolet Noir", swatch: "#a06ef7" },
  { id: "amber", label: "Molten Amber", swatch: "#faa005" },
  { id: "magenta", label: "Hot Magenta", swatch: "#f250a6" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

// "emerald" is the :root palette, so it is applied by removing data-theme.
export const DEFAULT_THEME: ThemeId = "emerald";

const STORAGE_KEY = "portfolio-theme";
const TRANSITION_MS = 300;

export const isThemeId = (value: unknown): value is ThemeId => THEMES.some((t) => t.id === value);

export function getStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeId(stored) ? stored : DEFAULT_THEME;
  } catch (error) {
    console.error("Could not read saved colour theme:", error);
    return DEFAULT_THEME;
  }
}

export function setTheme(id: ThemeId): void {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  if (id === "emerald") delete root.dataset.theme;
  else root.dataset.theme = id;
  window.setTimeout(() => root.classList.remove("theme-transition"), TRANSITION_MS);

  const background = getComputedStyle(root).getPropertyValue("--background").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", background);

  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch (error) {
    // Storage unavailable (private mode etc.) — the theme still applies for this visit.
    console.error("Could not save colour theme:", error);
  }
}
