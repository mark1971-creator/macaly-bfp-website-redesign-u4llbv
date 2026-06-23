import { CATALOG } from "./linkedin-catalog.mjs";

function decodeHtml(s) {
  return s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}
function stripTags(s) {
  return decodeHtml(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractMainContent(html) {
  const m = html.match(
    /class="article-main__content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/article/i
  );
  let main = m?.[1] ?? "";
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

function isJunkText(t) {
  if (!t || t.length < 3) return true;
  if (/linkedin\.com/i.test(t) && t.length < 250) return true;
  if (/^Join now|^Sign in|^New to LinkedIn|^Skip to main/i.test(t)) return true;
  if (/trk=article-ssr/i.test(t)) return true;
  if (/\d+\s+(year|month|week|day)s?\s+ago/i.test(t)) return true;
  return false;
}

function parseSequential(mainHtml) {
  const blocks = [];
  const tokenRe =
    /(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<p[^>]*>[\s\S]*?<\/p>|<ul[^>]*>[\s\S]*?<\/ul>|<ol[^>]*>[\s\S]*?<\/ol>|<blockquote[^>]*>[\s\S]*?<\/blockquote>|<figure[^>]*>[\s\S]*?<\/figure>|<img[^>]+>)/gi;

  const seenImages = new Set();

  for (const m of mainHtml.matchAll(tokenRe)) {
    const el = m[1];

    const h = el.match(/^<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i);
    if (h) {
      const text = stripTags(h[2]);
      if (!isJunkText(text))
        blocks.push({ type: "heading", level: Math.min(+h[1], 3), text });
      continue;
    }

    const fig = el.match(/^<figure[^>]*>([\s\S]*?)<\/figure>/i);
    if (fig) {
      const img = fig[1].match(
        /(?:data-li-src|data-delayed-url|src)="(https:\/\/media\.licdn\.com[^"]+)"/i
      );
      if (img) {
        const u = decodeHtml(img[1]);
        if (!seenImages.has(u) && !/logo|profile-displayphoto/i.test(u)) {
          seenImages.add(u);
          const cap = fig[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
          blocks.push({
            type: "image",
            url: u,
            caption: stripTags(cap?.[1] || ""),
          });
        }
      }
      continue;
    }

    if (/^<img/i.test(el)) {
      const img = el.match(
        /(?:data-li-src|data-delayed-url|src)="(https:\/\/media\.licdn\.com[^"]+)"/i
      );
      if (img) {
        const u = decodeHtml(img[1]);
        if (
          !seenImages.has(u) &&
          !/logo|profile-displayphoto|cover-img/i.test(u) &&
          u.includes("article-inline")
        ) {
          seenImages.add(u);
          blocks.push({ type: "image", url: u, caption: "" });
        }
      }
      continue;
    }

    const bq = el.match(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    if (bq) {
      const text = stripTags(bq[1]);
      if (!isJunkText(text) && text.length > 10) blocks.push({ type: "blockquote", text });
      continue;
    }

    const ul = el.match(/^<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (ul) {
      const items = [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((x) => stripTags(x[1]))
        .filter((t) => !isJunkText(t));
      if (items.length) blocks.push({ type: "ul", items });
      continue;
    }

    const ol = el.match(/^<ol[^>]*>([\s\S]*?)<\/ol>/i);
    if (ol) {
      const items = [...ol[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
        .map((x) => stripTags(x[1]))
        .filter((t) => !isJunkText(t));
      if (items.length) blocks.push({ type: "ol", items });
      continue;
    }

    const p = el.match(/^<p[^>]*>([\s\S]*?)<\/p>/i);
    if (p) {
      const text = stripTags(p[1]);
      if (!isJunkText(text) && text.length > 15) blocks.push({ type: "paragraph", text });
    }
  }

  return blocks;
}

const slug = process.argv[2] || "culture-activation-tool";
const entry = CATALOG.find((e) => e.slug === slug);
const html = await fetch(`https://www.linkedin.com/pulse/${entry.linkedinPath}/`, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    Referer: "https://www.linkedin.com/",
  },
  signal: AbortSignal.timeout(60000),
}).then((r) => r.text());

const main = extractMainContent(html);
const blocks = parseSequential(main);
console.log(`${slug}: ${blocks.length} blocks from LinkedIn\n`);
blocks.forEach((b, i) => {
  if (b.type === "image") console.log(i, "IMAGE", b.url.slice(0, 70));
  else console.log(i, b.type, (b.text || b.items?.[0] || "").slice(0, 70));
});

const local = await import("../lib/article-content.json", { assert: { type: "json" } }).catch(
  () => null
);
if (!local) {
  const fs = await import("fs");
  const c = JSON.parse(fs.readFileSync("lib/article-content.json", "utf8"))[slug];
  console.log(`\nLocal: ${c.blocks.length} blocks`);
}
