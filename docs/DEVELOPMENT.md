# Development guide

## Prerequisites

- **Node.js** 20+ recommended
- **npm** 10+
- Brevo API key for form testing (optional for static page work)

---

## Setup

```bash
git clone https://github.com/mark1971-creator/macaly-bfp-website-redesign-u4llbv.git
cd macaly-bfp-website-redesign-u4llbv
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

Dev server runs at [http://localhost:3000](http://localhost:3000) (or next available port).

---

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server with webpack (`next dev --webpack`) |
| `npm run build` | Regenerates legacy redirects, then production Next.js build |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint via `next lint` |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest single run (CI-friendly) |
| `npm run test:coverage` | Vitest with coverage report |
| `npm run generate:brand` | Regenerate favicon + OG PNG assets |

---

## Project conventions

### File naming

- Routes: `app/route-name/page.tsx`
- Page components: `components/route-name-page.tsx` (kebab-case)
- Shared UI: `components/ui/*.tsx`

### Client vs server

- **`app/**/page.tsx`** — Server components; export `metadata`, keep thin
- **`components/*-page.tsx`** — Client components (`"use client"`) for interactivity
- **`app/api/**/route.ts`** — Server-only API handlers

### Imports

Use the `@/` path alias (maps to project root):

```tsx
import HomePage from "@/components/home-page";
import siteMetadata from "@/app/metadata.json";
```

### Styling

- Tailwind utility classes inline
- Brand colors via tokens (`bg-navy`, `text-gold`) — see [Brand & design](./BRAND-AND-DESIGN.md)
- Custom utilities in `app/globals.css` under `@layer utilities`

### TypeScript

`next.config.js` sets `typescript.ignoreBuildErrors: true` — fix type errors proactively even though builds won't fail on them.

---

## Testing

Tests live in `__tests__/`. Config: `vitest.config.ts`, setup: `vitest.setup.ts`.

```bash
npm run test:run
```

Example test: `__tests__/app/page.test.tsx` (homepage smoke test).

---

## Linting

```bash
npm run lint
```

ESLint config: `.eslintrc.json` with `eslint-config-next`.

---

## Macaly development tooling

The `.macaly/` directory contains internal tooling from the Macaly build environment:

| Path | Purpose |
|------|---------|
| `.macaly/fetch_articles.py` | Scrape WordPress articles into JSON |
| `.macaly/scrape_profiles.py` | Coach profile data |
| `.macaly/plan.md` | Original content migration plan |
| `.macaly/AGENTS.md` | AI agent context (brand rules, key numbers) |

These are **not** required for day-to-day development unless refreshing content from WordPress.

`macaly-tagger` is wired into webpack/turbopack for Macaly dev sessions only.

---

## Common tasks

### Update homepage hero slide

Edit `heroSlides` array in `components/home-page.tsx`.

### Change HPCC program dates

Edit copy in `components/academy-apply-page.tsx` and `components/academy-page.tsx`.

### Add a thought leadership article

1. Add entry to `lib/article-content.json` with `"type": "article"`
2. Add listing card in `components/thought-leadership-page.tsx` and/or `components/insight-page.tsx` if it should appear in previews
3. Rebuild

### Fix favicon not showing on homepage

Ensure `public/favicon.ico` exists and `app/page.tsx` includes explicit `icons` metadata. Regenerate with `npm run generate:brand`.

### Update social sharing image

Edit overlay in `scripts/generate-brand-assets.mjs`, run `npm run generate:brand`, commit output files.

---

## Build output

After `npm run build`, expect ~61 static pages:

- 16 marketing routes
- 35 article pages
- 3 case study pages
- API routes (dynamic)
- Icon/OG assets

The build log prints `Redirects: N -> N` when redirect sync runs, then the full route table.

---

## Git workflow

```bash
git checkout -b feature/your-change
# make changes
npm run build          # verify
git add …
git commit -m "Describe why, not just what"
git push -u origin feature/your-change
```

Do **not** commit `.env.local` or files containing API keys.

---

## Known warnings (non-blocking)

- **Workspace root warning:** Parent directory may contain another `package-lock.json`. Set `outputFileTracingRoot` in `next.config.js` if deploying from a monorepo-style layout.
- **`browserDebugInfoInTerminal`:** Deprecated Next.js experimental flag in config — cosmetic warning only.
