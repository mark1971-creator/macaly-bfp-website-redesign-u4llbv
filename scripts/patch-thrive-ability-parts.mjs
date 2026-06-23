#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.join(__dirname, "../lib/article-content.json");

// Re-use parser from patch-thin-articles by importing inline copy
const FOOTER_MARKERS = [
  /^Like\s*$/i,
  /^## More articles by/i,
  /^## Recommended by LinkedIn/i,
  /^## Others also viewed/i,
];

function stripInline(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
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
    if (lines[i].trim().startsWith("# ") && !lines[i].includes("Sign in")) start = i + 1;
  }

  const blocks = [];
  let paragraphBuf = [];
  let listBuf = null;

  const flushParagraph = () => {
    const text = stripInline(paragraphBuf.join(" "));
    paragraphBuf = [];
    if (text.length > 15) blocks.push({ type: "paragraph", text });
  };

  const flushList = () => {
    if (listBuf?.length) {
      blocks.push({ type: "ul", items: listBuf.map(stripInline) });
      listBuf = null;
    }
  };

  for (let i = start; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) {
      flushList();
      flushParagraph();
      continue;
    }
    if (FOOTER_MARKERS.some((re) => re.test(t))) break;
    if (/^Agree & Join|^By clicking|^Title:|^URL Source:|^Markdown Content:/.test(t)) continue;
    if (/^Mark Vandeneijnde$|^Published |^\* Report/.test(t)) continue;

    const headingMatch = t.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch) {
      flushList();
      flushParagraph();
      const text = stripInline(headingMatch[1]);
      if (text) blocks.push({ type: "heading", level: 2, text });
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
      if (!listBuf) listBuf = [];
      listBuf.push(bulletMatch[1]);
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
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

const FIX = [
  {
    slug: "from-sustainability-to-thrive-ability-1",
    linkedinPath: "from-sustainability-thrive-ability-part-1-assessing-vandeneijnde",
  },
  {
    slug: "from-sustainability-to-thrive-ability-2",
    linkedinPath: "from-sustainability-thrive-ability-part-2-why-so-mark-vandeneijnde",
  },
];

async function main() {
  const content = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  for (const entry of FIX) {
    console.log(`Fetching ${entry.slug}...`);
    const raw = await fetchJina(entry.linkedinPath);
    const blocks = parseJinaMarkdown(raw);
    content[entry.slug].blocks = blocks;
    console.log(`  ${blocks.length} blocks`);
    await new Promise((r) => setTimeout(r, 600));
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(content));
}

main();
