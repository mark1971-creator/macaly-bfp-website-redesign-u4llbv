# Architecture

## Overview

This is a **Next.js App Router** application. Most pages are **statically generated** at build time. Dynamic API routes handle form submissions server-side.

```
┌─────────────────────────────────────────────────────────┐
│  Browser                                                │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  Next.js 16 (App Router)                                │
│  ├── Static pages (SSG) — marketing, articles, cases    │
│  ├── Client components — forms, nav, interactive UI     │
│  └── API routes — /api/contact, /api/newsletter         │
└────────────┬───────────────────────┬────────────────────┘
             │                       │
             ▼                       ▼
     lib/article-content.json   Brevo API
     (35 articles + 3 cases)    (email + contacts)
             │
             ├── lib/article-redirects.json (189 legacy redirects)
             └── lib/article-metadata.ts (OG/Twitter per article)
             │
             ▼
     External image CDNs
     (WordPress, Pexels, etc.)
```

---

## Directory structure

```
app/                          # Routes, layouts, API, metadata
├── layout.tsx                # Root layout, global metadata, favicon config
├── page.tsx                  # Homepage
├── globals.css               # Brand CSS variables, Tailwind base
├── metadata.json             # Shared SEO titles/descriptions (subset of pages)
├── icon.svg / favicon.ico    # Auto-served favicon assets
├── opengraph-image.png       # Default social sharing image
├── api/
│   ├── contact/route.ts      # Form email handler
│   └── newsletter/route.ts   # Newsletter signup handler
├── thoughtleadership/
│   ├── page.tsx              # Article archive
│   └── [slug]/page.tsx       # Dynamic article pages
├── case-studies/[slug]/      # Dynamic case study pages
└── …                         # Other static route segments

components/                   # Page-level and shared UI
├── home-page.tsx             # Full homepage (single large client component)
├── *-page.tsx                # One component per major page
├── article-detail-content.tsx# Shared article/case study renderer
└── ui/                       # shadcn/Radix primitives

lib/
├── article-content.json      # All article + case study body content
├── article-redirects.json    # Legacy WordPress URL redirects (189 rules)
├── article-metadata.ts       # Open Graph / Twitter metadata builder
├── articles.ts               # Card/list helpers for insight & archive pages
├── form-spam-guard.ts        # Server-side honeypot, timing, rate-limit checks
└── utils.ts                  # cn() helper

public/
├── brand/                    # High-res favicon + OG image sources
├── images/articles/          # Self-hosted article images
├── images/case-studies/      # Case study screenshots
├── images/clients/           # Client logos
├── wp-content/uploads/       # Self-hosted legacy WordPress media
├── favicon.ico               # Browser fallback favicon
└── icon.svg                  # SVG favicon

scripts/
├── fix-article-redirects.mjs # Runs at build — syncs redirect JSON
├── generate-legacy-redirects.mjs
└── generate-brand-assets.mjs # Regenerate favicon + OG PNGs

convex/                       # Optional backend (auth scaffolding)
```

---

## Rendering model

| Route type | Strategy | Notes |
|------------|----------|-------|
| Marketing pages (`/about`, `/impact`, …) | Static (`○`) | Built at compile time |
| `/thoughtleadership/[slug]` | SSG (`●`) | `generateStaticParams()` from JSON (35 articles) |
| `/case-studies/[slug]` | SSG (`●`) | 3 case studies from JSON |
| `/api/*` | Dynamic (`ƒ`) | Server-only, uses env secrets |

Run `npm run build` to see the full route table in the build output.

---

## Page component pattern

Most routes follow this pattern:

```tsx
// app/about/page.tsx
import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = { /* page-specific SEO */ };

export default function Page() {
  return <AboutPage />;
}
```

Page components in `components/` are typically `"use client"` because they include navigation state, forms, and scroll interactions. SEO metadata stays in the server `page.tsx` file.

---

## Navigation

Each major page embeds its own **Nav** and **Footer** (not a shared layout component). This is intentional for per-page styling (e.g. homepage transparent nav vs navy header on inner pages).

Standard nav links across inner pages:

- About → `/about`
- Insight → `/insight`
- Impact → `/impact`
- Academy → `/academy`
- Assessments → `/assessments`
- Contact → `/#contact`

The homepage nav lives in `components/home-page.tsx` and uses the same destinations.

---

## Content storage

There is **no CMS database**. Long-form content is stored in:

- **`lib/article-content.json`** — articles and case studies (fetched from legacy WordPress via `.macaly/fetch_articles.py`)
- **Inline constants** in page components — testimonials, program details, coach cards
- **`app/metadata.json`** — SEO copy for a subset of routes

Images remain on external CDNs (WordPress uploads, Pexels, IDG.org) with `images: { unoptimized: true }` in `next.config.js`.

---

## Optional Convex layer

`ConvexClientProvider` in `app/layout.tsx` wraps the app but **gracefully no-ops** when `NEXT_PUBLIC_CONVEX_URL` is unset. The public marketing site does not depend on Convex for core functionality.

Convex files exist for future auth/admin features (`convex/auth.ts`, `ResendOTP.ts`).

---

## Configuration files

| File | Purpose |
|------|---------|
| `next.config.js` | Webpack/turbopack, macaly-tagger (dev), unoptimized images, legacy redirects |
| `tailwind.config.ts` | Brand color tokens mapped to CSS variables |
| `components.json` | shadcn/ui configuration |
| `tsconfig.json` | Path alias `@/*` → project root |
