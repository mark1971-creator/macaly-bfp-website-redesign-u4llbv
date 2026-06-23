#!/usr/bin/env node
/**
 * Re-extract article body text from LinkedIn pulse HTML (article-main__content only).
 * Strips nav, comments, sign-in chrome. Preserves existing image blocks.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = path.join(ROOT, "lib/article-content.json");

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
  return decodeHtml(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
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

function isJunkText(text) {
  const t = text.trim();
  if (!t || t.length < 3) return true;
  if (/^New to LinkedIn/i.test(t)) return true;
  if (/^Join now/i.test(t)) return true;
  if (/^Skip to main content/i.test(t)) return true;
  if (/^Sign in$/i.test(t)) return true;
  if (/linkedin\.com/i.test(t) && t.length < 200) return true;
  if (/^Like$/i.test(t) || /^Comment$/i.test(t) || /^Copy$/i.test(t)) return true;
  if (/^Report this article/i.test(t)) return true;
  if (/^Show more comments/i.test(t)) return true;
  if (/^To view or add a comment/i.test(t)) return true;
  if (/^!\[\]\(/i.test(t)) return true;
  if (/^\[\]\(https:\/\/.*linkedin\.com/i.test(t)) return true;
  if (/trk=article-ssr/i.test(t)) return true;
  if (/^Mark Vandeneijnde$/i.test(t)) return true;
  if (/^Published /i.test(t)) return true;
  if (/^\+ Follow$/i.test(t)) return true;
  return false;
}

function htmlToBlocks(mainHtml) {
  const blocks = [];
  // Walk top-level elements in order
  const chunks = mainHtml.split(/(?=<(?:h[1-6]|p|ul|ol|blockquote|figure)\b)/i);

  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const h = trimmed.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (h) {
      const text = stripTags(h[2]);
      if (!isJunkText(text)) {
        blocks.push({
          type: "heading",
          level: Math.min(parseInt(h[1], 10), 3),
          text,
        });
      }
      continue;
    }

    if (/^<figure/i.test(trimmed)) continue; // images handled separately

    const bq = trimmed.match(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    if (bq) {
      const text = stripTags(bq[1]);
      if (!isJunkText(text)) blocks.push({ type: "blockquote", text });
      continue;
    }

    const ul = trimmed.match(/^<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (ul) {
      const items = [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((m) => stripTags(m[1]))
        .filter((t) => !isJunkText(t));
      if (items.length) blocks.push({ type: "ul", items });
      continue;
    }

    const ol = trimmed.match(/^<ol[^>]*>([\s\S]*?)<\/ol>/i);
    if (ol) {
      const items = [...ol[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((m) => stripTags(m[1]))
        .filter((t) => !isJunkText(t));
      if (items.length) blocks.push({ type: "ol", items });
      continue;
    }

    const ps = [...trimmed.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const p of ps) {
      const text = stripTags(p[1]);
      if (!isJunkText(text) && text.length > 15) {
        blocks.push({ type: "paragraph", text });
      }
    }
  }

  return blocks;
}

function mergeTextWithMediaBlocks(textBlocks, mediaBlocks) {
  if (!mediaBlocks.length) return textBlocks;

  const result = [];
  let mediaIdx = 0;

  for (const block of textBlocks) {
    result.push(block);
    // Insert media after headings that precede images in original (approximate: skip)
  }

  // Interleave: walk original media blocks and insert at proportional positions
  const out = [...textBlocks];
  let insertOffset = 0;
  for (const mb of mediaBlocks) {
    // Find best anchor: heading before image in original structure stored in mb.anchor
    const at = mb.anchor ?? Math.min(out.length, Math.floor(out.length * 0.7) + insertOffset);
    out.splice(at + insertOffset, 0, mb.block);
    insertOffset++;
  }
  return out;
}

function extractMediaBlocks(article) {
  return article.blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) =>
      ["image", "skill-grid", "image-text-split", "quote-grid"].includes(b.type)
    );
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

function cleanExistingBlocks(blocks) {
  return blocks
    .filter((b) => {
      if (b.type === "paragraph" || b.type === "blockquote") {
        return !isJunkText(b.text);
      }
      if (b.type === "heading") return !isJunkText(b.text);
      if (b.type === "ul" || b.type === "ol") {
        b.items = b.items.filter((t) => !isJunkText(t));
        return b.items.length > 0;
      }
      return true;
    })
    .map((b) => {
      if (b.type === "paragraph" || b.type === "blockquote") {
        return {
          ...b,
          text: b.text
            .replace(/\[\]\(https:\/\/[^)]*linkedin\.com[^)]*\)/gi, "")
            .replace(/https:\/\/[^\s]*linkedin\.com[^\s]*/gi, "")
            .replace(/\s+/g, " ")
            .trim(),
        };
      }
      return b;
    })
    .filter((b) => {
      if (b.type === "paragraph" || b.type === "blockquote")
        return b.text.length > 15;
      return true;
    });
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

    const mediaBlocks = article.blocks.filter((b) =>
      ["image", "skill-grid", "image-text-split", "quote-grid"].includes(b.type)
    );

    try {
      const html = await fetchHtml(entry.linkedinPath);
      const main = extractMainContent(html);
      let textBlocks = htmlToBlocks(main);

      if (textBlocks.length < 3) {
        // Fallback: clean existing text blocks only
        const textOnly = article.blocks.filter(
          (b) => !["image", "skill-grid", "image-text-split", "quote-grid"].includes(b.type)
        );
        textBlocks = cleanExistingBlocks(textOnly);
        console.log(`${entry.slug}: cleaned existing (${textBlocks.length} blocks)`);
      } else {
        // Replace text, keep media blocks in document order
        const cleaned = cleanExistingBlocks(textBlocks);
        // Merge: insert media blocks at roughly same relative positions using headings match
        const merged = [];
        let mediaI = 0;
        for (const tb of cleaned) {
          merged.push(tb);
        }
        // Append media at end if standard article; case studies keep structure
        if (entry.type === "case-study") {
          article.blocks = [...cleaned, ...mediaBlocks];
        } else {
          // Rebuild: text from linkedin + existing images re-inserted by context
          const images = article.blocks.filter((b) => b.type === "image");
          article.blocks = cleaned;
          // Images re-added by reconcile script; keep if already placed
          for (const img of images) {
            if (!article.blocks.some((b) => b.type === "image" && b.src === img.src)) {
              article.blocks.push(img);
            }
          }
        }
        console.log(`${entry.slug}: extracted ${cleaned.length} text blocks from LinkedIn`);
        if (entry.type !== "case-study") {
          fs.writeFileSync(JSON_PATH, JSON.stringify(content));
          await new Promise((r) => setTimeout(r, 400));
          continue;
        }
      }

      if (entry.type === "case-study") {
        article.blocks = [...textBlocks, ...mediaBlocks];
      } else {
        article.blocks = textBlocks;
      }
      console.log(`${entry.slug}: ${article.blocks.length} blocks total`);
    } catch (err) {
      // Clean junk from existing content
      const textOnly = article.blocks.filter(
        (b) => !["image", "skill-grid", "image-text-split", "quote-grid"].includes(b.type)
      );
      const media = article.blocks.filter((b) =>
        ["image", "skill-grid", "image-text-split", "quote-grid"].includes(b.type)
      );
      article.blocks = [...cleanExistingBlocks(textOnly), ...media];
      console.log(`${entry.slug}: ERROR ${err.message}, cleaned existing`);
    }

    fs.writeFileSync(JSON_PATH, JSON.stringify(content));
    await new Promise((r) => setTimeout(r, 500));
  }
}

main();
