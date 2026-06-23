import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function decodeHtml(s) {
  return s.replace(/&amp;/g, "&");
}
function stripTags(s) {
  return decodeHtml(String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractContentBlocks(html) {
  const start = html.indexOf('data-test-id="article-content-blocks"');
  if (start < 0) return "";
  let section = html.slice(start);
  for (const marker of ['class="inline-articles"', "More articles by", "Explore content categories"]) {
    const i = section.indexOf(marker);
    if (i > 200 && marker !== 'class="inline-articles"') {
      section = section.slice(0, i);
      break;
    }
  }
  section = section.replace(
    /<div class="inline-articles[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<\/div>/gi,
    ""
  );
  return section;
}

const html = fs.readFileSync(path.join(__dirname, "_debug-culture-activation-tool.html"), "utf8");
const section = extractContentBlocks(html);
console.log("section length", section.length);
console.log("text blocks", (section.match(/article-main__content/g) || []).length);
console.log("image blocks", (section.match(/publishing-image-block/g) || []).length);

const tokens = section.split(
  /(?=<div class="article-main__content"|<div class="inline-articles|<div class="flex flex-col mt-2"[^>]*data-test-id="publishing-image-block")/i
);
console.log("tokens", tokens.length);
tokens.slice(0, 15).forEach((t, i) => {
  const kind = t.includes("publishing-image") ? "IMG" : t.includes("article-main") ? "TXT" : "OTHER";
  console.log(i, kind, stripTags(t).slice(0, 60));
});
