#!/usr/bin/env node
/**
 * Fix remaining hero images and remap missing wp-content block images to local assets.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");
const ARTICLES_DIR = path.join(ROOT, "public/images/articles");

function existsLocal(webPath) {
  if (!webPath?.startsWith("/")) return false;
  const disk = path.join(ROOT, "public", webPath.replace(/^\//, ""));
  return fs.existsSync(disk) && fs.statSync(disk).size > 500;
}

function extractCoverUrl(raw) {
  const m =
    raw.match(
      /!\[[^\]]*\]\((https:\/\/media\.licdn\.com\/[^)]+article-cover_image[^)]+)\)/
    ) ||
    raw.match(
      /(https:\/\/media\.licdn\.com\/dms\/image\/[^\s"')]+article-cover_image[^\s"')]+)/
    );
  return m?.[1] ?? null;
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
  if (buf.length < 500) throw new Error("too small");
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buf);
}

function firstLocalBlockImage(blocks) {
  for (const b of blocks) {
    if (b.type === "image" && existsLocal(b.src)) return b.src;
    if (b.type === "image-text-split" && existsLocal(b.src)) return b.src;
    if (b.type === "skill-grid") {
      for (const item of b.items ?? []) {
        if (existsLocal(item.image)) return item.image;
      }
    }
  }
  return null;
}

async function fixHero(slug, article, entry) {
  if (existsLocal(article.image)) return false;

  const heroFile = path.join(ARTICLES_DIR, `${slug}.jpg`);
  const heroRel = `/images/articles/${slug}.jpg`;

  if (entry) {
    try {
      const raw = await fetchJina(entry.linkedinPath);
      const cover = extractCoverUrl(raw);
      if (cover) {
        await download(cover, heroFile);
        article.image = heroRel;
        return true;
      }
    } catch {
      /* continue */
    }
  }

  const fromBlock = firstLocalBlockImage(article.blocks);
  if (fromBlock) {
    article.image = fromBlock;
    return true;
  }

  // Copy case-study assets for siam-like entries
  const caseDir = path.join(ROOT, "public/images/case-studies", slug.split("-")[0]);
  if (fs.existsSync(caseDir)) {
    const first = fs
      .readdirSync(caseDir)
      .find((f) => /\.(jpe?g|png|webp)$/i.test(f));
    if (first) {
      article.image = `/images/case-studies/${slug.split("-")[0]}/${first}`;
      return true;
    }
  }

  article.image = "/images/article-fallback.jpg";
  return true;
}

function remapBlockImages(article) {
  let changed = 0;
  const walk = (blocks) => {
    for (const b of blocks) {
      if (b.type === "image" && b.src?.startsWith("/wp-content/") && !existsLocal(b.src)) {
        if (existsLocal(article.image) && article.image !== "/images/article-fallback.jpg") {
          b.src = article.image;
          changed++;
        } else {
          b.src = "/images/article-fallback.jpg";
          changed++;
        }
      }
      if (b.type === "image-text-split" && b.src?.startsWith("/wp-content/") && !existsLocal(b.src)) {
        b.src = existsLocal(article.image) ? article.image : "/images/article-fallback.jpg";
        changed++;
      }
      if (b.type === "skill-grid") {
        for (const item of b.items ?? []) {
          if (item.image?.startsWith("/wp-content/") && !existsLocal(item.image)) {
            item.image = "/images/article-fallback.jpg";
            changed++;
          }
        }
      }
    }
  };
  walk(article.blocks);
  return changed;
}

async function main() {
  const catalogBySlug = Object.fromEntries(CATALOG.map((e) => [e.slug, e]));
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

  for (const [slug, article] of Object.entries(content)) {
    const fixed = await fixHero(slug, article, catalogBySlug[slug]);
    const remapped = remapBlockImages(article);
    if (fixed || remapped) {
      console.log(`${slug}: hero${fixed ? " fixed" : ""}, ${remapped} block images remapped`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(content));
  console.log("Done.");
}

main();
