# Cillian Ó Murchú — Portfolio

[**www.cillian.murchu.com**](https://www.cillianmurchu.com)

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

React 18 · TypeScript · Vite · React Router · Framer Motion · Tailwind CSS v4 · shadcn/ui

---

## Structure

```
src/
├── pages/              Route screens (Home, About, Streaming)
├── components/
│   ├── sphere/         Canvas sphere — all related files co-located
│   ├── name/           Name widget — component, sub-components, CSS
│   ├── IconShowcase/   Per-technology demo overlays
│   ├── HeroTitle/      Hero title
│   ├── layout/         Navbar (incl. mobile menu), Footer
│   ├── ui/             shadcn components + own atoms (InfoBox, SocialLink)
│   └── TimelineItem.tsx
├── context/            OrbOriginContext
├── data/               experience-data, icon descriptions/demos (static)
├── hooks/              General hooks (useNeonFlicker)
├── lib/                utils.ts (shadcn `cn`)
├── styles/             theme.css (legacy CSS variables + classes)
├── utils/              animations.ts
└── index.css           Tailwind v4 + shadcn tokens
```