import fs from "fs";
import { CATALOG } from "./linkedin-catalog.mjs";

// Copy parse functions from sync script
function decodeHtml(s) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}
function stripTags(s) {
  return decodeHtml(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}
function extractMainContent(html) {
  const m = html.match(/class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i);
  return m?.[1] ?? html;
}
function parseLinkedInImages(html) {
  const main = extractMainContent(html);
  const coverMatch = html.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^"'\\s]+article-cover_image[^"'\\s]+/);
  const cover = coverMatch ? decodeHtml(coverMatch[0]) : null;
  const inlines = [];
  const seen = new Set();
  const addInline = (url, caption, contextBefore, htmlIndex) => {
    const u = decodeHtml(url);
    if (!u.includes("article-inline_image") || seen.has(u)) return;
    seen.add(u);
    inlines.push({ url: u, caption: stripTags(caption || ""), contextBefore: stripTags(contextBefore || "").slice(-250), htmlIndex });
  };
  for (const m of main.matchAll(/([\s\S]{0,500})(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"[\s\S]*?(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?/gi)) {
    addInline(m[2], m[3], m[1], m.index);
  }
  inlines.sort((a, b) => a.htmlIndex - b.htmlIndex);
  return { cover: cover?.slice(0, 100), inlines };
}

const entry = CATALOG.find((e) => e.slug === "improving-employee-experience");
const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" },
  signal: AbortSignal.timeout(45000),
}).then((r) => r.text());

const r = parseLinkedInImages(html);
console.log(JSON.stringify(r, null, 2));
