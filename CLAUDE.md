# Claude Code — Portfolio Project

## Read This First

- **README.md** — project overview and live feature index
- **docs/ARCHITECTURE.md** — system design, data flow, sphere algorithm details
- **docs/STYLE_GUIDE.md** — TypeScript patterns, CSS conventions, naming rules
- **docs/TROUBLESHOOTING.md** — known bugs and their exact locations

Do not read individual source files to re-learn the project. Use these docs.

---

## Project Identity

Personal portfolio for Cillian Ó Murchú. Live at `cillianomurchu.vercel.app`.
React 18 + TypeScript + Vite + Tailwind v4 + shadcn/ui + Framer Motion. No SSR. No global state library.

---

## File Structure Rules

```
src/pages/           Route-level screens only. One file per route.
src/components/      Reusable UI. Feature folders for co-located logic.
  sphere/            All canvas sphere logic lives here. Do not split out.
  name/              Name widget and its sub-components. Do not split out.
  HeroTitle/         HeroTitle component.
  IconShowcase/      Per-technology demo overlays (see its own CLAUDE.md).
  layout/            Navbar (incl. mobile menu), Footer only.
  ui/                shadcn components (lowercase, e.g. button.tsx, added via `npx shadcn add`)
                     plus our own stateless atoms (PascalCase, e.g. InfoBox.tsx).
src/context/         React context providers only.
src/data/            Static data files (no API calls).
src/lib/             utils.ts only (shadcn's `cn` re-export).
src/hooks/           General-purpose hooks. Sphere-specific hooks live in sphere/.
src/utils/           Pure functions. Sphere-specific utils live in sphere/.
```

**When adding a new feature:** If it has more than 2 related files, give it a `components/<feature>/` folder. Keep hook, util, type, and component files co-located inside that folder.

---

## Import Path Conventions

Use relative imports for our own code. The `@/` alias (→ `src/`) exists for shadcn: generated files in `components/ui/` import `@/lib/utils` etc. Don't hand-edit those imports.

```
From src/pages/           → ../components/..., ../hooks/..., ../utils/..., ../data/...
From src/components/xyz/  → ../../context/..., ../../hooks/..., ../../utils/...
From src/components/sphere/ → ./[file]  (all sphere deps are siblings)
From src/components/name/   → ./[file]  (all name deps are siblings)
```

Vite glob import in `sphere/iconLoader.ts` uses `"../../assets/programming-icons/*.svg"` — if iconLoader.ts moves, this path must update.

---

## Key Patterns

**Animation variants:** Always import from `utils/animations.ts`. Do not define local variants for scroll-triggered animations — add to `scrollVariants` there instead.

**CSS styling:** Prefer shadcn components and Tailwind utilities using the semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`…). Tokens are defined in `src/index.css` (`:root` + `@theme inline`), mapped to the Neon Emerald palette. There is no `tailwind.config.js` (Tailwind v4 is configured in CSS). Neon extras (`--glow-primary`, `--glow-secondary`, `--accent-secondary`) and demo brand colours (`rxjs`, `rxjs-light`) live there too. The only other CSS file is `name/NameAnimations.css` (keyframes). No light/dark theme — the site has one dark palette.

**Info boxes:** Use `components/ui/InfoBox.tsx` (generic). Pass `text` (full string) and optionally `displayedText` (partial, for typing cursor). `className` accepts positional and sizing overrides. Do not recreate info-box styling inline.

**Typography:** Six-step type scale (`text-xs` 12px minimum → `text-4xl`), defined in docs/STYLE_GUIDE.md. No other sizes, no `font-family` overrides.

**Component size:** Keep components under 150 lines. If a component grows beyond that, extract sub-components into the same folder.

**No new dependencies** without a clear reason. The bundle was already cleaned of ~650KB of unused deps (three.js, react-hook-form, etc.).

---

## Commands

```bash
npm run dev           # dev server
npm run build         # tsc + vite build — run this after structural changes
npm run test:run      # vitest single run
```

After any significant change, run `npm run build` to catch type errors.

---

## What NOT To Do

- Do not add files to `src/utils/` or `src/hooks/` if they belong to a feature (sphere, name, etc.). Co-locate instead.
- Do not define animation variants locally in a component — use `utils/animations.ts`.
- Do not create a new CSS file. Use Tailwind utilities; add tokens to `src/index.css`.
- Do not hardcode hex/rgba colours in components — use the semantic tokens.
- Icons: use `lucide-react` only. Brand logos (GitHub, LinkedIn) live in `components/ui/BrandIcons.tsx` since lucide has none. Don't reinstall `react-icons`.
- Do not use `any` types. The Twitch player interface pattern in `Streaming.tsx` shows how to type external scripts.
- Do not add `console.log` to production code.
- Do not use wildcard versions in `package.json`.
- Do not add `clsx` / `tailwind-merge` — `cn` (from the `cn` package, re-exported in `lib/utils.ts`) replaces both.
- Do not install Three.js — the sphere is canvas-based, not Three.js.

---

## Known Issues to Be Aware Of

See **docs/TROUBLESHOOTING.md** for the full list. Critical ones:

1. **HeroTitle items are decorative only** — hover glow, no click target. The sector pages were removed.

---

## Agent Workflow

For non-trivial changes, use this sequence:
1. `/plan` — agree on approach before touching files
2. Implement
3. `/project:verify` — runs build and type check, reports errors
4. `/review` — code review of the diff

For large refactors or anything touching the sphere feature, always run verify after.
