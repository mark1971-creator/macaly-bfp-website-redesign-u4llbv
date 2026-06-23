import { CATALOG } from "./linkedin-catalog.mjs";
import fs from "fs";

function extractMainContent(html) {
  const m = html.match(/class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i);
  return m?.[1] ?? html;
}

const entry = CATALOG.find((e) => e.slug === "siam-computing");
const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" },
  signal: AbortSignal.timeout(45000),
}).then((r) => r.text());

const main = extractMainContent(html);
const inlines = [];
const seen = new Set();
for (const m of main.matchAll(
  /([\s\S]{0,800})(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"([\s\S]{0,400})/gi
)) {
  const u = m[2].replace(/&amp;/g, "&");
  if (seen.has(u)) continue;
  seen.add(u);
  const fig = m[3]?.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  const ctx = m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  inlines.push({
    idx: inlines.length + 1,
    caption: (fig?.[1] || "").replace(/<[^>]+>/g, "").trim(),
    context: ctx.slice(-200),
    url: u,
  });
}

console.log("count", inlines.length);
inlines.forEach((x) => {
  console.log("\n---", x.idx, x.caption || "(no caption)");
  console.log("ctx:", x.context.slice(-150));
});

// backup expected order
const bak = JSON.parse(fs.readFileSync("lib/article-content.json.bak", "utf8"))["siam-computing"];
console.log("\nBackup image slots:");
bak.blocks.forEach((b, i) => {
  if (b.type === "image") console.log(i, b.src.split("/").pop());
  if (b.type === "skill-grid") b.items.forEach((it) => console.log(i, "grid", it.name, it.image.split("/").pop()));
});
