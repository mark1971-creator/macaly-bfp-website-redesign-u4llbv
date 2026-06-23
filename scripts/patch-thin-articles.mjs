#!/usr/bin/env node
/** Patch articles that have minimal blocks using Jina reader. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATALOG } from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, "../lib/article-content.json");

const FOOTER_MARKERS = [
  /^Like\s*$/i,
  /^Comment\s*$/i,
  /^## More articles by/i,
  /^## Recommended by LinkedIn/i,
  /^## Others also viewed/i,
  /^## Explore content categories/i,
  /^To view or add a comment/i,
];

function stripInline(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseJinaMarkdown(raw) {
  const lines = raw.split(/\r?\n/);
  let start = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^Published /.test(lines[i].trim()) || /^\+ Follow/.test(lines[i].trim())) {
      start = i + 1;
      break;
    }
    if (lines[i].trim().startsWith("# ") && !lines[i].includes("Sign in")) {
      start = i + 1;
    }
  }

  const blocks = [];
  let paragraphBuf = [];
  let listBuf = null;
  let listType = "ul";

  const flushParagraph = () => {
    const text = stripInline(paragraphBuf.join(" "));
    paragraphBuf = [];
    if (text.length > 15) blocks.push({ type: "paragraph", text });
  };

  const flushList = () => {
    if (listBuf?.length) {
      blocks.push({ type: listType, items: listBuf.map(stripInline) });
      listBuf = null;
    }
  };

  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) {
      flushList();
      flushParagraph();
      continue;
    }
    if (FOOTER_MARKERS.some((re) => re.test(t))) break;
    if (/^Agree & Join LinkedIn/.test(t)) continue;
    if (/^By clicking Continue/.test(t)) continue;
    if (/^Markdown Content:/.test(t)) continue;
    if (/^Title:/.test(t)) continue;
    if (/^URL Source:/.test(t)) continue;
    if (t.startsWith("*   [") || t.startsWith("[Skip to")) continue;
    if (/^Mark Vandeneijnde$/.test(t)) continue;
    if (/^Published /.test(t)) continue;
    if (/^\* Report this article/.test(t)) continue;
    if (/^Image by /.test(t)) continue;

    const coverMatch = t.match(/!\[[^\]]*\]\((https:\/\/media\.licdn\.com[^)]+article-cover[^)]+)\)/);
    if (coverMatch) {
      blocks.push({
        type: "image",
        src: coverMatch[1],
        alt: "",
        caption: "",
      });
      continue;
    }

    const headingMatch = t.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      flushList();
      flushParagraph();
      const text = stripInline(headingMatch[1]);
      if (text && !text.includes("Sign in")) {
        blocks.push({ type: "heading", level: 2, text });
      }
      continue;
    }

    if (t.startsWith(">")) {
      flushList();
      flushParagraph();
      blocks.push({ type: "blockquote", text: stripInline(t.replace(/^>\s*/, "")) });
      continue;
    }

    const bulletMatch = t.match(/^[\*\-•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!listBuf || listType !== "ul") {
        flushList();
        listBuf = [];
        listType = "ul";
      }
      listBuf.push(bulletMatch[1]);
      continue;
    }

    const numberedMatch = t.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch && numberedMatch[1].length < 120) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: 3, text: stripInline(numberedMatch[1]) });
      continue;
    }

    flushList();
    paragraphBuf.push(t);
  }

  flushList();
  flushParagraph();
  return blocks;
}

async function fetchJina(linkedinPath) {
  const url = `https://r.jina.ai/https://www.linkedin.com/pulse/${linkedinPath}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jina HTTP ${res.status}`);
  return res.text();
}

function extractCoverImage(raw) {
  const m = raw.match(
    /article-cover_image[^)]+\)(?:\?[^)]*)?/
  );
  if (!m) {
    const url = raw.match(
      /(https:\/\/media\.licdn\.com\/dms\/image\/[^)\s]+article-cover_image[^)\s]+)/
    );
    return url?.[1] ?? null;
  }
  return null;
}

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const thin = CATALOG.filter((e) => (content[e.slug]?.blocks?.length ?? 0) < 3);

  for (const entry of thin) {
    console.log(`Patching ${entry.slug}...`);
    try {
      const raw = entry.localMd
        ? fs.readFileSync(
            path.join(
              "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/uploads",
              entry.localMd
            ),
            "utf8"
          )
        : await fetchJina(entry.linkedinPath);

      const blocks = parseJinaMarkdown(raw);
      if (blocks.length >= 2) {
        content[entry.slug].blocks = blocks;
        const cover = extractCoverImage(raw);
        if (cover) content[entry.slug].image = cover;
        console.log(`  → ${blocks.length} blocks`);
      } else {
        console.log(`  → still thin (${blocks.length} blocks)`);
      }
    } catch (err) {
      console.log(`  → failed: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(content));
  console.log("Done.");
}

main();
