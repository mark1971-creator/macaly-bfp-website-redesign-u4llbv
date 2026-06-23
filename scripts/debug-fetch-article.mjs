import { CATALOG } from "./linkedin-catalog.mjs";
import fs from "fs";

const slug = process.argv[2] || "culture-activation-tool";
const entry = CATALOG.find((e) => e.slug === slug);

const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "text/html",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: "https://www.linkedin.com/",
  },
  signal: AbortSignal.timeout(60000),
}).then((r) => r.text());

fs.writeFileSync(`scripts/_debug-${slug}.html`, html.slice(0, 500000));
console.log("len", html.length);
console.log("has article-main", html.includes("article-main__content"));
console.log("has Sign in", html.includes("Sign in to view"));
console.log("inline images", (html.match(/article-inline_image/g) || []).length);

// Try JSON-LD
const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
if (ld) {
  for (const s of ld.slice(0, 3)) {
    try {
      const j = JSON.parse(s.replace(/<\/?script[^>]*>/g, ""));
      if (j.articleBody) console.log("articleBody len", j.articleBody.length, j.articleBody.slice(0, 200));
    } catch {}
  }
}

// Jina
const jina = await fetch(`https://r.jina.ai/https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: { Accept: "text/plain" },
  signal: AbortSignal.timeout(90000),
}).then((r) => r.text());
fs.writeFileSync(`scripts/_debug-${slug}.md`, jina);
console.log("jina len", jina.length);
console.log(jina.slice(0, 1500));
