# Troubleshooting & Known Issues

## Active Bugs

### 1. HeroTitle items are decorative only
**File:** `components/HeroTitle/HeroTitle.tsx`
**Symptom:** The SASS / Hospitality / iGaming items glow on hover but clicking does nothing.
**Root cause:** By design for now. The sector pages they once pointed at were removed (Oct 2026). Don't add an `onClick` without a destination.

---

## Build Warnings (Non-breaking)

These appear on every build and can be ignored unless you're doing a dep update:

```
[baseline-browser-mapping] The data in this module is over two months old.
→ Run: npm i baseline-browser-mapping@latest -D

Browserslist: browsers data (caniuse-lite) is 6 months old.
→ Run: npx update-browserslist-db@latest

The glob option "as" has been deprecated in favour of "query".
→ In sphere/iconLoader.ts, change `as: "url"` to `query: "?url", import: "default"`
→ This is a minor Vite API change — low priority
```

---

## Sphere Onboarding Issues

### Icons not appearing
- Check that `src/assets/programming-icons/` contains `.svg` files.
- The glob in `sphere/iconLoader.ts` matches `../../assets/programming-icons/*.svg` — if the file moves, this path must update.
- Images are preloaded eagerly on mount via `usePreloadImages`. If `img.complete` is false during the first draw frames, icons will be invisible until loaded.

### Sphere not pausing when hidden
- `visible` prop must be passed from `HomeScreen` → `ItemSphere` → `useSphereCanvas`.
- The `isVisibleRef` in `useSphereCanvas` is updated via a `useEffect` watching the `visible` prop.
- If the sphere seems to run at full speed when hidden, check that `visible={showSphere}` is on `<ItemSphere>` in `HomeScreen.tsx`.

### Rotation state reset on re-render
- If sphere rotation resets on re-render, it means `persistentState` is being re-created. It must be a **module-level `const`** in `ItemSphere.tsx`, not inside the component.

---

## TypeScript Errors After Moving Files

If you move a file and imports break:
1. Check that the import path depth is correct (count `../` levels relative to new location).
2. Specifically: `sphere/iconLoader.ts` uses `../../assets/` — moving it one level up or down breaks the asset glob.
3. Run `npm run build` (tsc step catches all import errors before Vite runs).
