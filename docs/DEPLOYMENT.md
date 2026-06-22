# Deployment

## Recommended hosting

**Vercel** (or any Node.js host that supports Next.js 16 App Router).

1. Connect the GitHub repository
2. Set environment variables (see below)
3. Deploy — build command: `npm run build`, output: Next.js default

---

## Environment variables

Create these in your hosting dashboard (and in `.env.local` for local dev). See `.env.example` for a template.

### Required for forms

| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Brevo transactional API key ([Brevo → SMTP & API](https://app.brevo.com/settings/keys/api)) |

Without this key, `/api/contact` and `/api/newsletter` return **503**.

### Recommended

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://beingatfullpotential.com` — used for absolute Open Graph URLs |
| `BREVO_LIST_ID` | Numeric Brevo contact list ID for newsletter signups on `/insight` |

### Optional (Convex)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `CONVEX_SITE_URL` | Convex auth site URL |
| `OTP_ENDPOINT`, `CHAT_ID`, `APP_NAME`, `SECRET_KEY` | Convex OTP / Macaly auth integration |

---

## Brevo setup checklist

### 1. API key

Create an API key in Brevo with permission to send transactional email and manage contacts.

### 2. Authorized IPs (important)

If **API key IP restriction** is enabled in [Brevo → Security → Authorized IPs](https://app.brevo.com/security/authorised_ips):

- **Local dev:** Add your machine's public IP, or temporarily deactivate restriction for testing
- **Production (Vercel/serverless):** Deactivate IP restriction for the website API key — serverless hosts use changing IPs

A common error during local testing:

```
Brevo transactional email failed: 401
"We have detected you are using an unrecognised IP address..."
```

### 3. Sender domain

Forms send from `mark@beingatfullpotential.com`. Ensure this sender/domain is verified in Brevo.

### 4. Newsletter list

Create a contact list in Brevo and set `BREVO_LIST_ID` to its numeric ID.

---

## Build & verify before deploy

```bash
npm run build    # Must complete without errors
npm run start    # Smoke-test at http://localhost:3000
```

Verify:

- [ ] Homepage loads, favicon visible in browser tab
- [ ] `/assessments` loads
- [ ] Submit test on `/#contact` (with Brevo configured)
- [ ] Submit test on `/academy/apply`
- [ ] `/thoughtleadership/redefining-validation` renders article body
- [ ] `/case-studies/siam-computing` renders case study

---

## Static assets & CDN

Brand assets ship with the repo:

- `public/favicon.ico`, `public/icon.svg`
- `public/brand/og-measure-what-matters.png` (1200×630 social preview)
- `public/wp-content/uploads/…` — self-hosted legacy WordPress media (~100+ files)

After changing brand visuals, run `npm run generate:brand` and commit the regenerated files.

### WordPress image migration

The new site replaced WordPress on the same domain, so old URLs like  
`https://beingatfullpotential.com/wp-content/uploads/…` return **404**.

**Fix applied:** images are self-hosted under `/wp-content/…` in `public/`.

To refresh or fetch additional images from the Internet Archive:

```bash
npm run migrate:images
```

Some newer images (2024–2026) may not exist in the Wayback Machine. Missing images fall back to `/images/article-fallback.jpg` via the `SafeImg` component.

---

## SSL / “Not secure” in the browser

If the address bar shows **Not secure** on `https://beingatfullpotential.com`:

1. **Confirm the certificate** on your nginx server — use a valid Let's Encrypt (or commercial) cert for `beingatfullpotential.com` and `www.beingatfullpotential.com`.
2. **Force HTTPS** — HTTP should 301 redirect to HTTPS (already configured on nginx).
3. **Mixed content** — ensure no `http://` asset URLs remain (site code uses HTTPS or relative paths).
4. **Hard-refresh** the browser after deploy (`Ctrl+Shift+R`) to clear cached broken responses.

The Next.js app sends a `Strict-Transport-Security` header after deploy.

---

## Domain & DNS

Point your domain to the hosting provider. Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS URL.

---

## Secrets hygiene

- **Never commit** `.env.local` or API keys
- `.env.local` is gitignored by convention (add to `.gitignore` if not present)
- Use hosting provider secret storage for production values
