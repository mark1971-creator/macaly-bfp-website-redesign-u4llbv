#!/usr/bin/env node
/**
 * Thorough article reconciliation:
 * - Fix numbered section titles (paragraph → heading)
 * - Sync images from LinkedIn with junk filtering
 * - Rebuild case studies from backup structure + LinkedIn images
 * - Remove images when LinkedIn has none
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");
const BAK_PATH = path.join(ROOT, "lib/article-content.json.bak");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.linkedin.com/",
};

const JUNK_INLINE =
  /\d+\s+(year|month|week|day)s?\s+ago|others also viewed|recommended by|report this article|sign in to view/i;

const JUNK_PROFILE =
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}(?:\s*\([^)]+\))?\s+\d+\s+(year|month|week|day)s?\s+ago\b/;

const CASE_STUDY_LOCAL_IMAGES = {
  "siam-computing": {
    "/wp-content/uploads/2024/11/": null,
    "/images/case-studies/siam/": path.join(ROOT, "public/images/case-studies/siam"),
  },
};

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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

function parseCover(html) {
  const og = html.match(
    /property="og:image"\s+content="(https:\/\/media\.licdn\.com[^"]+)"/i
  );
  if (og) return decodeHtml(og[1]);
  return null;
}

function isJunkInline(inline) {
  const ctx = `${inline.contextBefore} ${inline.caption}`;
  return JUNK_INLINE.test(ctx) || JUNK_PROFILE.test(ctx);
}

/** Articles verified as having no inline images on LinkedIn (do not restore from disk). */
const CONFIRMED_TEXT_ONLY = new Set([
  "inner-development-goals-to-measure-or-not-2026",
  "idg-b-corp-synergy",
  "redefining-validation",
  "measure-inner-development-goals",
  "some-thoughts-future-being-full-potential",
  "retrospective-conversations-that-matter",
  "disruptive-innovation",
  "world-is-vuca",
  "2021-source-of-trust",
  "creating-transformational-spaces",
  "seven-lessons-keeping-heart-alive",
  "to-re-enter-workforce",
]);

function parseLinkedInInlines(html) {
  const main = extractMainContent(html);
  const inlines = [];
  const seen = new Set();

  const patterns = [
    /([\s\S]{0,800})(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+)"([\s\S]{0,400})/gi,
    /([\s\S]{0,800})src="(https:\/\/media\.licdn\.com\/dms\/image[^"]+)"([\s\S]{0,400})/gi,
  ];

  for (const pattern of patterns) {
    for (const m of main.matchAll(pattern)) {
      const u = decodeHtml(m[2]);
      if (!u.includes("media.licdn.com") || seen.has(u)) continue;
      if (/logo|profile-displayphoto|company-logo/i.test(u)) continue;
      seen.add(u);
      const fig = m[3]?.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
      const inline = {
        url: u,
        caption: stripTags(fig?.[1] || ""),
        contextBefore: stripTags(m[1]).slice(-400),
        htmlIndex: m.index ?? 0,
      };
      if (!isJunkInline(inline)) inlines.push(inline);
    }
  }

  inlines.sort((a, b) => a.htmlIndex - b.htmlIndex);
  return inlines;
}

