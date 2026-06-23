#!/usr/bin/env node
/**
 * Download LinkedIn article cover images and set hero image on each catalog entry.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");
const OUT_DIR = path.join(ROOT, "public/images/articles");

function localHeroPath(slug, ext = "jpg") {
  return `/images/articles/${slug}.${ext}`;
}

function extractCoverUrl(raw) {
  const patterns = [
    /!\[[^\]]*\]\((https:\/\/media\.licdn\.com\/[^)]+article-cover_image[^)]+)\)/,
    /(https:\/\/media\.licdn\.com\/dms\/image\/[^\s"')]+article-cover_image[^\s"')]+)/,
    /article-cover_image-shrink[^"'\s)]+/,
  ];
  for (const re of patterns) {
    const m = raw.match(re);
    if (m) {
      let url = m[1] ?? m[0];
      if (!url.startsWith("http")) return null;
      return url.split("?")[0] + (url.includes("?") ? "?" + url.split("?")[1] : "");
    }
  }
  return null;
}

function extFromUrl(url) {
  if (/\.png/i.test(url)) return "png";
  if (/\.webp/i.test(url)) return "webp";
  return "jpg";
}

async function fetchJina(linkedinPath) {
  const url = `https://r.jina.ai/https://www.linkedin.com/pulse/${linkedinPath}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jina ${res.status}`);
  return res.text();
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      Referer: "https://www.linkedin.com/",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/html")) throw new Error("HTML response");
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error("too small");
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buf);
  return buf.length;
}

function heroMissing(imagePath) {
  if (!imagePath || imagePath.includes("article-fallback")) return true;
  if (!imagePath.startsWith("/")) return true;
  const disk = path.join(ROOT, "public", imagePath.replace(/^\//, ""));
  return !fs.existsSync(disk) || fs.statSync(disk).size < 500;
}

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (const entry of CATALOG) {
    const article = content[entry.slug];
    if (!article) continue;

    if (!heroMissing(article.image)) {
      skip++;
      continue;
    }

    process.stdout.write(`${entry.slug}… `);
    try {
      const raw = await fetchJina(entry.linkedinPath);
      const coverUrl = extractCoverUrl(raw);
      if (!coverUrl) {
        console.log("no cover");
        fail++;
        continue;
      }

      const ext = extFromUrl(coverUrl);
      const rel = localHeroPath(entry.slug, ext);
      const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));
      await downloadImage(coverUrl, dest);
      article.image = rel;
      console.log(`ok → ${rel}`);
      ok++;
    } catch (err) {
      console.log(`fail (${err.message})`);
      fail++;
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(content));
  console.log(`\nDone — ok:${ok} skip:${skip} fail:${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
