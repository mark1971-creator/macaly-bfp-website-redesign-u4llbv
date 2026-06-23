#!/usr/bin/env node
/**
 * Build legacy WordPress → new site redirects.
 * - Published content: old paths → /thoughtleadership/{slug} or /case-studies/{slug}
 * - Removed content: → /insight
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG, LEGACY_SLUGS } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");
const BAK_PATH = path.join(ROOT, "lib/article-content.json.bak");
const REDIRECTS_PATH = path.join(ROOT, "lib/article-redirects.json");

const INSIGHT = "/insight";

const STATIC_REDIRECTS = [
  ["/our-team", "/team"],
  ["/courses/individual-certification-training", "/courses/human-potential-coach-certification"],
  ["/about-whoweare", "/about"],
  ["/events", "/academy"],
  ["/event/human-potential-coach-certification-training", "/academy"],
  ["/siam-idg-case-study", "/case-studies/siam-computing"],
  ["/case-study/siam-idg", "/case-studies/siam-computing"],
];

function destinationFor(slug, entry) {
  if (!entry) return INSIGHT;
  return entry.type === "case-study"
    ? `/case-studies/${slug}`
    : `/thoughtleadership/${slug}`;
}

function wpPathFromUrl(url) {
  if (!url) return null;
  const m = url.match(/beingatfullpotential\.com\/([^/?#]+)/i);
  return m?.[1] ?? null;
}

function addRedirect(map, source, destination) {
  if (!source || !destination || source === destination) return;
  if (source.startsWith("/api") || source.startsWith("/_next")) return;
  const existing = map.get(source);
  if (!existing) {
    map.set(source, destination);
    return;
  }
  // Prefer content destinations over insight when duplicate sources appear
  if (existing === INSIGHT && destination !== INSIGHT) {
    map.set(source, destination);
  }
}

export function generateRedirects() {
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
  const bak = fs.existsSync(BAK_PATH)
    ? JSON.parse(fs.readFileSync(BAK_PATH, "utf8"))
    : {};

  const published = new Set(Object.keys(content));
  const map = new Map();

  for (const [source, destination] of STATIC_REDIRECTS) {
    addRedirect(map, source, destination);
  }

  for (const entry of CATALOG) {
    const dest = destinationFor(entry.slug, content[entry.slug] ?? { type: entry.type });
    for (const legacy of entry.legacyThoughtLeadership ?? []) {
      addRedirect(map, `/thoughtleadership/${legacy}`, dest);
    }
    for (const legacy of entry.legacyCaseStudy ?? []) {
      addRedirect(map, `/case-studies/${legacy}`, dest);
    }
  }

  for (const [slug, entry] of Object.entries(content)) {
    const dest = destinationFor(slug, entry);
    addRedirect(map, `/${slug}`, dest);
    addRedirect(map, `/thoughtleadership/${slug}`, dest);
    if (entry.type === "case-study") {
      addRedirect(map, `/case-studies/${slug}`, dest);
    }
  }

  for (const [slug, entry] of Object.entries(bak)) {
    const oldPath = wpPathFromUrl(entry.sourceUrl);
    if (!oldPath) continue;
    const dest = content[slug]
      ? destinationFor(slug, content[slug])
      : INSIGHT;
    addRedirect(map, `/${oldPath}`, dest);
  }

  for (const slug of LEGACY_SLUGS) {
    if (published.has(slug)) continue;
    addRedirect(map, `/thoughtleadership/${slug}`, INSIGHT);
    addRedirect(map, `/case-studies/${slug}`, INSIGHT);
    addRedirect(map, `/${slug}`, INSIGHT);
  }

  addRedirect(map, "/diversity-equity-and-inclusion", "/thoughtleadership/diversity-equity-inclusion");
  addRedirect(
    map,
    "/thoughtleadership/diversity-equity-and-inclusion",
    "/thoughtleadership/diversity-equity-inclusion"
  );
  addRedirect(map, "/case-studies/thorntons-budgens", "/case-studies/business-case-human-potential-realisation");

  const reserved = new Set([
    "about",
    "team",
    "insight",
    "impact",
    "academy",
    "assessments",
    "contact",
    "thoughtleadership",
    "case-studies",
    "courses",
    "organizations",
    "individuals",
    "teams",
    "education",
  ]);

  for (const source of [...map.keys()]) {
    if (map.get(source) === "/") map.set(source, INSIGHT);
    const root = source.replace(/^\//, "");
    if (reserved.has(root.split("/")[0])) continue;
  }

  return [...map.entries()]
    .map(([source, destination]) => ({ source, destination, permanent: true }))
    .sort((a, b) => a.source.localeCompare(b.source));
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const redirects = generateRedirects();
  fs.writeFileSync(REDIRECTS_PATH, `${JSON.stringify(redirects, null, 2)}\n`);
  const toInsight = redirects.filter((r) => r.destination === INSIGHT).length;
  const toArticles = redirects.filter((r) => r.destination.startsWith("/thoughtleadership/")).length;
  console.log(`Wrote ${redirects.length} redirects (${toArticles} → articles, ${toInsight} → insight)`);
}
