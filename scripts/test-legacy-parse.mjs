import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import parse by reading sync script logic - duplicate minimal test
const html = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "_debug-disruptive-innovation.html"),
  "utf8"
);

const start = html.indexOf('class="article-main__content');
const articleEnd = html.indexOf("</article>", start);
const chunk = html.slice(start, articleEnd);
const openEnd = chunk.indexOf(">");
const inner = chunk.slice(openEnd + 1);
const lastDiv = inner.lastIndexOf("</div>");
const main = inner.slice(0, lastDiv);

console.log("main length", main.length);
console.log("p count", (main.match(/<p/g) || []).length);

const tokenRe =
  /(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p[^>]*>[\s\S]*?<\/p>|<ul[^>]*>[\s\S]*?<\/ul>)/gi;
let n = 0;
for (const m of main.matchAll(tokenRe)) n++;
console.log("tokens", n);
