# Architecture

## System Overview

Single-page application. No SSR, no API routes. Data is either static (experience-data.tsx) or fetched client-side (Twitch embed, Supabase auth — the latter unused in UI).

```
main.tsx
  └── BrowserRouter
        └── OrbOriginProvider          (context: Ó-character screen position)
              └── App.tsx
                    ├── Navbar          (fixed top, Name widget + mobile menu)
                    ├── PageRouter      (thin wrapper)
                    │     └── AppRoutes (React Router <Routes>)
                    │           ├── /           HomeScreen
                    │           ├── /about      About
                    │           ├── /streaming  Streaming
                    │           └── /…          (stubs)
                    └── Footer          (fixed bottom, social links)
```

---

## Routing

`pages/AppRoutes.tsx` defines a `routeConfigs` array. Each entry gets a Framer Motion wrapper (opacity 0→1, y 20→-20 on exit). `PageRouter` is a pass-through — it exists as an abstraction point but adds no logic.

---

## Canvas Sphere

The sphere is the most complex feature. All files in `components/sphere/`.

### Data flow

```
loadIconModules()          Vite glob → svgModules + iconNames[]
generateFibonacciSphere(n) → Position3D[]  (unit sphere, golden angle)
usePreloadImages()         → imagesRef (name → HTMLImageElement)
useSphereCanvas()          → RAF loop, mouse events, canvas draw
```

### Rendering pipeline (per frame in `useSphereCanvas.ts`)

```
1. Read persistentState (rx, rz, vx, vy)
2. Apply rotation deltas (auto or drag)
3. For each Position3D:
   a. rotatePoint(pos, rx, rz)           → rotated 3D position
   b. perspective = NEAR / (FAR - z)     → depth scalar
   c. x2d = cx + x * size * SCALE * perspective
   d. y2d = cy + y * size * SCALE * perspective
4. Sort by z (back-to-front)
5. Draw each icon image with globalAlpha = fade3d * fadeInAlpha
6. Store projected positions in projectedRef (used for hit testing)
```

Constants: `PERSPECTIVE_NEAR=1.2`, `PERSPECTIVE_FAR=1.6`, `SPHERE_PROJECTION_SCALE=0.36`

### Persistence across Strict Mode

`persistentState` and `globalMountTime` are module-level variables (not React state). React Strict Mode double-mounts components — module-level vars survive this, keeping rotation state and fade-in timing consistent.

### Visibility pause

When `visible=false`, the draw function replaces `requestAnimationFrame(draw)` with `setTimeout(() => requestAnimationFrame(draw), 100)`. This drops from 60fps to ~10fps idle checks, eliminating GPU cost when the sphere is hidden.

### Hit testing

`findIconAt(x, y, projectedRef.current)` checks if cursor is within the bounding box of any projected icon (using `scaledIconSize`). Front-to-back sort ensures the nearest icon wins. `getDistanceToNearestIcon` returns a 0–1 value used to compute the hover slowdown multiplier (distance² curve).

---

## Name Widget

```
Name.tsx
  ├── NameDisplay.tsx   staggered letter fade-in, ref on Ó character
  ├── OrbTrace.tsx      animated orb div, positioned at Ó percentage coords
  └── NameInfoBox.tsx   bio text box with typing cursor
```

### OrbOriginContext flow

```
Name.tsx (useLayoutEffect)
  → oCharRef.getBoundingClientRect()
  → setOrbOrigin({ x, y })       (absolute screen coords)
  → setOCharPosition({ x, y })   (same)

OrbTrace.tsx
  → uses orbStart state (percentage within Name container)
  → positions the orb div with left/top percentages
```

### Typing effect

`useEffect` watching `showText`. On true: sets interval at `TYPING_INTERVAL_MS=30ms`, slices `BIO_TEXT` one character at a time into `displayedText`. Cursor blinks while `displayedText.length < BIO_TEXT.length`.

---

## Animation System

Two layers:

**1. Framer Motion (declarative, scroll-triggered)**
- Shared variants in `utils/animations.ts` — `scrollVariants`, `scrollViewport`, `scrollTiming`
- Used by `About.tsx` and `TimelineItem.tsx`
- Page transitions in `AppRoutes.tsx` (per-route motion wrapper)

**2. CSS animations (imperative, canvas, keyframes)**
- `NameAnimations.css` — `fadein-letter`, `orb`, `orb-trace`, `info-box`
- `HeroTitle.anim.css` — supporting classes
- `flyInUp` keyframe — defined inline in `HeroTitle.tsx` via `<style>` tag
- Canvas RAF loop in `useSphereCanvas.ts`

---

## Theming

CSS custom properties in `styles/theme.css`. Tailwind is used for layout/spacing utilities. Custom semantic classes (`.neon`, `.surface`, `.timeline-card-*`, etc.) are plain CSS classes in `theme.css`, not Tailwind components or extended config.

The design token that drives almost everything: `--color-accent-primary: #10b981` (emerald green).

---

## State Management

No global state library. Three sources of truth:

| Source | What it holds |
|---|---|
| React local state | Per-component UI state (hover, scroll, selected item) |
| `OrbOriginContext` | Ó character screen position (read by Name widget sub-components) |
| Module-level vars | Sphere rotation state (`persistentState`), mount time (`globalMountTime`) |

`useAuth` hook has its own Supabase session state but nothing in the UI consumes it.

---

## Build

Vite 7. Manual chunks: `react-vendor`, `framer-motion`. TypeScript strict via `tsconfig`.

Main bundle at last build: **228KB gzip 76KB**. Framer Motion: **116KB gzip 38KB**. React vendor: **141KB gzip 45KB**.

Images (not code): profile photo ~1MB, company headers 1–5.5MB — these are the real page weight.
