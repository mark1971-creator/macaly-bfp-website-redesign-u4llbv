#!/usr/bin/env node
/** Rebuild leading-evolutionary-change images from the March 2025 PDF. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PDF =
  "C:/Users/Mark Vandeneijnde/OneDrive - Being at Full Potential/My Drive/Human Potential/Heart Quotient/Human Potential for INDIVIDUALS/March 2025 HP Training/Resources docs/A changing landscape.pdf";
const OUT_DIR = path.join(
  ROOT,
  "public/images/articles/leading-evolutionary-change-human-potential"
);
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");

async function renderPage(page, dest, scale = 3) {
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport, intent: "print" }).promise;
  const png = canvas.toBuffer("image/png");
  await sharp(png).jpeg({ quality: 93, mozjpeg: true }).toFile(dest);
  return sharp(dest).metadata();
}

async function crop(pageFile, outFile, region) {
  const src = path.join(OUT_DIR, pageFile);
  const dest = path.join(OUT_DIR, outFile);
  await sharp(src).extract(region).jpeg({ quality: 93, mozjpeg: true }).toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log("  ", outFile, `${meta.width}x${meta.height}`);
}

async function main() {
  if (!fs.existsSync(PDF)) {
    console.error("PDF not found:", PDF);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Remove old test/corrupt assets
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (f.startsWith("test-") || f.startsWith("inline-") || f.startsWith("page-")) {
      fs.unlinkSync(path.join(OUT_DIR, f));
    }
  }

  const data = new Uint8Array(fs.readFileSync(PDF));
  const doc = await getDocument({ data, disableFontFace: true, verbosity: 0 }).promise;
  console.log("Rendering", doc.numPages, "pages...");

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const meta = await renderPage(page, path.join(OUT_DIR, `page-${String(p).padStart(2, "0")}.jpg`));
    console.log("page", p, `${meta.width}x${meta.height}`);
  }

  // Crops calibrated for scale=3 renders (~1836x2376) — keep in sync with recrop-evolutionary-images.mjs
  console.log("\nCropping figures...");
  const crops = [
    ["figure-02-complexity.jpg", "page-06.jpg", { left: 125, top: 720, width: 1280, height: 680 }],
    ["figure-03-integral.jpg", "page-07.jpg", { left: 80, top: 570, width: 1370, height: 590 }],
    ["figure-04-od-tools.jpg", "page-08.jpg", { left: 175, top: 400, width: 1180, height: 485 }],
    ["figure-05-spending.jpg", "page-08.jpg", { left: 175, top: 1450, width: 1180, height: 480 }],
    ["figure-06-hp-quadrants.jpg", "page-10.jpg", { left: 170, top: 785, width: 1190, height: 500 }],
    ["figure-08-hp-house.jpg", "page-12.jpg", { left: 65, top: 285, width: 1400, height: 460 }],
    ["figure-09-awareness.jpg", "page-12.jpg", { left: 295, top: 1095, width: 940, height: 455 }],
    ["figure-10-opm.jpg", "page-14.jpg", { left: 290, top: 470, width: 950, height: 520 }],
    ["figure-11-correlations.jpg", "page-15.jpg", { left: 50, top: 575, width: 1430, height: 710 }],
    ["figure-12-methodology.jpg", "page-16.jpg", { left: 70, top: 675, width: 1390, height: 620 }],
  ];

  for (const [out, page, region] of crops) {
    await crop(page, out, region);
  }

  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
  const article = content["leading-evolutionary-change-human-potential"];
  if (!article) {
    console.error("Article not found in article-content.json");
    process.exit(1);
  }

  const base = "/images/articles/leading-evolutionary-change-human-potential";
  const figureFiles = crops.map(([f]) => f);
  for (const block of article.blocks) {
    if (block.type === "image" && block.src?.includes("leading-evolutionary-change-human-potential")) {
      const name = path.basename(block.src);
      if (figureFiles.includes(name)) {
        block.src = `${base}/${name}`;
      }
    }
  }

  article.date = "2025-03-01";
  fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);
  console.log("\nUpdated article-content.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
