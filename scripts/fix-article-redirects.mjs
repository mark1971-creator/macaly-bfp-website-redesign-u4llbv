#!/usr/bin/env node
/** Regenerate legacy redirects and strip stale home/self redirects at build time. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateRedirects } from "./generate-legacy-redirects.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REDIRECTS_PATH = path.join(ROOT, "lib/article-redirects.json");
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");

const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
const published = new Set(Object.keys(content));

let redirects = generateRedirects();
const before = redirects.length;

redirects = redirects.filter((r) => {
  if (r.source === r.destination) {
    console.log("removed self redirect:", r.source);
    return false;
  }
  const tl = r.source.match(/^\/thoughtleadership\/(.+)$/);
  if (tl && r.destination === "/" && published.has(tl[1])) {
    console.log("removed home redirect:", r.source);
    return false;
  }
  const cs = r.source.match(/^\/case-studies\/(.+)$/);
  if (cs && r.destination === "/" && published.has(cs[1])) {
    console.log("removed home redirect:", r.source);
    return false;
  }
  return true;
});

fs.writeFileSync(REDIRECTS_PATH, `${JSON.stringify(redirects, null, 2)}\n`);
console.log(`Redirects: ${before} -> ${redirects.length}`);
