#!/usr/bin/env node
/**
 * Migrate article library from LinkedIn pulse URLs (+ local markdown exports).
 * Usage: node scripts/migrate-linkedin-articles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  AUTHOR,
  CATALOG,
  FALLBACK_IMAGE,
  LEGACY_SLUGS,
} from "./linkedin-catalog.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const UPLOADS =
  "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/uploads";
const OLD_JSON = path.join(ROOT, "lib/article-content.json");
const OUT_JSON = OLD_JSON;
const REDIRECTS_JSON = path.join(ROOT, "lib/article-redirects.json");

const FOOTER_MARKERS = [
  /^Like\s*$/i,
  /^Comment\s*$/i,
  /^Copy\s*$/i,
  /^LinkedIn\s*$/,
  /^More articles by/i,
  /^Explore content categories/i,
  /^Join now\s*Sign in/i,
  /^To view or add a comment/i,
  /^Report this article/i,
  /^Sign in to view more content/i,
];

function stripMarkdownInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/\\([[\]()])/g, "$1")
    .replace(/\[(\d+)\]/g, "[$1]")
    .replace(/\s+/g, " ")
    .trim();
}

function isBoilerplate(line) {
  const t = line.trim();
  if (!t) return true;
  if (t.startsWith("``")) return true;
  if (/^Source URL:/.test(t)) return true;
  if (/^Agree & Join LinkedIn/.test(t)) return true;
  if (/^By clicking Continue/.test(t)) return true;
  if (/^Email or phone/.test(t)) return true;
  if (/^Password/.test(t)) return true;
  if (/^Forgot password/.test(t)) return true;
  if (/^Sign in with Email/.test(t)) return true;
  if (/^New to LinkedIn/.test(t)) return true;
  if (/^Skip to main content/.test(t)) return true;
  if (/^\* Top Content/.test(t)) return true;
  if (/^Join now/.test(t)) return true;
  if (/^Show$/.test(t)) return true;
  if (/^\+ Follow/.test(t)) return true;
  if (/^\\\+ Follow/.test(t)) return true;
  if (/^Mark Vandeneijnde$/.test(t)) return true;
  if (/^###\s+Mark Vandeneijnde/.test(t)) return true;
  if (/^Published /.test(t)) return true;
  if (/^\* Report this article/.test(t)) return true;
  if (/^Image credit/.test(t)) return true;
  if (FOOTER_MARKERS.some((re) => re.test(t))) return true;
  return false;
}

function findBodyStart(lines) {
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^Published /.test(t)) {
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const next = lines[j].trim();
        if (next && !isBoilerplate(lines[j]) && !next.startsWith("#")) {
          return j;
        }
      }
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("# ") && !lines[i].includes("Sign in")) {
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j].trim();
        if (next && !isBoilerplate(lines[j])) return j;
      }
    }
  }
  return 0;
}

function findBodyEnd(lines, start) {
  for (let i = start; i < lines.length; i++) {
    const t = lines[i].trim();
    if (FOOTER_MARKERS.some((re) => re.test(t))) return i;
    if (t === "---" && i > start + 20) {
      const rest = lines.slice(i + 1, i + 5).join(" ");
      if (/Like|Comment|LinkedIn/i.test(rest)) return i;
    }
  }
  return lines.length;
}

function parseBodyToBlocks(raw) {
  const lines = raw.split(/\r?\n/);
  const start = findBodyStart(lines);
  const end = findBodyEnd(lines, start);
  const bodyLines = lines.slice(start, end);

  const blocks = [];
  let paragraphBuf = [];
  let listBuf = null;

  const flushParagraph = () => {
    const text = stripMarkdownInline(paragraphBuf.join(" "));
    paragraphBuf = [];
    if (text.length > 20) blocks.push({ type: "paragraph", text });
  };

  const flushList = () => {
    if (listBuf?.length) {
      blocks.push({ type: "ul", items: listBuf.map(stripMarkdownInline) });
      listBuf = null;
    }
  };

  for (const line of bodyLines) {
    const t = line.trim();
    if (!t || t === "." || t === "---") {
      flushList();
      flushParagraph();
      continue;
    }
    if (isBoilerplate(line)) continue;

    const headingMatch = t.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      flushParagraph();
      const text = stripMarkdownInline(headingMatch[2]);
      if (text && text !== "Sign in to view more content") {
        blocks.push({ type: "heading", level: Math.min(headingMatch[1].length, 3), text });
      }
      continue;
    }

    const bulletMatch = t.match(/^[\*\-•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!listBuf) listBuf = [];
      listBuf.push(bulletMatch[1]);
      continue;
    }

    flushList();
    paragraphBuf.push(t);
  }

  flushList();
  flushParagraph();
  return blocks.filter((b) => {
    if (b.type === "paragraph") return b.text.length > 15;
    if (b.type === "heading") return b.text.length > 1;
    return true;
  });
}

async function fetchLinkedInMarkdown(linkedinPath) {
  const url = `https://www.linkedin.com/pulse/${linkedinPath}/`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();

  // LinkedIn embeds article text in HTML; try common patterns
  if (html.includes("Sign in to view more content") && !html.includes("pulse-main")) {
    // Still try to extract readable paragraphs from meta or JSON-LD
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ldMatch) {
      try {
        const ld = JSON.parse(ldMatch[1]);
        const body = ld.articleBody || ld.description;
        if (body && body.length > 200) return body;
      } catch {
        /* ignore */
      }
    }
  }

  // Strip tags to approximate markdown
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, lvl, inner) => {
      const t = inner.replace(/<[^>]+>/g, "").trim();
      return `\n${"#".repeat(Number(lvl))} ${t}\n`;
    })
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
      const t = inner.replace(/<[^>]+>/g, "").trim();
      return t ? `\n${t}\n` : "";
    })
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => {
      const t = inner.replace(/<[^>]+>/g, "").trim();
      return t ? `\n* ${t}\n` : "";
    })
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");

  if (text.includes("Published")) {
    text = text.replace(/.*?(Published [A-Za-z]+ \d+, \d{4})/, "Published $1\n");
  }
  return text;
}

