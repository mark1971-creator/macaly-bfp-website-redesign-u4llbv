import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = ["lib/article-content.json"];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "public"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts|json)$/.test(e.name)) files.push(p);
  }
}
walk(path.join(root, "components"));
walk(path.join(root, "app"));

const re = /\/wp-content\/[^"'\s)]+/g;
const urls = new Set();
for (const f of files) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(re)) urls.add(m[0]);
}

const missing = [...urls].filter((u) => !fs.existsSync(path.join(root, "public", u)));
console.log("missing", missing.length, "of", urls.size);
missing.slice(0, 15).forEach((u) => console.log(u));
