#!/usr/bin/env node
/** Crop Siam activation-tool laptop mockups to the on-screen UI only. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/images/case-studies/siam"
);

const FILES = [
  "Collaborative-team-Creation-and-management.jpg",
  "Engagement-activity-creation.jpg",
];

function luminance(data, x, y, width, channels) {
  const i = (y * width + x) * channels;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function findScreenBox(data, width, height, channels) {
  const xStart = Math.floor(width * 0.2);
  const xEnd = Math.floor(width * 0.8);
  const rowThreshold = 140;
  const rowRatio = 0.35;

  let top = -1;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    let bright = 0;
    for (let x = xStart; x < xEnd; x++) {
      if (luminance(data, x, y, width, channels) > rowThreshold) bright++;
    }
    if (bright / (xEnd - xStart) > rowRatio) {
      if (top === -1) top = y;
      bottom = y;
    }
  }

  if (top === -1) return null;

  const colRatio = 0.25;
  const yMidStart = top + Math.floor((bottom - top) * 0.1);
  const yMidEnd = top + Math.floor((bottom - top) * 0.9);

  let left = -1;
  let right = -1;
  for (let x = 0; x < width; x++) {
    let bright = 0;
    for (let y = yMidStart; y < yMidEnd; y++) {
      if (luminance(data, x, y, width, channels) > rowThreshold) bright++;
    }
    if (bright / (yMidEnd - yMidStart) > colRatio) {
      if (left === -1) left = x;
      right = x;
    }
  }

  const uiThreshold = 200;
  let uiTop = height;
  let uiBottom = 0;
  let uiLeft = width;
  let uiRight = 0;

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (luminance(data, x, y, width, channels) > uiThreshold) {
        uiTop = Math.min(uiTop, y);
        uiBottom = Math.max(uiBottom, y);
        uiLeft = Math.min(uiLeft, x);
        uiRight = Math.max(uiRight, x);
      }
    }
  }

  const pad = 8;
  return {
    left: Math.max(0, uiLeft - pad),
    top: Math.max(0, uiTop - pad),
    width: Math.min(width - uiLeft + pad, uiRight - uiLeft + 1 + 2 * pad),
    height: Math.min(height - uiTop + pad, uiBottom - uiTop + 1 + 2 * pad),
  };
}

for (const file of FILES) {
  const src = path.join(DIR, file);
  const tmp = src + ".tmp.jpg";
  if (!fs.existsSync(src)) {
    console.log("skip missing", file);
    continue;
  }

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const box = findScreenBox(data, info.width, info.height, info.channels);
  if (!box) {
    console.log("skip no screen detected", file);
    continue;
  }

  await sharp(src)
    .extract(box)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(tmp);

  fs.renameSync(tmp, src);

  const cropped = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let top = 0;
  let bottom = cropped.info.height - 1;
  let left = 0;
  let right = cropped.info.width - 1;

  const rowAvg = (y) => {
    let sum = 0;
    for (let x = 0; x < cropped.info.width; x++) {
      sum += luminance(
        cropped.data,
        x,
        y,
        cropped.info.width,
        cropped.info.channels
      );
    }
    return sum / cropped.info.width;
  };

  const colAvg = (x) => {
    let sum = 0;
    for (let y = 0; y < cropped.info.height; y++) {
      sum += luminance(
        cropped.data,
        x,
        y,
        cropped.info.width,
        cropped.info.channels
      );
    }
    return sum / cropped.info.height;
  };

  while (top < bottom && rowAvg(top) < 40) top++;
  while (bottom > top && rowAvg(bottom) < 40) bottom--;
  while (left < right && colAvg(left) < 40) left++;
  while (right > left && colAvg(right) < 40) right--;

  const trimmed = {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };

  await sharp(src)
    .extract(trimmed)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(tmp);

  fs.renameSync(tmp, src);
  const meta = await sharp(src).metadata();
  console.log(`cropped ${file} → ${meta.width}x${meta.height}`);
}

console.log("Done.");
