#!/usr/bin/env node
/**
 * Remove LinkedIn UI chrome from article blocks and re-extract clean text
 * from LinkedIn pulse HTML where needed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");

const MEDIA_TYPES = new Set([
  "image",
  "skill-grid",
  "image-text-split",
  "quote-grid",
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

function cleanInlineText(text) {
  return text
    .replace(/\[\]\(https:\/\/[^)]+\)/gi, "")
    .replace(/https:\/\/[^\s]*linkedin\.com[^\s]*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isJunkText(text) {
  const t = cleanInlineText(text);
  if (!t || t.length < 4) return true;
  if (/^New to LinkedIn/i.test(t)) return true;
  if (/^Join now/i.test(t)) return true;
  if (/^Skip to main content/i.test(t)) return true;
  if (/^Sign in$/i.test(t)) return true;
  if (/^Like$/i.test(t) || /^Comment$/i.test(t) || /^Copy$/i.test(t)) return true;
  if (/^Report this article/i.test(t)) return true;
  if (/^Show more comments/i.test(t)) return true;
  if (/^To view or add a comment/i.test(t)) return true;
  if (/^Mark Vandeneijnde$/i.test(t)) return true;
  if (/^Published /i.test(t)) return true;
  if (/^\+ Follow$/i.test(t)) return true;
  if (/^Explore content categories/i.test(t)) return true;
  if (/^More articles by/i.test(t)) return true;
  if (/^Recommended by LinkedIn/i.test(t)) return true;
  if (/trk=article-ssr/i.test(t)) return true;
  if (/^!\[\]/i.test(t)) return true;
  if (/^LinkedIn$/i.test(t)) return true;
  if (/linkedin\.com\/in\//i.test(t) && t.length < 300) return true;
  if (/linkedin\.com\/uas\/login/i.test(t)) return true;
  if (/^Join nowSign in/i.test(t)) return true;
  if (/^Email or phone/i.test(t)) return true;
  if (/^Password$/i.test(t)) return true;
  if (/^Forgot password/i.test(t)) return true;
  if (/^Sign in to view more content/i.test(t)) return true;
  if (/^Create your free account/i.test(t)) return true;
  if (/^Sign in with Email/i.test(t)) return true;
  if (/^Top Content$/i.test(t)) return true;
  if (/^People$/i.test(t)) return true;
  if (/^Learning$/i.test(t)) return true;
  if (/^Jobs$/i.test(t)) return true;
  if (/^Games$/i.test(t)) return true;
  if (/^Agree & Join LinkedIn/i.test(t)) return true;
  if (/^By clicking Continue/i.test(t)) return true;
  return false;
}

function extractMainContent(html) {
  const m = html.match(
    /class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i
  );
  let main = m?.[1] ?? "";
  for (const marker of [
    "Recommended by LinkedIn",
    "Others also viewed",
    "More articles by",
    "Explore content categories",
    "Sign in to view more content",
  ]) {
    const idx = main.indexOf(marker);
    if (idx > 0) main = main.slice(0, idx);
  }
  return main;
}

function htmlToBlocks(mainHtml) {
  const blocks = [];
  const tokenRe =
    /(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p[^>]*>[\s\S]*?<\/p>|<ul[^>]*>[\s\S]*?<\/ul>|<ol[^>]*>[\s\S]*?<\/ol>|<blockquote[^>]*>[\s\S]*?<\/blockquote>|<figure[^>]*>[\s\S]*?<\/figure>)/gi;

  for (const m of mainHtml.matchAll(tokenRe)) {
    const el = m[1];

    const h = el.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (h) {
      const text = cleanInlineText(stripTags(h[2]));
      if (!isJunkText(text)) {
        blocks.push({
          type: "heading",
          level: Math.min(parseInt(h[1], 10), 3),
          text,
        });
      }
      continue;
    }

    if (/^<figure/i.test(el)) continue;

    const bq = el.match(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    if (bq) {
      const text = cleanInlineText(stripTags(bq[1]));
      if (!isJunkText(text) && text.length > 10) {
        blocks.push({ type: "blockquote", text });
      }
      continue;
    }

    const ul = el.match(/^<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (ul) {
      const items = [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((x) => cleanInlineText(stripTags(x[1])))
        .filter((t) => !isJunkText(t) && t.length > 2);
      if (items.length) blocks.push({ type: "ul", items });
      continue;
    }

    const ol = el.match(/^<ol[^>]*>([\s\S]*?)<\/ol>/i);
    if (ol) {
      const items = [...ol[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((x) => cleanInlineText(stripTags(x[1])))
        .filter((t) => !isJunkText(t) && t.length > 2);
      if (items.length) blocks.push({ type: "ol", items });
      continue;
    }

    const p = el.match(/^<p[^>]*>([\s\S]*?)<\/p>/i);
    if (p) {
      const text = cleanInlineText(stripTags(p[1]));
      if (!isJunkText(text) && text.length > 15) {
        blocks.push({ type: "paragraph", text });
      }
    }
  }

  return blocks;
}

function cleanBlocks(blocks) {
  return blocks
    .map((b) => {
      if (b.type === "paragraph" || b.type === "blockquote") {
        const text = cleanInlineText(b.text);
        return text.length > 15 && !isJunkText(text) ? { ...b, text } : null;
      }
      if (b.type === "heading") {
        const text = cleanInlineText(b.text);
        return !isJunkText(text) ? { ...b, text } : null;
      }
      if (b.type === "ul" || b.type === "ol") {
        const items = b.items
          .map(cleanInlineText)
          .filter((t) => !isJunkText(t) && t.length > 2);
        return items.length ? { ...b, items } : null;
      }
      return b;
    })
    .filter(Boolean);
}

function rebuildPreservingMedia(oldBlocks, newTextBlocks) {
  const media = oldBlocks.filter((b) => MEDIA_TYPES.has(b.type));
  if (!media.length) return newTextBlocks;

  const insertPoints = [];
  let textSeen = 0;
  for (const b of oldBlocks) {
    if (MEDIA_TYPES.has(b.type)) {
      insertPoints.push({ block: b, afterText: Math.max(0, textSeen - 1) });
    } else {
      textSeen++;
    }
  }

  const oldTextCount = oldBlocks.filter((b) => !MEDIA_TYPES.has(b.type)).length;
  const out = [];
  let mediaIdx = 0;

  for (let i = 0; i < newTextBlocks.length; i++) {
    out.push(newTextBlocks[i]);
    while (mediaIdx < insertPoints.length) {
      const pt = insertPoints[mediaIdx];
      const scaledAfter =
        oldTextCount <= 1
          ? 0
          : Math.round((pt.afterText / Math.max(1, oldTextCount - 1)) * Math.max(0, newTextBlocks.length - 1));
      if (i >= scaledAfter) {
        out.push(pt.block);
        mediaIdx++;
      } else {
        break;
      }
    }
  }

  while (mediaIdx < insertPoints.length) {
    out.push(insertPoints[mediaIdx++].block);
  }
  return out;
}

async function fetchHtml(linkedinPath) {
  const res = await fetch(`https://www.linkedin.com/pulse/${linkedinPath}/`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
      Referer: "https://www.linkedin.com/",
    },
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const only = process.argv.slice(2);
  const entries = only.length
    ? CATALOG.filter((e) => only.includes(e.slug))
    : CATALOG;

  for (const entry of entries) {
    const article = content[entry.slug];
    if (!article) continue;

    const mediaBlocks = article.blocks.filter((b) => MEDIA_TYPES.has(b.type));

    try {
      const html = await fetchHtml(entry.linkedinPath);
      const main = extractMainContent(html);
      let textBlocks = htmlToBlocks(main);

      if (textBlocks.length < 3) {
        textBlocks = cleanBlocks(
          article.blocks.filter((b) => !MEDIA_TYPES.has(b.type))
        );
        console.log(`${entry.slug}: cleaned existing (${textBlocks.length} blocks)`);
      } else {
        textBlocks = cleanBlocks(textBlocks);
        console.log(`${entry.slug}: extracted ${textBlocks.length} blocks from LinkedIn`);
      }

      if (entry.type === "case-study") {
        article.blocks = article.blocks
          .map((b) => {
            if (MEDIA_TYPES.has(b.type)) return b;
            const cleaned = cleanBlocks([b]);
            return cleaned[0] ?? null;
          })
          .filter(Boolean);
      } else if (mediaBlocks.length) {
        article.blocks = rebuildPreservingMedia(article.blocks, textBlocks);
      } else {
        article.blocks = textBlocks;
      }
    } catch (err) {
      article.blocks = cleanBlocks(article.blocks);
      console.log(`${entry.slug}: fetch failed, cleaned (${err.message})`);
    }

    fs.writeFileSync(JSON_PATH, JSON.stringify(content));
    await new Promise((r) => setTimeout(r, 450));
  }

  console.log("\nDone.");
}

main();
