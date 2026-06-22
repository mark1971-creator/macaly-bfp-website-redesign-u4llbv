/**
 * Download legacy WordPress media into public/wp-content and rewrite URLs to local paths.
 *
 * Usage:
 *   node scripts/migrate-wp-images.mjs           # download + rewrite
 *   node scripts/migrate-wp-images.mjs --rewrite-only
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rewriteOnly = process.argv.includes("--rewrite-only");

const REMOTE_PREFIX = "https://beingatfullpotential.com/wp-content/";
const LOCAL_PREFIX = "/wp-content/";

const FETCH_HEADERS = {
  "User-Agent": "BFP-Website-Migration/1.0 (contact: mark@beingatfullpotential.com)",
};

async function waybackUrl(originalUrl, retries = 3) {
  const lookup = `https://archive.org/wayback/available?url=${encodeURIComponent(
    originalUrl.replace("https://", "")
  )}`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(lookup, { headers: FETCH_HEADERS });
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      const data = await res.json();
      const closest = data?.archived_snapshots?.closest;
      if (closest?.available && closest?.url) {
        return closest.url.replace(/^http:/, "https:");
      }
      return null;
    } catch {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return null;
}

const sourceFiles = ["lib/article-content.json"];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "public"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|json|md)$/.test(entry.name)) sourceFiles.push(full);
  }
}

walk(path.join(root, "components"));
walk(path.join(root, "app"));

function collectUrls() {
  const re = /(?:https:\/\/beingatfullpotential\.com)?\/wp-content\/[^"'\s)]+/g;
  const urls = new Set();
  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(re)) {
      const value = match[0];
      const absolute = value.startsWith("/")
        ? `https://beingatfullpotential.com${value}`
        : value;
      urls.add(absolute);
    }
  }
  return [...urls];
}

function localPathFromUrl(url) {
  return path.join(root, "public", url.replace("https://beingatfullpotential.com/", ""));
}

async function downloadOne(url) {
  const dest = localPathFromUrl(url);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return "skip";

  const sources = [];
  const archived = await waybackUrl(url);
  if (archived) sources.push(archived);
  sources.push(url);

  for (const src of sources) {
    try {
      const res = await fetch(src, { redirect: "follow", headers: FETCH_HEADERS });
      if (!res.ok) continue;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/html")) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 80) continue;
      await fs.promises.mkdir(path.dirname(dest), { recursive: true });
      await fs.promises.writeFile(dest, buf);
      return "ok";
    } catch {
      // try next source
    }
  }
  return "fail";
}

async function downloadAll(urls) {
  let ok = 0;
  let skip = 0;
  let fail = 0;

  for (let i = 0; i < urls.length; i++) {
    const result = await downloadOne(urls[i]);
    if (result === "ok") ok++;
    else if (result === "skip") skip++;
    else fail++;

    if ((i + 1) % 10 === 0 || i === urls.length - 1) {
      console.log(`Progress ${i + 1}/${urls.length} (ok:${ok} skip:${skip} fail:${fail})`);
    }

    await new Promise((r) => setTimeout(r, 1200));
  }

  return { ok, skip, fail };
}

function rewriteSources() {
  let filesChanged = 0;
  for (const file of sourceFiles) {
    const original = fs.readFileSync(file, "utf8");
    const updated = original.replaceAll(REMOTE_PREFIX, LOCAL_PREFIX);
    if (updated !== original) {
      fs.writeFileSync(file, updated, "utf8");
      filesChanged++;
    }
  }
  return filesChanged;
}

async function main() {
  const urls = collectUrls();
  console.log(`Found ${urls.length} unique wp-content URLs`);

  if (!rewriteOnly) {
    const { ok, skip, fail } = await downloadAll(urls);
    console.log(`Download complete — ok:${ok} skip:${skip} fail:${fail}`);
    if (fail > 0) {
      console.warn(`${fail} images could not be downloaded; check scripts/migrate-wp-images.mjs output`);
    }
  }

  const changed = rewriteSources();
  console.log(`Rewrote URLs in ${changed} files → ${LOCAL_PREFIX}…`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