async function fetchHtml(linkedinPath) {
  const res = await fetch(`https://www.linkedin.com/pulse/${linkedinPath}/`, {
    headers: FETCH_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 400) throw new Error("too small");
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.writeFile(dest, buf);
}

function extFromUrl(url) {
  if (/\.png|format=png/i.test(url)) return "png";
  if (/\.webp/i.test(url)) return "webp";
  return "jpg";
}

function fixNumberedSectionTitles(blocks) {
  return blocks.map((b) => {
    if (b.type === "heading") {
      const m = b.text.match(/^(\d+)\.\s+(.+)$/s);
      if (m && m[2].length <= 160) {
        return { ...b, text: m[2].trim() };
      }
      return b;
    }
    if (b.type !== "paragraph") return b;
    const m = b.text.match(/^(\d+)\.\s+(.+)$/s);
    if (!m || m[2].length > 160) return b;
    return { type: "heading", level: 3, text: m[2].trim() };
  });
}

function isPlainImage(b) {
  return b.type === "image";
}

function scoreContext(text, inline) {
  const t = text.toLowerCase();
  let score = 0;
  const words = [
    ...inline.caption.toLowerCase().split(/\W+/),
    ...inline.contextBefore.toLowerCase().split(/\W+/),
  ].filter((w) => w.length > 4);
  for (const w of words) if (t.includes(w)) score++;
  return score;
}

function findInsertIndex(blocks, inline, usedParagraphs) {
  let bestIdx = -1;
  let bestScore = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (usedParagraphs.has(i)) continue;
    const b = blocks[i];
    if (b.type !== "paragraph" && b.type !== "heading") continue;
    const score = scoreContext(b.text, inline);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestScore >= 2 ? bestIdx + 1 : -1;
}

function resolveLocalPath(src) {
  if (src.startsWith("/images/case-studies/")) {
    const disk = path.join(ROOT, "public", src.replace(/^\//, ""));
    if (fs.existsSync(disk) && fs.statSync(disk).size > 400) return src;
  }
  return null;
}

function existsLocal(webPath) {
  if (!webPath?.startsWith("/")) return false;
  const disk = path.join(ROOT, "public", webPath.replace(/^\//, ""));
  return fs.existsSync(disk) && fs.statSync(disk).size > 400;
}

/** Sorted inline images already on disk (from prior successful syncs). */
function listDiskImages(slug) {
  const dir = path.join(ROOT, "public/images/articles", slug);
  if (!fs.existsSync(dir)) return [];

  const score = (name) => {
    const inline = name.match(/^inline-(\d+)/i);
    if (inline) return parseInt(inline[1], 10);
    const plain = name.match(/^(\d+)\./);
    if (plain) return parseInt(plain[1], 10) + 1000;
    return 9999;
  };

  const seen = new Set();
  const paths = [];

  for (const name of fs.readdirSync(dir).sort((a, b) => score(a) - score(b))) {
    if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
    const web = `/images/articles/${slug}/${name}`;
    if (seen.has(web) || !existsLocal(web)) continue;
    seen.add(web);
    paths.push(web);
  }

  // Prefer inline-XX series when both inline-01 and 01.jpg exist
  const inlineOnly = paths.filter((p) => /inline-\d+/i.test(p));
  return inlineOnly.length ? inlineOnly : paths;
}

function existingArticleImage(slug, index) {
  const dir = path.join(ROOT, "public/images/articles", slug);
  if (!fs.existsSync(dir)) return null;
  const candidates = [
    `inline-${String(index).padStart(2, "0")}.jpg`,
    `${String(index).padStart(2, "0")}.jpg`,
    `inline-${index}.jpg`,
    `${index}.jpg`,
  ];
  for (const name of candidates) {
    const disk = path.join(dir, name);
    if (fs.existsSync(disk) && fs.statSync(disk).size > 400) {
      return `/images/articles/${slug}/${name}`;
    }
  }
  return null;
}

async function assignImage(slug, inline, index) {
  const ext = inline?.url ? extFromUrl(inline.url) : "jpg";
  const rel = `/images/articles/${slug}/inline-${String(index).padStart(2, "0")}.${ext}`;
  const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));

  if (inline?.url) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await download(inline.url, dest);
        return {
          type: "image",
          src: rel,
          alt: inline.caption || "",
          caption: inline.caption || "",
        };
      } catch {
        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      }
    }
  }

  const fallback = existingArticleImage(slug, index);
  if (fallback) {
    return {
      type: "image",
      src: fallback,
      alt: inline?.caption || "",
      caption: inline?.caption || "",
    };
  }

  throw new Error(`no image for ${slug} #${index}`);
}

async function nextImageSrc(slug, inlines, state) {
  while (state.liIdx < inlines.length) {
    const inline = inlines[state.liIdx];
    state.liIdx++;
    try {
      return (await assignImage(slug, inline, state.liIdx)).src;
    } catch {
      /* try next inline */
    }
  }

  state.legacyIdx++;
  const legacy = existingArticleImage(slug, state.legacyIdx);
  if (legacy) return legacy;
  throw new Error("exhausted images");
}