function readLocalMd(filename) {
  const p = path.join(UPLOADS, filename);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function pickImage(entry, oldContent) {
  const old = oldContent[entry.slug];
  if (old?.image && !old.image.includes("missing")) return old.image;

  for (const legacy of entry.legacyThoughtLeadership ?? []) {
    if (oldContent[legacy]?.image) return oldContent[legacy].image;
  }
  for (const legacy of entry.legacyCaseStudy ?? []) {
    if (oldContent[legacy]?.image) return oldContent[legacy].image;
  }

  // Title-based fallback from old content
  for (const item of Object.values(oldContent)) {
    if (item.title && entry.title && similarity(item.title, entry.title) > 0.55) {
      if (item.image) return item.image;
    }
  }
  return FALLBACK_IMAGE;
}

function similarity(a, b) {
  const wa = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const wb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  let inter = 0;
  for (const w of wa) if (wb.has(w)) inter++;
  return inter / Math.max(wa.size, wb.size, 1);
}

function pickOldBlocks(entry, oldContent) {
  if (oldContent[entry.slug]?.blocks?.length) return oldContent[entry.slug].blocks;

  for (const legacy of [
    ...(entry.legacyThoughtLeadership ?? []),
    ...(entry.legacyCaseStudy ?? []),
  ]) {
    if (oldContent[legacy]?.blocks?.length) return oldContent[legacy].blocks;
  }

  let best = null;
  let bestScore = 0;
  for (const item of Object.values(oldContent)) {
    const score = similarity(item.title ?? "", entry.title);
    if (score > bestScore && item.blocks?.length > 2) {
      bestScore = score;
      best = item.blocks;
    }
  }
  return bestScore > 0.45 ? best : null;
}

function buildRedirects() {
  const content = JSON.parse(
    fs.readFileSync(path.join(ROOT, "lib/article-content.json"), "utf8")
  );

  const keptThought = new Set(
    CATALOG.filter((e) => e.type === "article").map((e) => e.slug)
  );
  const keptCase = new Set(
    CATALOG.filter((e) => e.type === "case-study").map((e) => e.slug)
  );

  for (const [slug, entry] of Object.entries(content)) {
    if (entry.type === "article") keptThought.add(slug);
    if (entry.type === "case-study") keptCase.add(slug);
  }

  const redirects = [];

  for (const entry of CATALOG) {
    const dest =
      entry.type === "case-study"
        ? `/case-studies/${entry.slug}`
        : `/thoughtleadership/${entry.slug}`;

    for (const legacy of entry.legacyThoughtLeadership ?? []) {
      redirects.push({
        source: `/thoughtleadership/${legacy}`,
        destination: dest,
        permanent: true,
      });
    }
    for (const legacy of entry.legacyCaseStudy ?? []) {
      redirects.push({
        source: `/case-studies/${legacy}`,
        destination: dest,
        permanent: true,
      });
    }
  }

  for (const slug of LEGACY_SLUGS) {
    if (keptThought.has(slug) || keptCase.has(slug)) continue;

    const mapped = redirects.find((r) => r.source === `/thoughtleadership/${slug}`);
    if (mapped) continue;

    const caseMapped = redirects.find((r) => r.source === `/case-studies/${slug}`);
    if (caseMapped) continue;

    // Case study slugs that were only in case-studies path
    if (slug === "omega-hms" || slug === "siam-computing") continue;

    redirects.push({
      source: `/thoughtleadership/${slug}`,
      destination: "/insight",
      permanent: true,
    });

    if (["omega-hms", "siam-computing", "thorntons-budgens"].includes(slug)) {
      // handled above or via legacyCaseStudy
    }
  }

  // Case study paths for removed WP-only case studies
  redirects.push({
    source: "/case-studies/thorntons-budgens",
    destination: "/case-studies/business-case-human-potential-realisation",
    permanent: true,
  });

  // Deduplicate
  const seen = new Set();
  const built = redirects.filter((r) => {
    const key = r.source;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Preserve legacy WordPress paths for published articles
  const legacyPaths = [
    ["diversity-equity-and-inclusion", "diversity-equity-inclusion"],
    ["embedding-culture-in-ma", "embedding-culture-in-ma"],
  ];
  for (const [from, to] of legacyPaths) {
    if (!keptThought.has(to)) continue;
    const pairs = [[`/${from}`, `/thoughtleadership/${to}`]];
    if (from !== to) {
      pairs.push([`/thoughtleadership/${from}`, `/thoughtleadership/${to}`]);
    }
    for (const [source, destination] of pairs) {
      if (source === destination) continue;
      const entry = built.find((r) => r.source === source);
      if (entry) entry.destination = destination;
      else built.push({ source, destination, permanent: true });
    }
  }

  // Strip home redirects for any slug that still has live content
  return built.filter((r) => {
    const thoughtMatch = r.source.match(/^\/thoughtleadership\/(.+)$/);
    if (thoughtMatch && r.destination === "/" && keptThought.has(thoughtMatch[1])) return false;
    const caseMatch = r.source.match(/^\/case-studies\/(.+)$/);
    if (caseMatch && r.destination === "/" && keptCase.has(caseMatch[1])) return false;
    return true;
  });
}

async function main() {
  const oldContent = JSON.parse(fs.readFileSync(OLD_JSON, "utf8"));
  fs.writeFileSync(OLD_JSON + ".bak", JSON.stringify(oldContent, null, 2));

  const output = {};
  const report = [];

  for (const entry of CATALOG) {
    const sourceUrl = entry.linkedinPath
      ? `https://www.linkedin.com/pulse/${entry.linkedinPath}/`
      : oldContent[entry.slug]?.sourceUrl ?? `https://beingatfullpotential.com/thoughtleadership/${entry.slug}`;

    // PDF / local-only articles: keep full existing entry when present
    if (!entry.linkedinPath && !entry.localMd && oldContent[entry.slug]?.blocks?.length > 2) {
      output[entry.slug] = {
        ...oldContent[entry.slug],
        slug: entry.slug,
        title: entry.title ?? oldContent[entry.slug].title,
        date: entry.date ?? oldContent[entry.slug].date,
        author: oldContent[entry.slug].author ?? AUTHOR,
        image: pickImage(entry, oldContent),
        type: entry.type,
        sourceUrl,
      };
      console.log(`✓ ${entry.slug} (${output[entry.slug].blocks.length} blocks, preserved-pdf)`);
      continue;
    }

    let blocks = [];
    let source = "fallback";

    try {
      let raw = entry.localMd ? readLocalMd(entry.localMd) : null;
      if (raw) {
        source = "local-md";
      } else if (entry.linkedinPath) {
        raw = await fetchLinkedInMarkdown(entry.linkedinPath);
        source = "linkedin-fetch";
      }
      if (raw) blocks = parseBodyToBlocks(raw);
    } catch (err) {
      report.push(`${entry.slug}: fetch failed (${err.message})`);
    }

    if (blocks.length < 2) {
      const oldBlocks = pickOldBlocks(entry, oldContent);
      if (oldBlocks?.length) {
        blocks = oldBlocks;
        source = "old-json";
      }
    }

    if (blocks.length < 1) {
      blocks = [
        {
          type: "paragraph",
          text: `Read the full article on LinkedIn: ${sourceUrl}`,
        },
      ];
      report.push(`${entry.slug}: minimal content — needs review`);
    }

    output[entry.slug] = {
      slug: entry.slug,
      title: entry.title,
      date: entry.date,
      author: AUTHOR,
      image: pickImage(entry, oldContent),
      blocks,
      sourceUrl,
      type: entry.type,
    };

    console.log(`✓ ${entry.slug} (${blocks.length} blocks, ${source})`);
    await new Promise((r) => setTimeout(r, 400));
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(output));
  console.log(`\nWrote ${Object.keys(output).length} entries to ${OUT_JSON}`);

  const redirects = buildRedirects();
  fs.writeFileSync(REDIRECTS_JSON, JSON.stringify(redirects, null, 2));
  console.log(`Wrote ${redirects.length} redirects to ${REDIRECTS_JSON}`);

  const homeRedirects = redirects.filter((r) => r.destination === "/");
  console.log(`Home redirects: ${homeRedirects.length}`);

  if (report.length) {
    console.log("\nWarnings:");
    report.forEach((r) => console.log(`  - ${r}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
