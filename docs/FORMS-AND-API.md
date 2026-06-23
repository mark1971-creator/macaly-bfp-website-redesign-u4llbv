# Forms & API

All form submissions go through Next.js API routes and deliver email or CRM updates via **Brevo**.

---

## Overview

| Form | Page | Endpoint | `type` field |
|------|------|----------|--------------|
| Contact | `/#contact` (homepage) | `POST /api/contact` | `contact` |
| HPCC application | `/academy/apply` | `POST /api/contact` | `hpcc` |
| IDG registration | `/academy/idg-certification` | `POST /api/contact` | `idg` |
| Newsletter | `/insight` | `POST /api/newsletter` | — |

All emails are sent to **mark@beingatfullpotential.com** with reply-to set to the submitter's email (contact forms).

---

## POST /api/contact

**File:** `app/api/contact/route.ts`

### Request

```http
POST /api/contact
Content-Type: application/json
```

Body:

```json
{
  "type": "contact | hpcc | idg",
  "...fields": "varies by form"
}
```

### Form payloads

**Contact** (`components/home-page.tsx`):

```json
{ "type": "contact", "name": "…", "email": "…", "message": "…", "website": "", "_formStarted": 1710000000000 }
```

**HPCC application** (`components/academy-apply-page.tsx`):

```json
{
  "type": "hpcc",
  "firstName": "…",
  "lastName": "…",
  "email": "…",
  "phone": "…",
  "organisation": "…",
  "role": "…",
  "coachingBackground": "…",
  "motivation": "…",
  "heardFrom": "…",
  "website": "",
  "_formStarted": 1710000000000
}
```

**IDG registration** (`components/idg-certification-page.tsx`):

```json
{
  "type": "idg",
  "name": "First Last",
  "email": "…",
  "mobile": "…",
  "country": "…",
  "interest": "…",
  "invoicing": "…",
  "website": "",
  "_formStarted": 1710000000000
}
```

The `website` and `_formStarted` fields are added automatically by `useFormSpamFields()` — do not expose them in the UI.

### Email subjects

| `type` | Subject line |
|--------|--------------|
| `contact` | New Contact Form Submission — BEING at Full Potential |
| `hpcc` | New HPCC Application — BEING at Full Potential |
| `idg` | New IDG Certification Registration — BEING at Full Potential |

### Responses

| Status | Meaning |
|--------|---------|
| `200` | `{ "success": true }` — includes silent success for blocked spam submissions |
| `503` | `BREVO_API_KEY` not configured |
| `500` | Brevo API error (check server logs) |

### Client UX pattern

Forms use local state: `idle → submitting → success | error`. On error, users see a fallback message with a direct mailto link.

---

## POST /api/newsletter

**File:** `app/api/newsletter/route.ts`  
**Used by:** `components/insight-page.tsx`

### Request

```json
{ "email": "user@example.com", "name": "Optional Name" }
```

### Behavior

- Creates or updates a contact in Brevo (`updateEnabled: true`)
- Adds to list ID from `BREVO_LIST_ID` when set
- Splits `name` into `FIRSTNAME` / `LASTNAME` attributes

### Responses

| Status | Meaning |
|--------|---------|
| `200` | `{ "success": true }` |
| `400` | Invalid email |
| `503` | `BREVO_API_KEY` not configured |
| `500` | Brevo API error |

---

## Testing forms locally

1. Set `BREVO_API_KEY` in `.env.local`
2. Configure Brevo authorized IPs (see [Deployment](./DEPLOYMENT.md))
3. Restart dev server: `npm run dev`
4. Submit a test form
5. Check terminal for `Contact email sent successfully via Brevo, type: …`

### Quick API test (PowerShell)

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/contact" `
  -Method POST -ContentType "application/json" `
  -Body '{"type":"contact","name":"Test","email":"test@example.com","message":"API test"}'
```

---

## Troubleshooting

| Symptom | Likely cause |
|---------|--------------|
| 404 on `/api/contact` | Dev server needs restart; route file must be `app/api/contact/route.ts` |
| 503 response | Missing `BREVO_API_KEY` in environment |
| 401 from Brevo | IP not authorized in Brevo security settings |
| Form shows error, no email | Check server logs for `Brevo transactional email failed` |
| Works locally, fails in production | Set env vars on host; disable IP restriction for serverless |

---

## Spam protection

Contact and course registration forms include lightweight bot protection (no third-party keys required).

| Layer | Implementation | File |
|-------|----------------|------|
| Honeypot | Hidden `website` field — bots that fill it are rejected | `components/form-spam-fields.tsx` |
| Timing | Submissions within 3 s of page load are rejected | `lib/form-spam-guard.ts` |
| Rate limit | Max 8 submissions per IP per 15 min | `lib/form-spam-guard.ts` |

Blocked submissions return `{ "success": true }` without sending email, so bots get no useful signal.

**Client hook:** `useFormSpamFields()` — used in homepage contact, HPCC apply, and IDG registration forms.

**Server check:** `checkSubmissionSpam()` runs at the start of `POST /api/contact`.

### Production notes

- Rate limiting is **in-memory per server instance**. On serverless (Vercel), this still helps but is not a hard global cap. Honeypot + timing catch most automated spam.
- Real users who submit instantly after page load may be blocked — unlikely in practice.
- Newsletter signup (`/api/newsletter`) is **not** protected yet.

---

## Security notes

- API keys are server-side only (`BREVO_*` without `NEXT_PUBLIC_` prefix)
- Form fields are interpolated into HTML email without sanitization — acceptable for internal notification emails to a trusted recipient
- For stronger protection under heavy spam, add Cloudflare Turnstile or hCaptcha
