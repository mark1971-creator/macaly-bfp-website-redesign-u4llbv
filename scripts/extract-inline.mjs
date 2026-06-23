import fs from "fs";
const h = fs.readFileSync("scripts/tmp-improving.html", "utf8");
const idx = h.indexOf("article-inline_image");
console.log("idx", idx);
if (idx > 0) {
  console.log(h.slice(idx - 120, idx + 200));
}
const urls = [
  ...h.matchAll(
    /https:\/\/media\.licdn\.com\/dms\/image\/[^"'\\s]+article-inline_image[^"'\\s]+/g
  ),
];
console.log("url count", urls.length);
urls.forEach((u) => console.log(u[0].replace(/&amp;/g, "&").slice(0, 150)));
