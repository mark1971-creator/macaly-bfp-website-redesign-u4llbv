import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function decodeHtml(s) {
  return s.replace(/&amp;/g, "&");
}
function stripTags(s) {
  return decodeHtml(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractMainContent(html) {
  const m = html.match(
    /class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i
  );
  let main = m?.[1] ?? html;
  for (const marker of [
    "Recommended by LinkedIn",
    "Others also viewed",
    "More articles by",
    "Explore content categories",
  ]) {
    const idx = main.indexOf(marker);
    if (idx > 0) main = main.slice(0, idx);
  }
  return main;
}

const JUNK =
  /\d+\s+(year|month|week|day)s?\s+ago|others also viewed|recommended by|\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}(?:\s*\([^)]+\))?\s+\d+\s+(year|month|week|day)s?\s+ago\b/i;

const entry = CATALOG.find((e) => e.slug === "siam-computing");
const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html",
    Referer: "https://www.linkedin.com/",
  },
  signal: AbortSignal.timeout(45000),
}).then((r) => r.text());

const main = extractMainContent(html);
const inlines = [];
const seen = new Set();

for (const m of main.matchAll(
  /([\s\S]{0,1200})(?:data-li-src|data-delayed-url|src)="(https:\/\/media\.licdn\.com[^"]+)"([\s\S]{0,600})/gi
)) {
  const u = decodeHtml(m[2]);
  if (!u.includes("media.licdn.com") || /logo|profile-displayphoto/i.test(u) || seen.has(u))
    continue;
  seen.add(u);
  const ctx = stripTags(m[1]).slice(-300);
  if (JUNK.test(ctx)) {
    console.log("JUNK", inlines.length + 1, ctx.slice(-100));
    continue;
  }
  inlines.push({ idx: inlines.length + 1, url: u.slice(0, 80), ctx });
}

console.log("\n=== LinkedIn images ===");
inlines.forEach((x) => {
  console.log(`\n#${x.idx}`);
  console.log("ctx:", x.ctx.slice(-200));
});

const dir = path.join(ROOT, "public/images/articles/siam-computing");
console.log("\n=== Disk files ===");
for (const f of fs.readdirSync(dir).sort()) {
  const stat = fs.statSync(path.join(dir, f));
  console.log(f, stat.size);
}
