#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(
  fs.readFileSync(path.join(ROOT, "lib/article-content.json"), "utf8")
);

function existsLocal(webPath) {
  if (!webPath?.startsWith("/")) return false;
  const disk = path.join(ROOT, "public", webPath.replace(/^\//, ""));
  return fs.existsSync(disk) && fs.statSync(disk).size > 400;
}

let heroMiss = 0;
let inlineMiss = 0;
let inlineTotal = 0;

for (const [slug, article] of Object.entries(content)) {
  if (!existsLocal(article.image)) {
    heroMiss++;
    console.log("HERO MISSING:", slug, article.image);
  }
  for (const b of article.blocks) {
    if (b.type === "image") {
      inlineTotal++;
      if (!existsLocal(b.src)) {
        inlineMiss++;
        console.log("INLINE MISSING:", slug, b.src);
      }
    }
    if (b.type === "image-text-split" && !existsLocal(b.src)) {
      inlineTotal++;
      inlineMiss++;
      console.log("SPLIT MISSING:", slug, b.src);
    }
  }
}

console.log(`\nHero missing: ${heroMiss}/${Object.keys(content).length}`);
console.log(`Inline missing: ${inlineMiss}/${inlineTotal}`);
