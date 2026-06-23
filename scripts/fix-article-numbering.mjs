#!/usr/bin/env node
/** Fix numbered section titles across all articles without re-fetching LinkedIn. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const JSON_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "../lib/article-content.json");

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

const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
let changed = 0;

for (const article of Object.values(content)) {
  const before = JSON.stringify(article.blocks);
  article.blocks = fixNumberedSectionTitles(article.blocks);
  if (JSON.stringify(article.blocks) !== before) changed++;
}

fs.writeFileSync(JSON_PATH, JSON.stringify(content));
console.log(`Fixed numbering in ${changed} articles.`);
