#!/usr/bin/env node
/**
 * Rebuild Siam case study from backup with LinkedIn-synced images (inline-*.jpg).
 * The numbered 01–11.jpg files are from other articles and must NOT be used.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");
const BAK_PATH = path.join(ROOT, "lib/article-content.json.bak");
const SLUG = "siam-computing";
const IMG_DIR = path.join(ROOT, "public/images/articles", SLUG);

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html",
  Referer: "https://www.linkedin.com/",
};

/** WP filename → correct LinkedIn-synced file (verified visually) */
const WP_TO_INLINE = {
  "siam-team.jpg": "team.jpg",
  "siam-values-1.png": "inline-02.jpg",
  "most-and-least-expressed.png": "inline-04.jpg",
  "Gender-graph.png": "inline-05.jpg",
  "Culture-strategies-1-1.png": "inline-07.jpg",
};

/** Skill grids on LinkedIn are single composite images, not 6 separate icons */
const SKILL_GRID_IMAGES = {
  "strengths to build on": "inline-08.jpg",
  "opportunities to further develop": "inline-09.jpg",
};

function rel(name) {
  return `/images/articles/${SLUG}/${name}`;
}

async function downloadHero() {
  const entry = CATALOG.find((e) => e.slug === SLUG);
  const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(60000),
  }).then((r) => r.text());

  const og = html.match(/property="og:image"\s+content="(https:\/\/media\.licdn\.com[^"]+)"/i);
  if (!og) throw new Error("no og:image");

  const teamDest = path.join(IMG_DIR, "team.jpg");
  const heroDest = path.join(ROOT, "public/images/articles", `${SLUG}.jpg`);

  for (const [url, dest] of [
    [og[1].replace(/&amp;/g, "&"), teamDest],
    [og[1].replace(/&amp;/g, "&"), heroDest],
  ]) {
    const res = await fetch(url, { headers: FETCH_HEADERS, signal: AbortSignal.timeout(45000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.writeFile(dest, buf);
  }
  console.log("Downloaded hero + team.jpg");
}

function mapWpSrc(src) {
  if (src.startsWith("/images/case-studies/siam/")) return src;
  const base = src.split("/").pop();
  const mapped = WP_TO_INLINE[base];
  if (!mapped) return null;
  const disk = path.join(IMG_DIR, mapped);
  if (!fs.existsSync(disk)) {
    console.warn("missing file:", mapped);
    return null;
  }
  return rel(mapped);
}

function rebuildBlocks(bakBlocks) {
  const blocks = [];
  let pendingSkillHeading = null;

  for (const b of bakBlocks) {
    if (b.type === "heading") {
      pendingSkillHeading = b.text.toLowerCase().trim();
      blocks.push(JSON.parse(JSON.stringify(b)));
      continue;
    }

    if (b.type === "skill-grid") {
      const key = pendingSkillHeading;
      const file = SKILL_GRID_IMAGES[key];
      if (file && fs.existsSync(path.join(IMG_DIR, file))) {
        blocks.push({
          type: "image",
          src: rel(file),
          alt: b.items.map((i) => i.name).join(", "),
          caption: "",
        });
      }
      pendingSkillHeading = null;
      continue;
    }

    if (b.type === "image-text-split") {
      const src = mapWpSrc(b.src);
      if (src) blocks.push({ ...b, src });
      continue;
    }

    if (b.type === "image") {
      const src = mapWpSrc(b.src);
      if (src) {
        blocks.push({ ...b, src, alt: b.alt || "", caption: b.caption || "" });
      }
      continue;
    }

    blocks.push(JSON.parse(JSON.stringify(b)));
    pendingSkillHeading = null;
  }

  return blocks;
}

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const bak = JSON.parse(fs.readFileSync(BAK_PATH, "utf8"))[SLUG];
  const article = content[SLUG];

  try {
    await downloadHero();
  } catch (err) {
    console.warn("Hero download failed:", err.message);
  }

  article.title = bak.title;
  article.blocks = rebuildBlocks(bak.blocks);
  article.image = `/images/articles/${SLUG}.jpg`;
  article.type = "case-study";
  article.sourceUrl = `https://www.linkedin.com/pulse/${CATALOG.find((e) => e.slug === SLUG).linkedinPath}/`;

  fs.writeFileSync(JSON_PATH, JSON.stringify(content));

  console.log("\nSiam rebuilt. Images in order:");
  article.blocks
    .filter((b) => b.type === "image" || b.type === "image-text-split")
    .forEach((b, i) => console.log(`  ${i + 1}. ${(b.src || "").split("/").pop()}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
