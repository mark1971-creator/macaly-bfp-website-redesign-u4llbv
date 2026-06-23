import { CATALOG } from "./linkedin-catalog.mjs";
import fs from "fs";

function parseCover(html) {
  const og = html.match(/property="og:image"\s+content="(https:\/\/media\.licdn\.com[^"]+)"/i);
  return og?.[1]?.replace(/&amp;/g, "&") ?? null;
}

function extractMainContent(html) {
  const m = html.match(/class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i);
  return m?.[1] ?? html;
}

function parseInlines(html) {
  const main = extractMainContent(html);
  const inlines = [];
  const seen = new Set();
  for (const m of main.matchAll(
    /([\s\S]{0,600})(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"([\s\S]{0,300})/gi
  )) {
    const u = m[2].replace(/&amp;/g, "&");
    if (seen.has(u)) continue;
    seen.add(u);
    const fig = m[3]?.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    inlines.push({
      url: u.slice(-40),
      caption: (fig?.[1] || "").replace(/<[^>]+>/g, "").trim(),
      context: m[1].replace(/<[^>]+>/g, " ").slice(-120).trim(),
    });
  }
  return inlines;
}

const slug = process.argv[2] || "retrospective-conversations-that-matter";
const entry = CATALOG.find((e) => e.slug === slug);
const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" },
  signal: AbortSignal.timeout(45000),
}).then((r) => r.text());

console.log("slug", slug);
console.log("cover", parseCover(html)?.slice(-60));
console.log("inlines", parseInlines(html).length);
parseInlines(html).forEach((x, i) => console.log(i, x.caption || "(no cap)", "|", x.context.slice(-80)));

const article = JSON.parse(fs.readFileSync("lib/article-content.json", "utf8"))[slug];
console.log("\nJSON images:");
article.blocks.filter((b) => b.type === "image").forEach((b, i) =>
  console.log(i, b.caption || "(no cap)", b.src)
);
