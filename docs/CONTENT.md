# Content management

This site uses **static content** — no admin panel. Updates are made by editing files in the repository and redeploying.

---

## Articles & case studies

### Data file

All long-form content lives in **`lib/article-content.json`**.

| Type | Count | Route |
|------|-------|-------|
| Articles | 59 | `/thoughtleadership/[slug]` |
| Case studies | 3 | `/case-studies/[slug]` |

Case study slugs:

- `siam-computing`
- `omega-hms`
- `thorntons-budgens`

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

Images are **not** stored in this repo (except brand assets in `public/brand/`). Page images load from:

- `beingatfullpotential.com/wp-content/uploads/…` (legacy WordPress CDN)
- Pexels stock photos
- Third-party logos (IDG, client logos)

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
