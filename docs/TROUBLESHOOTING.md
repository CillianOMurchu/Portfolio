# Troubleshooting & Known Issues

## Active Bugs

### 1. HeroTitle buttons are not clickable
**File:** `components/HeroTitle/HeroTitle.tsx`
**Symptom:** The SASS / Hospitality / iGaming text items on the home screen respond to hover (neon glow) but clicking does nothing.
**Root cause:** The `<button>` elements have `onMouseEnter` / `onMouseLeave` handlers but no `onClick`. `HomeScreen.tsx` manages `selectedItem` state but never calls `setSelectedItem` — the description panel, scroll indicator, and "Key Technologies" grid below the hero are unreachable.
**Fix needed:** Add `onClick` to HeroTitle buttons. HomeScreen needs to pass a handler like `onItemClick={(item) => setSelectedItem(item as ItemType)}`.

---

### 2. Navbar border doesn't render
**Files:** `components/layout/Navbar.tsx` line 17, `components/navigation/MobileMenuPanel.tsx` line 29
**Symptom:** The expected neon green bottom border on the navbar and left border on the mobile menu panel don't appear.
**Root cause:** Code uses class names `border-bottom-neon` and `border-left-neon` but `theme.css` defines `border-neon-bottom` and `border-neon-left` (word order is reversed).
**Fix:** Either rename the classes in Navbar/MobileMenuPanel, or add aliases in `theme.css`.

---

### 3. Contact form does nothing
**File:** `pages/Contact.tsx`
**Symptom:** The chat-style UI renders but typing a message and clicking Send has no effect.
**Root cause:** Input has no state, button has no handler. Placeholder UI only.

---

## Dead Code

### `hooks/useAuth.ts`
Full Supabase Google OAuth hook (session state, sign-in/out, loading states). Not imported or used anywhere in the application. Also creates its own Supabase client, duplicating `utils/supabaseClient.ts`. Safe to delete if auth is not being built out. Do not build on top of this hook without first verifying it still works.

### `hooks/useElementCenter.ts`
Returns `[ref, getCenter()]` for a DOM element. Was apparently an early approach to the OrbOriginContext position-sharing problem. Not imported anywhere. Safe to delete.

---

## Incomplete Pages

The following routes render stub pages with a single heading:

| Route | File | Content |
|---|---|---|
| `/fintech` | `pages/Fintech.tsx` | "Welcome to the Fintech page!" |
| `/hospitality` | `pages/Hospitality.tsx` | "Welcome to the Hospitality page!" |
| `/igaming` | `pages/iGaming.tsx` | "Welcome to the iGaming page!" |

These are not linked from the navigation menu.

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

## Supabase Client Duplication

`utils/supabaseClient.ts` and `hooks/useAuth.ts` both call `createClient(url, key)` with the same env vars. If Supabase is ever actively used, consolidate to just `utils/supabaseClient.ts` and import from there.

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
