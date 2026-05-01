# Cillian Ó Murchú — Portfolio

Personal portfolio site. Live at `cillianomurchu.vercel.app` and `www.cillianmurchu.com`.

---

## Docs

| File | Purpose |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Rules and context for AI assistants working on this repo |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, sphere algorithm, animation system |
| [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) | TypeScript patterns, CSS conventions, component rules, naming |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Known bugs, dead code, build warnings |

---

## Stack

React 18 · TypeScript · Vite · React Router · Framer Motion · Tailwind CSS · Supabase

---

## Scripts

```bash
npm run dev           # dev server
npm run build         # tsc + vite build
npm run test:run      # vitest single run
npm run scrape-logos  # Puppeteer logo scraper (dev tool only)
```

---

## Structure

```
src/
├── pages/              Route screens (Home, About, Streaming, Contact, stubs)
├── components/
│   ├── sphere/         Canvas sphere — all 10 related files co-located
│   ├── name/           Name widget — component, sub-components, CSS
│   ├── HeroTitle/      Hero title + CSS
│   ├── layout/         Navbar, Footer
│   ├── navigation/     Mobile menu
│   ├── ui/             Atoms (BurgerMenuIcon, SocialLink)
│   └── TimelineItem.tsx
├── context/            OrbOriginContext
├── data/               experience-data.tsx (static work history)
├── hooks/              General hooks (scroll, flicker, navigation, auth)
├── styles/             theme.css (all CSS variables + utility classes)
└── utils/              animations.ts, supabaseClient.ts
```

---

## Environment

```
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```
