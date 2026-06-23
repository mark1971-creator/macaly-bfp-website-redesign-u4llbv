# Content management

This site uses **static content** — no admin panel. Updates are made by editing files in the repository and redeploying.

---

## Articles & case studies

### Data file

All long-form content lives in **`lib/article-content.json`**.

| Type | Count | Route |
|------|-------|-------|
| Articles | 35 | `/thoughtleadership/[slug]` |
| Case studies | 3 | `/case-studies/[slug]` |

Case study slugs:

- `siam-computing`
- `omega-hms`
- `business-case-human-potential-realisation` (legacy slug `thorntons-budgens` redirects here)

### Entry structure

Each key in the JSON file is a URL slug:

```json
{
  "redefining-validation": {
    "title": "Article title",
    "date": "2025-09-04",
    "author": "Mark Vandeneijnde",
    "image": "https://…",
    "type": "article",
    "sourceUrl": "https://beingatfullpotential.com/…",
    "blocks": [
      { "type": "paragraph", "text": "…" },
      { "type": "heading", "level": 2, "text": "…" },
      { "type": "ul", "items": ["…"] },
      { "type": "image", "src": "…", "alt": "…", "caption": "…" },
      { "type": "blockquote", "text": "…" },
      { "type": "skill-grid", "variant": "icon", "items": […] },
      { "type": "quote-grid", "columns": 3, "items": […] },
      { "type": "image-text-split", "src": "…", "content": […] }
    ]
  }
}
```

Set `"type": "case-study"` for case studies. The renderer is shared: `components/article-detail-content.tsx`.

### Adding or updating content

**Option A — Edit JSON directly**  
Edit `lib/article-content.json`, add blocks following existing patterns, rebuild.

**Option B — Re-fetch from WordPress**  
Use the Macaly script (requires Python):

```bash
# See .macaly/fetch_articles.py for URL list and usage
python .macaly/fetch_articles.py
```

This re-scrapes WordPress and regenerates the JSON file.

### Dynamic routes

- `app/thoughtleadership/[slug]/page.tsx` — filters `type === "article"`
- `app/case-studies/[slug]/page.tsx` — filters `type === "case-study"`, back link to `/impact`

Both use `generateStaticParams()` so new slugs require a rebuild to appear in production.

### Article helpers

**`lib/articles.ts`** — shared helpers for listing pages:

- `getArticleCards()`, `getCaseStudyCards()` — card data for insight/thought leadership pages
- `formatArticleDate()`, `getExcerpt()` — display utilities

### SEO metadata for articles

**`lib/article-metadata.ts`** — `buildArticleMetadata()` generates per-article Open Graph and Twitter metadata (hero image, first-paragraph description, canonical URL). Used by:

- `app/thoughtleadership/[slug]/page.tsx`
- `app/case-studies/[slug]/page.tsx`

Requires `NEXT_PUBLIC_SITE_URL` in production for absolute image URLs (defaults to `https://beingatfullpotential.com`).

### Legacy redirects

**`lib/article-redirects.json`** — 189 redirects from old WordPress paths to new routes. Regenerated on every build via `scripts/fix-article-redirects.mjs`.

- Removed articles redirect to `/insight` (not homepage)
- Published articles/case studies are never redirected to `/`
- Legacy examples: `/human-potential-model-validation` → article, `/our-team` → `/team`, `/thorntons-budgens` → case study

To regenerate manually:

```bash
node scripts/fix-article-redirects.mjs
```

---

## Page-level copy

Marketing copy (hero text, program dates, testimonials, coach cards) is defined **inline** in each `components/*-page.tsx` file.

| Page component | Route |
|----------------|-------|
| `home-page.tsx` | `/` |
| `about-page.tsx` | `/about` |
| `insight-page.tsx` | `/insight` |
| `thought-leadership-page.tsx` | `/thoughtleadership` |
| `impact-page.tsx` | `/impact` |
| `assessment-page.tsx` | `/assessments` |
| `academy-page.tsx` | `/academy` |
| `academy-apply-page.tsx` | `/academy/apply` |
| `idg-certification-page.tsx` | `/academy/idg-certification` |
| `individuals-page.tsx` | `/individuals` |
| `teams-page.tsx` | `/teams` |
| `organizations-page.tsx` | `/organizations` |
| `education-page.tsx` | `/education` |
| `team-page.tsx` | `/team` |

Search within the relevant file to update headings, dates, CTAs, or testimonial quotes.

---

## SEO metadata

### Per-route metadata

Most routes export `metadata` from their `app/**/page.tsx`:

```tsx
export const metadata: Metadata = {
  title: "…",
  description: "…",
  openGraph: { … },
};
```

### Per-article metadata (articles & case studies)

Dynamic article and case study routes use `buildArticleMetadata()` from `lib/article-metadata.ts` for Open Graph/Twitter cards with hero images.

### Shared metadata file

`app/metadata.json` holds title/description for:

- `/`, `/academy`, `/assessments`, `/individuals`, `/teams`, `/organizations`, `/education`

Imported like:

```tsx
import siteMetadata from "@/app/metadata.json";
export const metadata = siteMetadata["/assessments"];
```

### Global defaults

Root layout (`app/layout.tsx`) sets site-wide favicon, Open Graph defaults, and `metadataBase`.

---

## Images

Legacy WordPress media is **self-hosted** in `public/wp-content/uploads/…` and referenced as `/wp-content/uploads/…` in code and `lib/article-content.json`.

Additional images load from:

- `public/images/articles/` — article hero and inline images
- `public/images/case-studies/` — case study screenshots
- `public/images/clients/` — client logos
- Pexels stock photos
- Third-party logos (IDG, client logos)

To re-fetch missing media from the Internet Archive:

```bash
npm run migrate:images
```

Missing images fall back to `/images/article-fallback.jpg` via the `SafeImg` component.

`next.config.js` sets `images: { unoptimized: true }` — no Next.js Image Optimization pipeline required.

Case study local images (if any) may live under `public/images/case-studies/`.

---

## Legacy URL reference

`old-website-links.md` maps old WordPress URLs to new routes — useful when setting up redirects or verifying content parity.

---

## Content checklist for new pages

1. Create `app/your-route/page.tsx` with metadata
2. Create `components/your-page.tsx` with Nav/Footer matching existing pages
3. Add route to nav links on other pages if it should appear in the header
4. Add entry to `app/metadata.json` if using shared SEO pattern
5. Run `npm run build` to verify static generation
