#!/usr/bin/env node
/**
 * Authoritative sync: rebuild article blocks from LinkedIn pulse HTML in document order.
 * Parses data-test-id="article-content-blocks" sequentially (text + images interleaved).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { CATALOG } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");
const BAK_PATH = path.join(ROOT, "lib/article-content.json.bak");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.linkedin.com/",
};

const JUNK_TEXT =
  /^Join now|^Sign in|^New to LinkedIn|^Skip to main|^Like$|^Comment$|^Copy$|^LinkedIn$|^Show$|^Email or phone|^Password$|^Forgot password|^Agree & Join|^By clicking Continue|^Published |^\+ Follow$|^Mark Vandeneijnde$|^Report this article|^To view or add a comment|^More articles by|^Explore content categories|^Recommended by LinkedIn|^Top Content$|^People$|^Learning$|^Jobs$|^Games$|^Visual by Vanessa/i;

const JUNK_IMAGE_CTX =
  /inline-recommended-articles|inline-article|content-author-card|years?\s+ago|recommended by/i;

/** Case studies: preserve rich layout from backup; only refresh images via SIAM handler */
const CASE_STUDY_SLUGS = new Set([
  "siam-computing",
  "omega-hms",
  "business-case-human-potential-realisation",
]);

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s) {
  return decodeHtml(String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function isJunkText(text) {
  const t = text.trim();
  if (!t || t.length < 3) return true;
  if (JUNK_TEXT.test(t)) return true;
  if (/linkedin\.com\/in\//i.test(t) && t.length < 280) return true;
  if (/linkedin\.com\/uas\/login/i.test(t)) return true;
  if (/trk=article-ssr/i.test(t)) return true;
  if (/^\[\]\(https:\/\/.*linkedin/i.test(t)) return true;
  return false;
}

function extractContentBlocks(html) {
  const start = html.indexOf('data-test-id="article-content-blocks"');
  if (start < 0) return "";

  const end = html.indexOf("</article>", start);
  let section = end > start ? html.slice(start, end) : html.slice(start);

  // Remove embedded "Recommended by LinkedIn" carousels (content continues after them)
  section = section.replace(
    /<div class="inline-articles[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<\/div>/gi,
    ""
  );

  for (const marker of ["More articles by", "Explore content categories"]) {
    const i = section.indexOf(marker);
    if (i > 200) section = section.slice(0, i);
  }

  return section;
}

function parseInlineList(html) {
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((x) => stripTags(x[1]))
    .filter((t) => !isJunkText(t) && t.length > 2);
  return items.length ? { type: "ul", items } : null;
}

function parseTextBlock(innerHtml) {
  const blocks = [];

  const h = innerHtml.match(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);
  if (h) {
    const text = stripTags(h[2]);
    if (!isJunkText(text)) {
      blocks.push({ type: "heading", level: Math.min(+h[1], 3), text });
    }
    return blocks;
  }

  const ulInside = innerHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (ulInside) {
    const list = parseInlineList(ulInside[0]);
    if (list) blocks.push(list);
    return blocks;
  }

  const olInside = innerHtml.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
  if (olInside) {
    const items = [...olInside[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((x) => stripTags(x[1]))
      .filter((t) => !isJunkText(t));
    if (items.length) blocks.push({ type: "ol", items });
    return blocks;
  }

  const text = stripTags(innerHtml);
  if (!isJunkText(text) && text.length > 12) {
    blocks.push({ type: "paragraph", text });
  }
  return blocks;
}

function parseFromSection(section) {
  const blocks = [];
  const tokens = section.split(
    /(?=<div class="article-main__content"|<div class="inline-articles|<div class="flex flex-col mt-2"[^>]*data-test-id="publishing-image-block")/i
  );

  for (const token of tokens) {
    if (/class="inline-articles"/i.test(token)) continue;

    if (/data-test-id="publishing-image-block"/i.test(token)) {
      const img = token.match(
        /(?:data-delayed-url|data-li-src|src)="(https:\/\/media\.licdn\.com[^"]+)"/i
      );
      if (!img) continue;
      const url = decodeHtml(img[1]);
      if (!url.includes("article-inline") || JUNK_IMAGE_CTX.test(token)) continue;
      const cap = token.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
      blocks.push({ type: "image", url, caption: stripTags(cap?.[1] || "") });
      continue;
    }

    if (/class="article-main__content"/i.test(token)) {
      blocks.push(...parseTextBlock(token));
    }
  }
  return blocks;
}

/** Older pulse articles: single article-main__content blob with inline <p>/<h> tags */
function parseLegacyArticleMain(html) {
  const start = html.indexOf('class="article-main__content');
  if (start < 0) return [];

  const articleEnd = html.indexOf("</article>", start);
  if (articleEnd < 0) return [];

  const chunk = html.slice(start, articleEnd);
  const openEnd = chunk.indexOf(">");
  let main = chunk.slice(openEnd + 1);
  const lastDiv = main.lastIndexOf("</div>");
  if (lastDiv > 0) main = main.slice(0, lastDiv);

  for (const marker of [
    "Recommended by LinkedIn",
    "Others also viewed",
    "More articles by",
    "Explore content categories",
    "inline-articles",
  ]) {
    const i = main.indexOf(marker);
    if (i > 200) main = main.slice(0, i);
  }

  const blocks = [];
  const tokenRe =
    /(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p[^>]*>[\s\S]*?<\/p>|<ul[^>]*>[\s\S]*?<\/ul>|<ol[^>]*>[\s\S]*?<\/ol>|<figure[^>]*>[\s\S]*?<\/figure>|<img[^>]+>)/gi;

  const seenImages = new Set();

  for (const tok of main.matchAll(tokenRe)) {
    const el = tok[1];

    const h = el.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (h) {
      const text = stripTags(h[2]);
      if (!isJunkText(text))
        blocks.push({ type: "heading", level: Math.min(+h[1], 3), text });
      continue;
    }

    const fig = el.match(/^<figure[^>]*>([\s\S]*?)<\/figure>/i);
    if (fig) {
      const img = fig[1].match(
        /(?:data-delayed-url|data-li-src|src)="(https:\/\/media\.licdn\.com[^"]+)"/i
      );
      if (img) {
        const u = decodeHtml(img[1]);
        if (!seenImages.has(u) && u.includes("article-inline")) {
          seenImages.add(u);
          const cap = fig[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
          blocks.push({ type: "image", url: u, caption: stripTags(cap?.[1] || "") });
        }
      }
      continue;
    }

    if (/^<img/i.test(el)) {
      const img = el.match(
        /(?:data-delayed-url|data-li-src|src)="(https:\/\/media\.licdn\.com[^"]+)"/i
      );
      if (img) {
        const u = decodeHtml(img[1]);
        if (!seenImages.has(u) && u.includes("article-inline")) {
          seenImages.add(u);
          blocks.push({ type: "image", url: u, caption: "" });
        }
      }
      continue;
    }

    blocks.push(...parseTextBlock(el));
  }

  return blocks;
}

async function fetchJinaMarkdown(linkedinPath) {
  const res = await fetch(
    `https://r.jina.ai/https://www.linkedin.com/pulse/${linkedinPath}/`,
    {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(90000),
    }
  );
  if (!res.ok) throw new Error(`Jina HTTP ${res.status}`);
  return res.text();
}

function parseJinaMarkdown(md) {
  const contentStart = md.indexOf("Markdown Content:");
  if (contentStart < 0) return [];
  let body = md.slice(contentStart + "Markdown Content:".length);

  for (const marker of [
    "\n## Recommended by LinkedIn",
    "\n## Others also viewed",
    "\n## More articles by",
    "\n[Like]",
    "\n## Similar topics",
  ]) {
    const i = body.indexOf(marker);
    if (i > 100) body = body.slice(0, i);
  }

  const blocks = [];
  const lines = body.split(/\r?\n/);
  let listBuf = null;

  const flushList = () => {
    if (listBuf?.length) {
      blocks.push({ type: "ul", items: [...listBuf] });
      listBuf = null;
    }
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flushList();
      continue;
    }
    if (isJunkText(t)) continue;
    if (/^!\[.*\]\(https:\/\/www\.linkedin\.com\/pulse\//.test(t)) continue;
    if (/^!\[.*\]\(https:\/\/media\.licdn\.com/i.test(t)) {
      flushList();
      const url = t.match(/\((https:\/\/media\.licdn\.com[^)]+)\)/)?.[1];
      if (url?.includes("article-inline")) {
        blocks.push({ type: "image", url, caption: "" });
      }
      continue;
    }
    if (/^#{1,3}\s+/.test(t)) {
      flushList();
      const level = Math.min(t.match(/^#+/)[0].length, 3);
      const text = t.replace(/^#+\s+/, "").trim();
      if (!isJunkText(text)) blocks.push({ type: "heading", level, text });
      continue;
    }
    if (/^[\*\-•]\s+/.test(t)) {
      if (!listBuf) listBuf = [];
      listBuf.push(t.replace(/^[\*\-•]\s+/, "").trim());
      continue;
    }
    if (t.startsWith(">")) {
      flushList();
      const text = t.replace(/^>\s*/, "").trim();
      if (text.length > 10) blocks.push({ type: "blockquote", text });
      continue;
    }
    flushList();
    if (t.length > 15 && !t.startsWith("[") && !t.startsWith("![")) {
      blocks.push({ type: "paragraph", text: t });
    }
  }
  flushList();
  return blocks;
}

async function parseArticleBlocks(html, linkedinPath) {
  let blocks = parseLinkedInBlocks(html);
  if (blocks.length >= 2) return blocks;

  blocks = parseLegacyArticleMain(html);
  if (blocks.length >= 2) return blocks;

  const md = await fetchJinaMarkdown(linkedinPath);
  blocks = parseJinaMarkdown(md);
  return blocks;
}

function parseLinkedInBlocks(html) {
  const section = extractContentBlocks(html);
  if (html.includes('data-test-id="article-content-blocks"') && section.length > 500) {
    const blocks = parseFromSection(section);
    if (blocks.length >= 2) return blocks;
  }
  return parseLegacyArticleMain(html);
}

function parseCover(html) {
  const og = html.match(
    /property="og:image"\s+content="(https:\/\/media\.licdn\.com[^"]+)"/i
  );
  return og ? decodeHtml(og[1]) : null;
}

async function fetchHtml(linkedinPath) {
  const res = await fetch(`https://www.linkedin.com/pulse/${linkedinPath}/`, {
    headers: FETCH_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(60000),
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

async function materializeImages(slug, blocks) {
  let imgIdx = 0;
  const out = [];

  for (const b of blocks) {
    if (b.type !== "image" || !b.url) {
      out.push(b);
      continue;
    }
    imgIdx++;
    const ext = extFromUrl(b.url);
    const rel = `/images/articles/${slug}/inline-${String(imgIdx).padStart(2, "0")}.${ext}`;
    const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));
    try {
      await download(b.url, dest);
      out.push({
        type: "image",
        src: rel,
        alt: b.caption || "",
        caption: b.caption || "",
      });
    } catch {
      /* skip failed */
    }
  }
  return out;
}

async function downloadHero(slug, coverUrl) {
  if (!coverUrl) return null;
  const rel = `/images/articles/${slug}.jpg`;
  const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));
  await download(coverUrl, dest);
  return rel;
}

/** Siam: backup layout, mapped LinkedIn images, no duplicate hero */
const SIAM_WP_MAP = {
  "siam-team.jpg": null,
  "siam-values-1.png": "inline-02.jpg",
  "most-and-least-expressed.png": "inline-04.jpg",
  "Gender-graph.png": "inline-05.jpg",
  "Culture-strategies-1-1.png": "inline-07.jpg",
};
const SIAM_SKILL_IMAGES = {
  "strengths to build on": "inline-08.jpg",
  "opportunities to further develop": "inline-09.jpg",
};

async function trimScreenshot(dest) {
  if (!fs.existsSync(dest)) return;
  const tmp = dest + ".trim.jpg";
  try {
    await sharp(dest)
      .trim({ threshold: 20, background: { r: 0, g: 0, b: 0 } })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(tmp);
    fs.renameSync(tmp, dest);
  } catch {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

async function ensureSiamImages(slug, html) {
  const section = extractContentBlocks(html);
  const urls = [];
  for (const m of section.matchAll(
    /(?:data-delayed-url|data-li-src|src)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"/gi
  )) {
    const u = decodeHtml(m[1]);
    const ctx = section.slice(Math.max(0, (m.index ?? 0) - 400), (m.index ?? 0) + 400);
    if (JUNK_IMAGE_CTX.test(ctx) || /\d+\s+years?\s+ago/i.test(ctx)) continue;
    if (!urls.includes(u)) urls.push(u);
  }

  const dir = path.join(ROOT, "public/images/articles", slug);
  await fs.promises.mkdir(dir, { recursive: true });

  let i = 0;
  for (const u of urls) {
    i++;
    const dest = path.join(dir, `inline-${String(i).padStart(2, "0")}.jpg`);
    try {
      await download(u, dest);
    } catch {
      /* keep existing */
    }
  }

  const cover = parseCover(html);
  if (cover) await downloadHero(slug, cover);

  for (const f of [
    "Collaborative-team-Creation-and-management.jpg",
    "Engagement-activity-creation.jpg",
  ]) {
    await trimScreenshot(path.join(ROOT, "public/images/case-studies/siam", f));
  }
}

function rebuildSiamFromBackup(bakArticle) {
  const SLUG = "siam-computing";
  const rel = (name) => `/images/articles/${SLUG}/${name}`;

  function mapWp(src) {
    if (src.startsWith("/images/case-studies/siam/")) return src;
    const base = src.split("/").pop();
    if (base === "siam-team.jpg") return null;
    const mapped = SIAM_WP_MAP[base];
    if (!mapped) return null;
    const disk = path.join(ROOT, "public/images/articles", SLUG, mapped);
    return fs.existsSync(disk) ? rel(mapped) : null;
  }

  const blocks = [];
  let pendingHeading = null;

  for (const b of bakArticle.blocks) {
    if (b.type === "heading") {
      pendingHeading = b.text.toLowerCase().trim();
      blocks.push(JSON.parse(JSON.stringify(b)));
      continue;
    }

    if (b.type === "skill-grid") {
      const file = SIAM_SKILL_IMAGES[pendingHeading];
      if (file && fs.existsSync(path.join(ROOT, "public/images/articles", SLUG, file))) {
        blocks.push({
          type: "image",
          src: rel(file),
          alt: b.items.map((x) => x.name).join(", "),
          caption: "",
        });
      }
      pendingHeading = null;
      continue;
    }

    if (b.type === "image-text-split") {
      const src = mapWp(b.src);
      if (src) blocks.push({ ...b, src });
      continue;
    }

    if (b.type === "image") {
      const src = mapWp(b.src) ?? (b.src.startsWith("/images/case-studies/") ? b.src : null);
      if (src) blocks.push({ ...b, src, alt: b.alt || "", caption: b.caption || "" });
      continue;
    }

    blocks.push(JSON.parse(JSON.stringify(b)));
    pendingHeading = null;
  }

  return blocks;
}

async function syncStandardArticle(slug, article, entry, html) {
  const parsed = await parseArticleBlocks(html, entry.linkedinPath);
  if (parsed.length < 2) {
    throw new Error(`only ${parsed.length} blocks parsed`);
  }

  const cover = parseCover(html);
  if (cover) {
    try {
      article.image = await downloadHero(slug, cover);
    } catch {
      /* keep */
    }
  }

  article.blocks = await materializeImages(slug, parsed);
  return { blocks: article.blocks.length, images: article.blocks.filter((b) => b.type === "image").length };
}

async function syncCaseStudy(slug, article, entry, html, backup) {
  if (slug === "siam-computing") {
    await ensureSiamImages(slug, html);
    article.blocks = rebuildSiamFromBackup(backup[slug]);
    article.image = `/images/articles/${slug}.jpg`;
    return {
      blocks: article.blocks.length,
      images: article.blocks.filter((b) => b.type === "image").length,
      mode: "siam-backup",
    };
  }

  if (slug === "omega-hms" && backup[slug]) {
    // Preserve case-study layout; refresh inline images from LinkedIn order
    const parsed = parseLinkedInBlocks(html);
    const imageUrls = parsed.filter((b) => b.type === "image").map((b) => b.url);
    let imgIdx = 0;
    const blocks = JSON.parse(JSON.stringify(backup[slug].blocks));

    for (const b of blocks) {
      if (b.type !== "image" || b.src?.startsWith("/images/case-studies/")) continue;
      if (imgIdx < imageUrls.length) {
        imgIdx++;
        const ext = extFromUrl(imageUrls[imgIdx - 1]);
        const rel = `/images/articles/${slug}/inline-${String(imgIdx).padStart(2, "0")}.${ext}`;
        try {
          await download(imageUrls[imgIdx - 1], path.join(ROOT, "public", rel.replace(/^\//, "")));
          b.src = rel;
        } catch {
          /* keep */
        }
      }
    }

    const cover = parseCover(html);
    if (cover) {
      try {
        article.image = await downloadHero(slug, cover);
      } catch {
        /* keep */
      }
    }

    article.blocks = blocks;
    return { blocks: blocks.length, images: imgIdx, mode: "omega-backup" };
  }

  return syncStandardArticle(slug, article, entry, html);
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

  const report = { ok: [], fail: [] };

  for (const entry of entries) {
    const article = content[entry.slug];
    if (!article) continue;

    try {
      const html = await fetchHtml(entry.linkedinPath);
      let result;

      if (entry.type === "case-study") {
        result = await syncCaseStudy(entry.slug, article, entry, html, backup);
      } else {
        result = await syncStandardArticle(entry.slug, article, entry, html);
      }

      article.title = entry.title;
      article.sourceUrl = `https://www.linkedin.com/pulse/${entry.linkedinPath}/`;
      article.type = entry.type;

      console.log(`✓ ${entry.slug}: ${JSON.stringify(result)}`);
      report.ok.push(entry.slug);
      fs.writeFileSync(JSON_PATH, JSON.stringify(content));
    } catch (err) {
      console.log(`✗ ${entry.slug}: ${err.message}`);
      report.fail.push({ slug: entry.slug, err: err.message });
    }

    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\nDone: ${report.ok.length} ok, ${report.fail.length} failed`);
  if (report.fail.length) {
    console.log("Failed:", report.fail.map((f) => f.slug).join(", "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
