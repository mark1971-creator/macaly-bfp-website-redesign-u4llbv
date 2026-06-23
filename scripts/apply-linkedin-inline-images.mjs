#!/usr/bin/env node
/**
 * Download LinkedIn pulse images (including inline article-cover_image assets).
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
  return fs.existsSync(disk) && fs.statSync(disk).size > 400;
}

function extractPulseImages(raw) {
  const urls = [];
  const seen = new Set();
  for (const m of raw.matchAll(/https:\/\/media\.licdn\.com\/[^\s"'<>\\)]+/g)) {
    let u = m[0].replace(/&amp;/g, "&");
    if (/profile-displayphoto|company-logo|static\.licdn|emoji|flag/i.test(u)) continue;
    if (!u.includes("/dms/image/")) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    urls.push(u);
  }
  return urls;
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
  if (buf.length < 400) throw new Error("small");
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buf);
}

function extFromUrl(url) {
  if (/\.png|format=png/i.test(url)) return "png";
  if (/\.webp/i.test(url)) return "webp";
  return "jpg";
}

function* imageSlots(blocks) {
  for (const b of blocks) {
    if (b.type === "image") yield { set: (s) => (b.src = s), get: () => b.src };
    if (b.type === "image-text-split")
      yield { set: (s) => (b.src = s), get: () => b.src };
    if (b.type === "skill-grid") {
      for (const item of b.items ?? []) {
        yield { set: (s) => (item.image = s), get: () => item.image };
      }
    }
  }
}

function needsReplacement(src, heroPath) {
  if (!src) return true;
  if (src === heroPath) return true;
  if (src.includes("article-fallback")) return true;
  if (/^\/images\/articles\/[^/]+\.(jpe?g|png|webp)$/i.test(src)) return true;
  return !existsLocal(src);
}

async function processArticle(slug, article, entry) {
  const slots = [...imageSlots(article.blocks)].filter((s) =>
    needsReplacement(s.get(), article.image)
  );
  if (!slots.length) return { hero: false, inline: 0 };

  let raw;
  try {
    raw = await fetchJina(entry.linkedinPath);
  } catch {
    return { hero: false, inline: 0 };
  }

  const urls = extractPulseImages(raw);
  if (!urls.length) return { hero: false, inline: 0 };

  const heroRel = `/images/articles/${slug}.jpg`;
  const heroDisk = path.join(ROOT, "public", heroRel.replace(/^\//, ""));
  let urlIndex = 0;
  let heroUpdated = false;

  if (!existsLocal(article.image) && urls[urlIndex]) {
    try {
      await download(urls[urlIndex], heroDisk);
      article.image = heroRel;
      heroUpdated = true;
    } catch {
      /* keep existing hero */
    }
  }

  // Skip the first pulse image when hero is already stored (same cover asset)
  urlIndex = existsLocal(article.image) ? 1 : heroUpdated ? 1 : 0;

  const outDir = path.join(ROOT, "public/images/articles", slug);
  let inline = 0;

  for (const slot of slots) {
    const url = urls[urlIndex++];
    if (!url) break;

    const ext = extFromUrl(url);
    const filename = `${String(inline + 1).padStart(2, "0")}.${ext}`;
    const rel = `/images/articles/${slug}/${filename}`;
    const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));

    try {
      if (!existsLocal(rel)) await download(url, dest);
      slot.set(rel);
      inline++;
    } catch {
      urlIndex--;
    }
  }

  return { hero: heroUpdated, inline };
}

async function main() {
  const catalogBySlug = Object.fromEntries(CATALOG.map((e) => [e.slug, e]));
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

  for (const [slug, article] of Object.entries(content)) {
    const entry = catalogBySlug[slug];
    if (!entry) continue;
    const { hero, inline } = await processArticle(slug, article, entry);
    if (hero || inline) console.log(`${slug}: hero=${hero} inline=${inline}`);
    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(content));

  let miss = 0;
  let total = 0;
  for (const a of Object.values(content)) {
    for (const b of a.blocks) {
      if (b.type === "image") {
        total++;
        if (!existsLocal(b.src)) miss++;
      }
    }
  }
  console.log(`\nInline images missing: ${miss}/${total}`);
}

main();
