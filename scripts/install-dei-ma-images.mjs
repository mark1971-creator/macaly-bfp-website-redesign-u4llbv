#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSET_PREFIX = path.join(
  "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/assets",
  "c__Users_Mark_Vandeneijnde_AppData_Roaming_Cursor_User_workspaceStorage_8d4b9c189e7e421f0dacef46c80e23e7_images_image-"
);

const INSTALLS = [
  ["7d4b31bd-6b14-403c-9837-4574f844bd03.png", "public/images/articles/diversity-equity-inclusion/maturity.jpg"],
  ["a1985cfa-6134-4baf-a205-75aac53159a5.png", "public/images/articles/embedding-culture-in-ma/deloitte-image.jpg"],
  ["66c4df6d-cb8e-4a87-bb22-cda50c42048d.png", "public/images/articles/embedding-culture-in-ma/maturity-table.jpg"],
  ["2fe48fa8-67cb-446d-a5db-f3f7be8e09fa.png", "public/images/articles/embedding-culture-in-ma/spider-chart.jpg"],
];

async function install(srcSuffix, destRel) {
  const src = ASSET_PREFIX + srcSuffix;
  const dest = path.join(ROOT, destRel);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing asset: ${src}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const tmp = dest + ".tmp.png";
  fs.copyFileSync(src, tmp);
  await sharp(tmp).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  fs.unlinkSync(tmp);
  const meta = await sharp(dest).metadata();
  console.log(path.basename(dest), `${meta.width}x${meta.height}`);
}

async function main() {
  for (const [src, dest] of INSTALLS) {
    await install(src, dest);
  }

  // Hero thumbnails: keep original branded assets (do not overwrite from inline crops)
  console.log("Inline images installed. Hero thumbnails unchanged (use assets/*.jpg).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
