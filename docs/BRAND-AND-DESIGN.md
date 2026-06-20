# Brand & design

Visual identity for BEING at Full Potential: **deep navy**, **warm gold**, and **cream** — elegant serif headings with clean sans-serif body text.

---

## Typography

| Role | Font | Tailwind class |
|------|------|----------------|
| Headings | Cormorant Garant | `font-display` |
| Body | Lato | `font-body` |

Loaded from Google Fonts in `app/globals.css`.

---

## Color tokens

Defined as CSS variables in `app/globals.css`, exposed via Tailwind in `tailwind.config.ts`.

| Token | HSL | Tailwind | Usage |
|-------|-----|----------|-------|
| Navy | 218 67% 16% | `bg-navy`, `text-navy` | Headers, hero overlays, primary buttons |
| Navy dark | 220 72% 9% | `bg-navy-dark` | Mobile menu, deep backgrounds |
| Gold | 38 55% 50% | `bg-gold`, `text-gold` | Accents, CTAs, labels |
| Gold light | 42 68% 65% | `text-gold-light` | Subtle highlights on dark bg |
| Cream | 42 33% 97% | `bg-background` | Page background |
| Warm | 38 20% 94% | `bg-secondary`, `bg-warm` | Cards, alternating sections |

### Design rules

- **Do not** hardcode hex colors for backgrounds/gradients — use Tailwind tokens
- **Exception:** footer uses `bg-[#141210]` (warm charcoal) — the only allowed hardcoded hex
- Hero overlays: use `bg-navy/75` or `bg-navy`, not custom `#0d1b3e` gradients

---

## Key numbers (use consistently)

| Stat | Value |
|------|-------|
| Certified coaches | **200+** |
| Founded | **2010** |
| Continents | **4** |
| Global HQs | **3** |

---

## Layout patterns

### Navigation

- Fixed header, `h-20`, navy backdrop on inner pages
- Homepage: transparent nav that gains `bg-navy` on scroll
- Gold-bordered **TAKE ASSESSMENT** CTA → external assessment platform
- **Assessments** nav link → `/assessments` (internal overview page)

### Footer

```
bg-[#141210] border-t border-gold/15
```

Three-column grid: logo + tagline, navigate links, contact info.

### Section rhythm

- Section padding: `py-24` to `py-32`
- Eyebrow labels: `text-[10px] tracking-[0.3em] uppercase text-gold`
- Display headings: `font-display text-4xl–7xl font-light`

### Decorative elements

- Gold gradient top line on heroes
- Concentric gold rings (low opacity) on assessment/article heroes
- Grain overlay: `.grain-overlay` utility class

---

## Favicon & app icons

| File | Purpose |
|------|---------|
| `app/favicon.ico` | Browser tab icon (auto-served by Next.js) |
| `app/icon.svg` | Scalable favicon source |
| `app/apple-icon.png` | iOS home screen (180×180) |
| `public/favicon.ico` | Direct `/favicon.ico` fallback |
| `public/icon.svg` | Direct SVG access |
| `public/favicon-32x32.png` | PNG fallback |
| `public/favicon-16x16.png` | Small PNG fallback |

The icon is a **12-point sun/gear mark** on navy (#0E1B3E).

### Regenerating icons

```bash
npm run generate:brand
```

Script: `scripts/generate-brand-assets.mjs` (uses Sharp).

---

## Social sharing (Open Graph)

| File | Size | Usage |
|------|------|-------|
| `public/brand/og-measure-what-matters.png` | 1200×630 | LinkedIn, Facebook, Slack previews |
| `public/brand/og-measure-what-matters@2x.png` | 2400×1260 | High-res source |
| `app/opengraph-image.png` | 1200×630 | Site-wide default OG image |
| `app/assessments/opengraph-image.png` | 1200×630 | Assessments page OG override |

Visual: mountain hero background, **"Measure What Matters Most"** headline, brand mark, BFP footer.

Configured in `app/layout.tsx` and per-page metadata.

---

## UI component library

Built on **shadcn/ui** (Radix primitives + Tailwind). Config in `components.json`.

Shared primitives live in `components/ui/`. Page-specific components do not use a shared design system document — match existing page patterns when adding UI.

---

## External brand assets

- **Logo (light):** `https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png`
- Used in nav headers across all pages

---

## Assessment framework images

Stored as URLs in `components/assessment-page.tsx` tier config — Individual, Team, Organisational, and IDG framework diagrams.
