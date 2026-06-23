#!/usr/bin/env node
/**
 * Sync article hero + inline images from LinkedIn pulse HTML (authoritative source).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.linkedin.com/",
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
  return m?.[1] ?? html;
}

function parseCover(html) {
  const og = html.match(
    /property="og:image"\s+content="(https:\/\/media\.licdn\.com[^"]+)"/i
  );
  if (og) return decodeHtml(og[1]);

  const headEnd = html.indexOf("article-main__content");
  const head = headEnd > 0 ? html.slice(0, headEnd) : html.slice(0, 80000);
  const m = head.match(
    /https:\/\/media\.licdn\.com\/dms\/image\/[^"']+article-cover_image[^"']+/
  );
  return m ? decodeHtml(m[0]) : null;
}

function parseLinkedInImages(html) {
  const main = extractMainContent(html);
  const cover = parseCover(html);
  const inlines = [];
  const seen = new Set();

  const addInline = (url, caption, contextBefore, htmlIndex) => {
    const u = decodeHtml(url);
    if (!u.includes("article-inline_image") || seen.has(u)) return;
    seen.add(u);
    inlines.push({
      url: u,
      caption: stripTags(caption || ""),
      contextBefore: stripTags(contextBefore || "").slice(-400),
      htmlIndex: htmlIndex ?? 0,
    });
  };

  for (const m of main.matchAll(
    /([\s\S]{0,600})(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"([\s\S]{0,300})/gi
  )) {
    const fig = m[3]?.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    addInline(m[2], fig?.[1], m[1], m.index);
  }

  inlines.sort((a, b) => a.htmlIndex - b.htmlIndex);
  return { cover, inlines };
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

function findInsertIndex(blocks, inline) {
  const ctxWords = [
    ...new Set(
      inline.contextBefore
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 4)
    ),
  ].slice(-12);

  const captionWords = inline.caption
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);

  let bestIdx = -1;
  let bestScore = 0;

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== "paragraph" && b.type !== "heading") continue;
    const text = b.text.toLowerCase();
    let score = 0;
    for (const w of captionWords) if (text.includes(w)) score += 3;
    for (const w of ctxWords) if (text.includes(w)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return bestScore >= 3 ? bestIdx + 1 : blocks.length;
}

function isPlainImageBlock(b) {
  return b.type === "image";
}

async function syncArticle(slug, article, entry) {
  const html = await fetchHtml(entry.linkedinPath);
  const { cover, inlines } = parseLinkedInImages(html);
  const report = { hero: false, inline: 0, removed: 0 };

  if (cover) {
    const heroRel = `/images/articles/${slug}.jpg`;
    const heroDest = path.join(ROOT, "public", heroRel.replace(/^\//, ""));
    try {
      await download(cover, heroDest);
      article.image = heroRel;
      report.hero = true;
    } catch {
      /* keep existing hero */
    }
  }

  if (!inlines.length) return report;

  report.removed = article.blocks.filter(isPlainImageBlock).length;
  article.blocks = article.blocks.filter((b) => !isPlainImageBlock(b));

  const placements = [];
  for (let i = 0; i < inlines.length; i++) {
    const inline = inlines[i];
    const ext = extFromUrl(inline.url);
    const rel = `/images/articles/${slug}/inline-${String(i + 1).padStart(2, "0")}.${ext}`;
    const dest = path.join(ROOT, "public", rel.replace(/^\//, ""));

    try {
      await download(inline.url, dest);
    } catch {
      continue;
    }

    placements.push({
      insertAt: findInsertIndex(article.blocks, inline),
      block: {
        type: "image",
        src: rel,
        alt: inline.caption,
        caption: inline.caption,
      },
    });
    report.inline++;
  }

  placements.sort((a, b) => b.insertAt - a.insertAt);
  for (const p of placements) {
    article.blocks.splice(p.insertAt, 0, p.block);
  }

  return report;
}

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const summary = [];
  const only = process.argv.slice(2);
  const entries = only.length
    ? CATALOG.filter((e) => only.includes(e.slug))
    : CATALOG;

  for (const entry of entries) {
    const article = content[entry.slug];
    if (!article) continue;

    try {
      const report = await syncArticle(entry.slug, article, entry);
      if (report.hero || report.inline || report.removed) {
        const line = `${entry.slug}: hero=${report.hero} inline=${report.inline} removed=${report.removed}`;
        console.log(line);
        summary.push(line);
      }
      fs.writeFileSync(JSON_PATH, JSON.stringify(content));
    } catch (err) {
      console.log(`${entry.slug}: ERROR ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\nSynced ${summary.length} articles.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
