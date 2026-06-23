#!/usr/bin/env node
/** Audit all articles: LinkedIn inline count vs JSON, flag mismatches */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(fs.readFileSync(path.join(ROOT, "lib/article-content.json"), "utf8"));

function extractMainContent(html) {
  const m = html.match(/class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i);
  return m?.[1] ?? html;
}

function countLinkedInInlines(html) {
  const main = extractMainContent(html);
  const seen = new Set();
  let n = 0;
  for (const m of main.matchAll(
    /(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"/gi
  )) {
    const u = m[1];
    if (!seen.has(u)) {
      seen.add(u);
      n++;
    }
  }
  return n;
}

function countJsonImages(article) {
  let n = 0;
  for (const b of article.blocks) {
    if (b.type === "image") n++;
    if (b.type === "image-text-split") n++;
  }
  return n;
}

const mismatches = [];

for (const entry of CATALOG) {
  const article = content[entry.slug];
  if (!article) continue;
  try {
    const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
      headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" },
      signal: AbortSignal.timeout(45000),
    }).then((r) => r.text());
    const li = countLinkedInInlines(html);
    const json = countJsonImages(article);
    if (li !== json) {
      mismatches.push({ slug: entry.slug, type: entry.type, linkedin: li, json });
      console.log(`${entry.slug} (${entry.type}): LinkedIn=${li} JSON=${json}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  } catch (e) {
    console.log(`${entry.slug}: ERROR ${e.message}`);
  }
}

console.log(`\n${mismatches.length} mismatches`);
