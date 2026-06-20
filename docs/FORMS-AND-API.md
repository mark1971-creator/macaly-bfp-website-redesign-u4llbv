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
{ "type": "contact", "name": "…", "email": "…", "message": "…" }
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
  "heardFrom": "…"
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
  "invoicing": "…"
}
```

### Email subjects

| `type` | Subject line |
|--------|--------------|
| `contact` | New Contact Form Submission — BEING at Full Potential |
| `hpcc` | New HPCC Application — BEING at Full Potential |
| `idg` | New IDG Certification Registration — BEING at Full Potential |

### Responses

| Status | Meaning |
|--------|---------|
| `200` | `{ "success": true }` |
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

## Security notes

- API keys are server-side only (`BREVO_*` without `NEXT_PUBLIC_` prefix)
- No rate limiting is implemented — consider adding middleware or Brevo-side limits for production hardening
- Form fields are interpolated into HTML email without sanitization — acceptable for internal notification emails to a trusted recipient
