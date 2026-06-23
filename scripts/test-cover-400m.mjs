import { CATALOG } from "./linkedin-catalog.mjs";

const entry = CATALOG.find((e) => e.slug === "human-potential-400m-opportunity");
const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: { "User-Agent": "Mozilla/5.0 Chrome/120.0.0.0" },
  signal: AbortSignal.timeout(45000),
}).then((r) => r.text());

const idx = html.indexOf("article-cover_image");
console.log(html.slice(idx - 80, idx + 250).replace(/&amp;/g, "&"));

const m = html.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^"']+article-cover_image[^"']+/);
console.log("\nfull match len", m?.[0]?.length);
console.log(m?.[0]);
