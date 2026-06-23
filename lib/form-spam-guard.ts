/** Shared bot/spam checks for public form endpoints. */

export const HONEYPOT_FIELD = "website";
export const FORM_STARTED_FIELD = "_formStarted";
const MIN_SUBMIT_MS = 3000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 8;

const rateBuckets = new Map<string, number[]>();

export type SpamCheckResult = "ok" | "honeypot" | "too_fast" | "rate_limited";

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function checkSubmissionSpam(
  body: Record<string, unknown>,
  ip: string
): SpamCheckResult {
  const honeypot = String(body[HONEYPOT_FIELD] ?? "").trim();
  if (honeypot) return "honeypot";

  const started = Number(body[FORM_STARTED_FIELD]);
  if (Number.isFinite(started) && started > 0) {
    if (Date.now() - started < MIN_SUBMIT_MS) return "too_fast";
  }

  const now = Date.now();
  const recent = (rateBuckets.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return "rate_limited";
  recent.push(now);
  rateBuckets.set(ip, recent);

  return "ok";
}

export function stripSpamFields<T extends Record<string, unknown>>(body: T) {
  const { [HONEYPOT_FIELD]: _hp, [FORM_STARTED_FIELD]: _ts, ...rest } = body;
  return rest;
}
