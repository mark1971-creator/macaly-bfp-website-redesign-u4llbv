# BEING at Full Potential — Website

Marketing and content site for [BEING at Full Potential](https://beingatfullpotential.com): Human Potential development, assessments, academy programs, thought leadership, and case studies.

**Owner:** Mark Vandeneijnde · mark@beingatfullpotential.com  
**Repository:** [github.com/mark1971-creator/macaly-bfp-website-redesign-u4llbv](https://github.com/mark1971-creator/macaly-bfp-website-redesign-u4llbv)

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production preview

```bash
npm run build
npm run start
```

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS, Radix UI (shadcn/ui) |
| Fonts | Cormorant Garant (headings), Lato (body) |
| Email / CRM | [Brevo](https://www.brevo.com) API |
| Backend (optional) | [Convex](https://convex.dev) + `@convex-dev/auth` |
| Testing | Vitest, Testing Library |
| Image tooling | Sharp (brand asset generation) |

---

## Documentation

| Guide | Description |
|-------|-------------|
| [Architecture](./docs/ARCHITECTURE.md) | Routes, folder structure, rendering model |
| [Deployment](./docs/DEPLOYMENT.md) | Environment variables, hosting, Brevo setup |
| [Content](./docs/CONTENT.md) | Articles, case studies, metadata, static pages |
| [Forms & API](./docs/FORMS-AND-API.md) | Contact, applications, newsletter endpoints |
| [Brand & design](./docs/BRAND-AND-DESIGN.md) | Colors, typography, favicon, social images |
| [Development](./docs/DEVELOPMENT.md) | Scripts, testing, linting, conventions |

---

## Site map (implemented routes)

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero slider, vision, insight preview, impact, academy, team, contact |
| `/about` | About the organisation |
| `/insight` | Thought leadership hub + newsletter signup |
| `/thoughtleadership` | Full article archive |
| `/thoughtleadership/[slug]` | Individual article (59 articles) |
| `/impact` | Impact pillars and case study highlights |
| `/case-studies/[slug]` | Case studies: `siam-computing`, `omega-hms`, `thorntons-budgens` |
| `/assessments` | Human Potential Assessment overview |
| `/individuals` | Individual offering |
| `/teams` | Team offering |
| `/organizations` | Organisational offering |
| `/education` | Education / IDG in schools |
| `/academy` | Certification programs hub |
| `/academy/apply` | HPCC application form |
| `/academy/idg-certification` | IDG certification registration |
| `/team` | Coach directory |

**External (intentional):** Assessment platform CTAs link to [beingatfullpotential.io](https://beingatfullpotential.io/).

---

## Environment variables

Copy `.env.example` to `.env.local` for local development. See [Deployment](./docs/DEPLOYMENT.md) for full details.

| Variable | Required | Purpose |
|----------|----------|---------|
| `BREVO_API_KEY` | Yes (forms) | Send form submission emails + newsletter contacts |
| `BREVO_LIST_ID` | Optional | Brevo list for newsletter signups |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL for Open Graph metadata |
| `NEXT_PUBLIC_CONVEX_URL` | Optional | Convex backend; site renders without it |

---

## NPM scripts

| Script | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Production server | `npm run start` |
| Lint | `npm run lint` |
| Tests | `npm run test` / `npm run test:run` |
| Regenerate favicon & OG images | `npm run generate:brand` |

---

## Key integrations

- **Forms** → `POST /api/contact` (contact, HPCC apply, IDG registration) via Brevo transactional email
- **Newsletter** → `POST /api/newsletter` via Brevo Contacts API (Insight page)
- **Assessment platform** → External links to `beingatfullpotential.io`

---

## Brand reference (short)

- **Navy:** `bg-navy` — hsl(218, 67%, 16%)
- **Gold:** `bg-gold` / `text-gold` — hsl(38, 55%, 50%)
- **Cream background:** `bg-background` — hsl(42, 33%, 97%)
- **Footer:** `bg-[#141210]` (only allowed hardcoded hex)

Use **200+** certified coaches, **4** continents, founded **2010** consistently across pages.

---

## Macaly origin

Initial build via [Macaly](https://www.macaly.com/chat/u4llbvnely5jgcx59ux6d1j6). Internal Macaly tooling lives in `.macaly/` (content fetch scripts, planning notes).

---

## License

Private — © BEING at Full Potential. All rights reserved.
