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
  signal: AbortSignal.timeout(60000),
}).then((r) => r.text());

const og = html.match(/property="og:image"\s+content="(https:\/\/media\.licdn\.com[^"]+)"/i);
console.log("HERO:", og?.[1]?.slice(0, 100));

const main = extractMainContent(html);
const inlines = [];
const seen = new Set();

for (const m of main.matchAll(
  /([\s\S]{0,1500})(?:data-li-src|data-delayed-url|src)="(https:\/\/media\.licdn\.com[^"]+)"([\s\S]{0,800})/gi
)) {
  const u = decodeHtml(m[2]);
  if (!u.includes("media.licdn.com") || /logo|profile-displayphoto|company-logo/i.test(u))
    continue;
  if (seen.has(u)) continue;
  seen.add(u);
  const ctx = stripTags(m[1]).slice(-350);
  const junk = JUNK.test(ctx);
  console.log(`\n#${inlines.length + 1} ${junk ? "JUNK" : "OK"}`);
  console.log("url:", u.slice(0, 90));
  console.log("ctx:", ctx.slice(-200));
  if (!junk) inlines.push({ url: u, ctx });
}

console.log("\nTotal usable:", inlines.length);

// Try wayback for wp skill images
const wpUrls = [
  "mobilization-skills.png",
  "perspective-skills.png",
  "perserverance.png",
  "Mindful-monday-pic-big.png",
  "Storytelling-Sessions-big-pic.png",
  "Hackathons-big-pic.png",
  "siam-team.jpg",
  "siam-values-1.png",
];

for (const f of wpUrls) {
  const wp = `https://beingatfullpotential.com/wp-content/uploads/2024/11/${f}`;
  const wb = `https://web.archive.org/web/2024/https://beingatfullpotential.com/wp-content/uploads/2024/11/${f}`;
  try {
    const head = await fetch(wb, { method: "HEAD", signal: AbortSignal.timeout(15000) });
    console.log(f, head.status, head.headers.get("content-length"));
  } catch (e) {
    console.log(f, "fail");
  }
}
