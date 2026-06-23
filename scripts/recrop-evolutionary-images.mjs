#!/usr/bin/env node
/** Re-crop evolutionary change article diagrams from rendered PDF pages. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const evoDir = "public/images/articles/leading-evolutionary-change-human-potential";

async function crop(page, name, region) {
  const src = path.join(ROOT, evoDir, page);
  const dest = path.join(ROOT, evoDir, name);
  await sharp(src).extract(region).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(name, `${meta.width}x${meta.height}`);
}

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

for (const [name, page, region] of crops) {
  await crop(page, name, region);
}

console.log("Done recropping evolutionary change figures.");