async function rebuildCaseStudyFromBackup(slug, article, bakArticle, inlines, cover) {
  const state = { liIdx: 0, legacyIdx: 3 };
  const newBlocks = [];

  for (const b of bakArticle.blocks) {
    if (b.type === "skill-grid") {
      const items = [];
      for (const item of b.items) {
        const local = resolveLocalPath(item.image);
        if (local) {
          items.push({ ...item, image: local });
          continue;
        }
        try {
          const src = await nextImageSrc(slug, inlines, state);
          items.push({ ...item, image: src });
        } catch {
          /* omit broken grid item */
        }
      }
      if (items.length) newBlocks.push({ ...b, items });
      continue;
    }

    if (b.type === "image-text-split") {
      const local = resolveLocalPath(b.src);
      if (local) {
        newBlocks.push({ ...b, src: local });
        continue;
      }
      try {
        const src = await nextImageSrc(slug, inlines, state);
        newBlocks.push({ ...b, src });
      } catch {
        /* omit split without image */
      }
      continue;
    }

    if (b.type === "image") {
      const local = resolveLocalPath(b.src);
      if (local) {
        newBlocks.push({ ...b, src: local });
        continue;
      }
      try {
        const src = await nextImageSrc(slug, inlines, state);
        newBlocks.push({ ...b, src, alt: b.alt || "", caption: b.caption || "" });
      } catch {
        /* omit */
      }
      continue;
    }

    newBlocks.push(JSON.parse(JSON.stringify(b)));
  }

  article.blocks = newBlocks;

  if (cover) {
    const heroRel = `/images/articles/${slug}.jpg`;
    await download(cover, path.join(ROOT, "public", heroRel.replace(/^\//, "")));
    article.image = heroRel;
  }
}

async function syncArticle(slug, article, entry, bakArticle) {
  const html = await fetchHtml(entry.linkedinPath);
  const cover = parseCover(html);
  const inlines = parseLinkedInInlines(html);

  article.blocks = fixNumberedSectionTitles(article.blocks);

  if (entry.type === "case-study" && bakArticle) {
    await rebuildCaseStudyFromBackup(slug, article, bakArticle, inlines, cover);
    return { hero: !!cover, inline: inlines.length, mode: "case-study-rebuild" };
  }

  if (cover) {
    try {
      const heroRel = `/images/articles/${slug}.jpg`;
      await download(cover, path.join(ROOT, "public", heroRel.replace(/^\//, "")));
      article.image = heroRel;
    } catch {
      /* keep hero */
    }
  }

  const removed = article.blocks.filter(isPlainImage).length;
  article.blocks = article.blocks.filter((b) => !isPlainImage(b));

  const diskImages = listDiskImages(slug);

  if (!inlines.length) {
    if (diskImages.length && !CONFIRMED_TEXT_ONLY.has(slug)) {
      for (let i = 0; i < diskImages.length; i++) {
        article.blocks.push({
          type: "image",
          src: diskImages[i],
          alt: "",
          caption: "",
        });
      }
      return {
        hero: !!cover,
        inline: diskImages.length,
        removed,
        mode: "disk-fallback",
      };
    }
    return { hero: !!cover, inline: 0, removed, mode: "text-only" };
  }

  const targetCount = Math.max(inlines.length, diskImages.length);
  const usedParagraphs = new Set();
  const placements = [];

  for (let i = 0; i < targetCount; i++) {
    let block = null;

    if (i < inlines.length) {
      try {
        block = await assignImage(slug, inlines[i], i + 1);
      } catch {
        /* fall through to disk */
      }
    }

    if (!block && diskImages[i] && existsLocal(diskImages[i])) {
      block = {
        type: "image",
        src: diskImages[i],
        alt: inlines[i]?.caption || "",
        caption: inlines[i]?.caption || "",
      };
    }

    if (!block) continue;

    const inline = inlines[i] ?? {
      caption: "",
      contextBefore: "",
    };
    let insertAt = findInsertIndex(article.blocks, inline, usedParagraphs);
    if (insertAt < 0) {
      const lastImg = article.blocks.findLastIndex((b) => b.type === "image");
      insertAt = lastImg >= 0 ? lastImg + 1 : article.blocks.length;
    } else {
      usedParagraphs.add(insertAt - 1);
    }
    placements.push({ insertAt, block });
  }

  placements.sort((a, b) => b.insertAt - a.insertAt);
  for (const p of placements) {
    article.blocks.splice(p.insertAt, 0, p.block);
  }

  return { hero: !!cover, inline: placements.length, removed, mode: "standard" };
}

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const backup = fs.existsSync(BAK_PATH)
    ? JSON.parse(fs.readFileSync(BAK_PATH, "utf8"))
    : {};

  const only = process.argv.slice(2);
  const entries = only.length
    ? CATALOG.filter((e) => only.includes(e.slug))
    : CATALOG;

  for (const entry of entries) {
    const article = content[entry.slug];
    if (!article) continue;

    try {
      const report = await syncArticle(
        entry.slug,
        article,
        entry,
        backup[entry.slug]
      );
      console.log(`${entry.slug}: ${JSON.stringify(report)}`);
      fs.writeFileSync(JSON_PATH, JSON.stringify(content));
    } catch (err) {
      console.log(`${entry.slug}: ERROR ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("\nReconciliation complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
