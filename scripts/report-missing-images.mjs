import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFiles = ["lib/article-content.json"];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "public"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|json)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, "components"));
walk(path.join(root, "app"));

const wpRe = /(?:https:\/\/beingatfullpotential\.com)?(\/wp-content\/[^"'\s)]+)/g;
const allPaths = new Set();
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(wpRe)) allPaths.add(match[1]);
}

const missing = [...allPaths].filter((p) => !fs.existsSync(path.join(root, "public", p)));
const missingSet = new Set(missing);

function scanValue(value, found) {
  if (typeof value === "string") {
    for (const match of value.matchAll(/\/wp-content\/[^"'\s)]+/g)) {
      if (missingSet.has(match[0])) found.add(match[0]);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v) => scanValue(v, found));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => scanValue(v, found));
  }
}

const content = JSON.parse(fs.readFileSync(path.join(root, "lib/article-content.json"), "utf8"));
const articles = [];

for (const [slug, article] of Object.entries(content)) {
  const imgs = new Set();
  scanValue(article, imgs);
  if (imgs.size === 0) continue;
  const route =
    article.type === "case-study"
      ? `/case-studies/${slug}`
      : `/thoughtleadership/${slug}`;
  articles.push({
    title: article.title,
    slug,
    route,
    type: article.type,
    missing: [...imgs].sort(),
  });
}

articles.sort((a, b) => a.title.localeCompare(b.title));

// Page-level references outside article JSON
const pageRefs = [];
for (const file of sourceFiles) {
  if (file.includes("article-content.json")) continue;
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const text = fs.readFileSync(file, "utf8");
  const found = new Set();
  scanValue(text, found);
  if (found.size) pageRefs.push({ file: rel, missing: [...found].sort() });
}

console.log(`# Missing images report\n`);
console.log(`Total missing files: ${missing.length} of ${allPaths.size}\n`);
console.log(`## Articles / case studies affected (${articles.length})\n`);

for (const a of articles) {
  console.log(`### ${a.title}`);
  console.log(`- **URL:** ${a.route}`);
  console.log(`- **Missing files (${a.missing.length}):**`);
  for (const img of a.missing) console.log(`  - \`${img}\``);
  console.log("");
}

if (pageRefs.length) {
  console.log(`## Other pages with missing images\n`);
  for (const p of pageRefs) {
    console.log(`### ${p.file}`);
    for (const img of p.missing) console.log(`  - \`${img}\``);
    console.log("");
  }
}

console.log(`## All missing file paths (${missing.length})\n`);
for (const m of missing.sort()) console.log(m);
