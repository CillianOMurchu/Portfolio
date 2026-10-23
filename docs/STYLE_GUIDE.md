# Style Guide

## TypeScript

**Types over interfaces for unions and primitives. Interfaces for object shapes.**

```ts
// Good
type ItemType = "SASS" | "Hospitality" | "iGaming" | null;
interface ThemeConfig { background: string; accentColor: string; }

// Avoid
type ThemeConfig = { background: string; accentColor: string; }
```

**No `any`. Type external APIs with local interfaces (see Streaming.tsx pattern):**

```ts
interface TwitchPlayer {
  addEventListener(event: string, callback: () => void): void;
  destroy(): void;
}
declare global {
  interface Window { Twitch: { Player: TwitchPlayerConstructor }; }
}
```

**Module-level constants for values used in multiple places or that need a name:**

```ts
// Good — named, reusable, no recreation on render
const HERO_ITEMS = [...] as const;
const DRAG_VELOCITY_MULTIPLIER = 0.0002;

// Avoid — recreated on every render
const HeroTitle = () => {
  const items = [...];
};
```

**Prefer named exports for components, default exports are fine too — just be consistent within a folder.**

---

## Components

**Max ~150 lines per file.** If a component grows beyond that, extract sub-components into the same folder (not a new folder unless there are 3+).

**Co-location rule:** If a hook, util, type, or CSS file is only used by one feature, it lives in that feature's folder (`components/sphere/`, `components/name/`, etc.).

**Component file structure:**

```ts
// 1. Imports
import React, { useState } from "react";
import { m } from "framer-motion";
import { scrollVariants } from "../../utils/animations";

// 2. Module-level constants (before component)
const ITEMS = [...] as const;

// 3. Component
const MyComponent: React.FC<Props> = ({ prop }) => {
  // hooks first
  // derived values
  // handlers
  // return JSX
};

export default MyComponent;
```

**No inline function definitions in JSX for non-trivial logic.** Pull handlers up to the component body.

---

## Styling

### Order of preference

1. **UI primitives** (`components/ui/`) — `Button`, `IconButton`, `Input`, `Switch`, `Checkbox`, `Badge`, `Tag`, `Card`, `Avatar`, `Tabs`; shadcn `sheet` / `dropdown-menu` for overlays
2. **Tailwind utilities with semantic tokens** — `bg-page`, `bg-card`, `text-strong`, `text-muted`, `border-hairline`; plus layout/spacing/responsive utilities
3. **Inline `style` prop** — only for dynamic values that can't be expressed in CSS (animation state, calculated positions)

### Look and feel ("white marble, gallery daylight")

- One accent only: red (`bg-accent`, `text-accent-text` for text). Use sparingly — a dot, a hover, an active thumb. Never large red areas except the accent button.
- Square corners; `rounded-xs` (2px) on buttons; `rounded-pill` only for tags and switches. 1px hairline rules (`border`, `rule`) carry structure.
- No glows, gradients or hard shadows. `shadow-paper` / `shadow-lift` / `shadow-float` only for raised or floating things.
- Motion: `ease-gallery` for movement and reveals, `ease-out` for colour; durations `duration-(--dur-fast|base|slow|slower)`. In Framer Motion use `EASE_GALLERY` / `DUR_*` from `utils/animations.ts`. No springs or overshoot.
- Hover = inversion (outline → ink, ink → red), underline drawing in, or a 4px lift. Focus = `focus-visible:shadow-focus`. Disabled = 40% opacity.
- Icons: lucide with `strokeWidth={1.5}` and `strokeLinecap="square"`. No emoji.

### Type scale

Bodoni Moda (`font-display`, weight 400) for headings — never bold; put one word per headline in `<em>`. Archivo (`font-sans`) for UI and body. IBM Plex Mono via the `label` class for small uppercase labels, indices, dates and metadata. Loaded from Google Fonts in `index.html`.

