import { CATALOG } from "./linkedin-catalog.mjs";

const JUNK_INLINE =
  /\d+\s+(year|month|week|day)s?\s+ago|others also viewed|recommended by|report this article|sign in to view/i;
const JUNK_PROFILE =
  /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}(?:\s*\([^)]+\))?\s+\d+\s+(year|month|week|day)s?\s+ago\b/;

function decodeHtml(s) {
  return s.replace(/&amp;/g, "&");
}
function stripTags(s) {
  return decodeHtml(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}
function extractMainContent(html) {
  const m = html.match(
    /class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i
  );
  let main = m?.[1] ?? html;
  for (const marker of [
    "Recommended by LinkedIn",
    "Others also viewed",
    "More articles by",
    "Explore content categories",
  ]) {
    const idx = main.indexOf(marker);
    if (idx > 0) main = main.slice(0, idx);
  }
  return main;
}

function parse(slug) {
  const entry = CATALOG.find((e) => e.slug === slug);
  return fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
      Referer: "https://www.linkedin.com/",
    },
    signal: AbortSignal.timeout(45000),
  })
    .then((r) => r.text())
    .then((html) => {
      const main = extractMainContent(html);
      const raw = [...main.matchAll(
        /(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"/gi
      )].length;
      const inlines = [];
      const seen = new Set();
      for (const m of main.matchAll(
        /([\s\S]{0,800})(?:data-li-src|data-delayed-url)="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"([\s\S]{0,400})/gi
      )) {
        const u = decodeHtml(m[2]);
        if (seen.has(u)) continue;
        seen.add(u);
        const fig = m[3]?.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
        const inline = {
          url: u,
          caption: stripTags(fig?.[1] || ""),
          contextBefore: stripTags(m[1]).slice(-120),
        };
        const junk =
          JUNK_INLINE.test(`${inline.contextBefore} ${inline.caption}`) ||
          JUNK_PROFILE.test(`${inline.contextBefore} ${inline.caption}`);
        console.log(`${slug}: ${inlines.length + 1} raw=${raw} junk=${junk} ctx=${inline.contextBefore.slice(-60)}`);
        if (!junk) inlines.push(inline);
      }
      console.log(`${slug}: raw=${raw} filtered=${inlines.length}\n`);
    });
}

for (const slug of process.argv.slice(2)) {
  await parse(slug);
}
