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
import { motion } from "framer-motion";
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

1. **`theme.css` utility classes** — `.neon`, `.text-accent`, `.border-accent-subtle`, `.surface`, `.timeline-card`, etc.
2. **Tailwind utilities** — layout, spacing, flex, grid, responsive variants
3. **Inline `style` prop** — only for dynamic values that can't be expressed in CSS (animation state, calculated positions)

### Never

- Create new CSS files (add to `theme.css` or use Tailwind)
- Use magic colour values — reference `var(--color-accent-primary)` etc.
- Define Tailwind custom classes via `tailwind.config.js` — they go in `theme.css`

### CSS class naming

```css
/* Feature prefix for component-specific classes */
.timeline-card { }
.timeline-card-title { }

/* Semantic names for utilities */
.text-accent { }
.border-neon-bottom { }   /* NOT border-bottom-neon — this is the correct pattern */
.neon-glow { }
```

### Neon glow pattern

Use the CSS variable, not hardcoded values:

```ts
// Good
style={{ boxShadow: "var(--neon-glow-primary)" }}
style={{ textShadow: "var(--neon-glow-secondary)" }}

// Avoid
style={{ boxShadow: "0 0 5px rgba(16,185,129,0.8), ..." }}
```

---

## Animation

**Scroll-triggered animations:** Always use `scrollVariants` from `utils/animations.ts`.

```tsx
import { scrollVariants, scrollViewport, scrollTiming } from "../../utils/animations";

<motion.div
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
| Hooks | camelCase, `use` prefix | `useNeonFlicker.ts` |
| Utils / pure functions | camelCase | `fibonacciSphere.ts` |
| Types file in feature folder | `types.ts` | `components/sphere/types.ts` |
| CSS colocated with component | Same name | `HeroTitle.anim.css` |
| Page components | PascalCase | `HomeScreen.tsx` |

---

## Imports

Relative paths only. No aliases. Group order (no linter enforced, but preferred):

```ts
// 1. React / external libraries
import React, { useState } from "react";
import { motion } from "framer-motion";

// 2. Internal: context, hooks, utils
import { useOrbOrigin } from "../../context/OrbOriginContext";
import { scrollVariants } from "../../utils/animations";

// 3. Internal: components
import NameDisplay from "./NameDisplay";

// 4. Assets and CSS
import "./NameAnimations.css";
import profileImage from "../assets/about/profile.png";
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

**General-purpose hooks** (scroll direction, neon flicker, page navigation) live in `src/hooks/`.