| Class | Size | Use |
|---|---|---|
| `text-2xs` / `label` | 11px | catalogue labels, badges, counts |
| `text-xs` | 12px | hints, captions |
| `text-sm` | 14px | nav, tags, secondary text |
| `text-md` | 16px | body (default) — there is no `text-base` |
| `text-lg` | 19px | subtitles, `h4` |
| `text-xl` | 24px | large input text |
| `text-2xl` | 28–36px | `h3`, card titles |
| `text-3xl` | 36–52px | panel headings |
| `text-4xl` | 48–80px | `h2`, section headings |
| `text-5xl` | 60–120px | `h1` |
| `text-6xl` | 72–176px | hero display (`HeroTitle`) only |

Exception: IconShowcase demos may use other sizes when the size itself is what's being demonstrated (Figma, Sass, Stencil).

### Colour tokens

| Utility | Light | Use |
|---|---|---|
| `bg-page` / `bg-card` / `bg-sunken` / `bg-inset` / `bg-overlay` | marble 50 / white / 100 / 200 / white | surfaces |
| `bg-inverse` + `text-on-inverse` | ink + marble | primary button, active tag, switch track |
| `text-strong` / `text-body` / `text-muted` | ink / stone 800 / stone 600 | text (all ≥ 4.5:1 on page) |
| `text-faint` | stone 500 | placeholders and decorative text only (< 4.5:1) |
| `bg-accent` / `text-accent-text` / `bg-accent-soft` | red 500 / red 700 / red 100 | the one accent — `bg-accent` is fill-only, use `text-accent-text` for text |
| `border-hairline` / `border-line` / `border-line-strong` | marble 300 / stone 400 / ink | rules, inputs, strong outlines |
| `text-success` / `text-danger` / `text-warning` / `text-info` (+ `-soft` fills) | | status only |

Dark mode redefines the same tokens under `[data-theme="dark"]`, so never branch on the theme in components.

### Never

- Use a font size outside the type scale, or set `font-family` outside `font-display` / `font-sans` / `font-mono`
- Create new CSS files (use Tailwind; add tokens to `src/index.css`)
- Use raw colour values outside `src/index.css` — `npm run audit:tokens` fails on them (IconShowcase demo brand colours are exempt)
- Add a `tailwind.config.js` — Tailwind v4 is configured in CSS (`@theme` in `src/index.css`)

---

## Animation

**Scroll-triggered animations:** Always use `scrollVariants` from `utils/animations.ts`.

```tsx
import { scrollVariants, scrollViewport, scrollTiming } from "../../utils/animations";

<m.div
  initial="hidden"
  whileInView="visible"
  viewport={scrollViewport}
  variants={scrollVariants.slideInRight}
  transition={scrollTiming}
>
```

**If you need a new scroll variant**, add it to `utils/animations.ts`, not inline.

**Page transitions** are handled automatically in `AppRoutes.tsx`. Do not add Framer Motion wrappers to page-level components.

**Canvas animations** (sphere): all in `useSphereCanvas.ts`. The RAF loop owns the draw cycle — do not add `requestAnimationFrame` calls elsewhere.

---

## File Naming

| What | Convention | Example |
|---|---|---|
| React components | PascalCase | `TimelineItem.tsx` |
| Hooks | camelCase, `use` prefix | `useSphereCanvas.ts` |
| Utils / pure functions | camelCase | `fibonacciSphere.ts` |
| Types file in feature folder | `types.ts` | `components/sphere/types.ts` |
| CSS colocated with component | Same name | `NameAnimations.css` |
| Page components | PascalCase | `HomeScreen.tsx` |

---

## Imports

Relative paths only. No aliases. Group order (no linter enforced, but preferred):

```ts
// 1. React / external libraries
import React, { useState } from "react";
import { m } from "framer-motion";

// 2. Internal: context, hooks, utils
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { scrollVariants } from "../../utils/animations";

// 3. Internal: components
import NameDisplay from "./NameDisplay";

// 4. Assets and CSS
import "./NameAnimations.css";
import profileImage from "../assets/about/profile.webp";
```

---

## Hooks

**One concern per hook.** Hooks that grew too large should be split:

```
useSphereCanvas.ts   — canvas setup + mouse + animation loop
                       (candidate for splitting into 3, but acceptable as-is given
                        the tight coupling between mouse state and draw loop)
```

**Hooks that belong to a feature** live in the feature folder, not `src/hooks/`.

**General-purpose hooks** (scroll direction, page navigation) live in `src/hooks/`.
