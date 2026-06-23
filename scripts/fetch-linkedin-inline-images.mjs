#!/usr/bin/env node
/**
 * Download inline images from LinkedIn pulse pages and rewrite article block src paths.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");

function existsLocal(webPath) {
  if (!webPath?.startsWith("/")) return false;
  const disk = path.join(ROOT, "public", webPath.replace(/^\//, ""));
  return fs.existsSync(disk) && fs.statSync(disk).size > 500;
}

function extractLinkedInImages(raw) {
  const urls = new Set();
  for (const m of raw.matchAll(/https:\/\/media\.licdn\.com\/[^\s"'<>\\)]+/g)) {
    let u = m[0].replace(/&amp;/g, "&");
    if (u.includes("article-cover_image")) continue;
    if (/\.(svg|gif)(\?|$)/i.test(u)) continue;
    urls.add(u);
  }
  return [...urls];
}

async function fetchJina(linkedinPath) {
  const res = await fetch(
    `https://r.jina.ai/https://www.linkedin.com/pulse/${linkedinPath}/`
  );
  if (!res.ok) throw new Error(`Jina ${res.status}`);
  return res.text();
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0",
      Referer: "https://www.linkedin.com/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) throw new Error("too small");
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buf);
  return buf.length;
}

function extFromUrl(url, idx) {
  if (/\.png/i.test(url)) return "png";
  if (/\.webp/i.test(url)) return "webp";
  if (/\.jpe?g/i.test(url)) return "jpg";
  return idx === 0 ? "jpg" : "png";
}

function collectMissingWpImages(article) {
  const missing = [];
  const visit = (src) => {
    if (src?.startsWith("/wp-content/") && !existsLocal(src)) missing.push(src);
  };
  for (const b of article.blocks) {
    if (b.type === "image") visit(b.src);
    if (b.type === "image-text-split") visit(b.src);
    if (b.type === "skill-grid") b.items?.forEach((i) => visit(i.image));
  }
  return missing;
}

function rewriteSrc(article, oldSrc, newSrc) {
  let n = 0;
  for (const b of article.blocks) {
    if (b.type === "image" && b.src === oldSrc) {
      b.src = newSrc;
      n++;
    }
    if (b.type === "image-text-split" && b.src === oldSrc) {
      b.src = newSrc;
      n++;
    }
    if (b.type === "skill-grid") {
      for (const item of b.items ?? []) {
        if (item.image === oldSrc) {
          item.image = newSrc;
          n++;
        }
      }
    }
  }
  return n;
}

async function processArticle(slug, article, entry) {
  const missing = collectMissingWpImages(article);
  if (!missing.length || !entry) return 0;

  let raw;
  try {
    raw = await fetchJina(entry.linkedinPath);
  } catch {
    return 0;
  }

  const licdn = extractLinkedInImages(raw);
  if (!licdn.length) return 0;

  const outDir = path.join(ROOT, "public/images/articles", slug);
  let remapped = 0;

  for (let i = 0; i < missing.length; i++) {
    const url = licdn[i];
    if (!url) break;

    const ext = extFromUrl(url, i);
    const filename = `${String(i + 1).padStart(2, "0")}.${ext}`;
    const rel = `/images/articles/${slug}/${filename}`;
    const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));

    try {
      await download(url, dest);
      remapped += rewriteSrc(article, missing[i], rel);
    } catch {
      /* skip */
    }
  }

  return remapped;
}

async function main() {
  const catalogBySlug = Object.fromEntries(CATALOG.map((e) => [e.slug, e]));
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  let total = 0;

  for (const [slug, article] of Object.entries(content)) {
    const n = await processArticle(slug, article, catalogBySlug[slug]);
    if (n) {
      console.log(`${slug}: remapped ${n} inline images`);
      total += n;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(content));
  console.log(`\nTotal remapped: ${total}`);
}

main();
