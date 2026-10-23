# Portfolio (cillianomurchu.vercel.app)

React 18 + TS + Vite + Tailwind v4 (configured in `src/index.css`) + shadcn/ui + Framer Motion. No SSR, no global state. Background docs (read only when needed): `docs/ARCHITECTURE.md`, `docs/STYLE_GUIDE.md`, `docs/TROUBLESHOOTING.md`.

## Rules

- Structure: `pages/` one file per route; features with >2 files get `components/<feature>/` with hooks/utils co-located (not in `src/hooks` / `src/utils`). `ui/` = shadcn (lowercase: sheet, dropdown-menu) + our atoms (PascalCase: Button, IconButton, Input, Switch, Checkbox, Badge, Tag, Card, Avatar, Tabs, …).
- Imports: relative for our code; `@/` only in shadcn-generated files.
- Framer Motion: `m.*` only (`LazyMotion strict`). Scroll variants live in `utils/animations.ts`; use `ui/Reveal.tsx` for scroll reveals.
- Styling: Tailwind + semantic tokens (marble system, light + `data-theme="dark"`); no hardcoded colours, no new CSS files (tokens/keyframes go in `src/index.css`). Type scale `text-2xs`–`text-6xl` (no `text-base`). Use the `ui/` primitives for controls; `npm run audit:tokens` checks for leftovers.
- Icons: `lucide-react`; brand logos in `ui/BrandIcons.tsx`. `cn` from `lib/utils` (no clsx/tailwind-merge).
- Images: WebP/AVIF at ~2× display size with `width`/`height`.
- No `any`, no `console.log`, no wildcard versions, no new deps without reason. Components under ~150 lines.

## Commands

`npm run dev` · `npm run build` (tsc + vite) · `npm run test:run`

Keep checks minimal: run build/tests once when a change could break types or behaviour, not for every edit.
