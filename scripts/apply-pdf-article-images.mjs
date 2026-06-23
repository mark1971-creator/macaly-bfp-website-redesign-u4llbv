#!/usr/bin/env node
/** Crop diagram regions from rendered PDF pages and insert image blocks into articles. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");

async function crop(src, dest, region) {
  const absSrc = path.join(ROOT, src);
  const absDest = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(absDest), { recursive: true });
  await sharp(absSrc)
    .extract(region)
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(absDest);
  const meta = await sharp(absDest).metadata();
  console.log("cropped", path.basename(dest), `${meta.width}x${meta.height}`);
  return dest.replace(/^public/, "");
}

function imageBlock(src, alt = "") {
  return { type: "image", src: `/${src.replace(/^\/+/, "")}`, alt, caption: "" };
}

function insertAfter(blocks, match, image) {
  const idx = blocks.findIndex(match);
  if (idx === -1) throw new Error("Block not found for image insert");
  blocks.splice(idx + 1, 0, image);
}

const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

// ── DEI ──
await sharp(path.join(ROOT, "public/images/articles/diversity-equity-inclusion/inline-01.jpg"))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(path.join(ROOT, "public/images/articles/diversity-equity-inclusion/maturity.jpg"));

const dei = content["diversity-equity-inclusion"];
insertAfter(
  dei.blocks,
  (b) =>
    b.type === "paragraph" &&
    b.text.includes("ancient wisdom borrowed from the Indian sages"),
  imageBlock("images/articles/diversity-equity-inclusion/maturity.jpg", "Five stages of DEI consciousness")
);

// ── M&A ──
await sharp(path.join(ROOT, "public/images/articles/embedding-culture-in-ma/inline-02.jpg"))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(path.join(ROOT, "public/images/articles/embedding-culture-in-ma/deloitte-image.jpg"));

await crop(
  "public/images/articles/embedding-culture-in-ma/page-03.jpg",
  "public/images/articles/embedding-culture-in-ma/maturity-table.jpg",
  { left: 90, top: 820, width: 1350, height: 900 }
);

await crop(
  "public/images/articles/embedding-culture-in-ma/page-05.jpg",
  "public/images/articles/embedding-culture-in-ma/spider-chart.jpg",
  { left: 60, top: 240, width: 1410, height: 470 }
);

const ma = content["embedding-culture-in-ma"];
insertAfter(
  ma.blocks,
  (b) => b.type === "paragraph" && b.text.includes("National Bureau of Economic Research"),
  imageBlock("images/articles/embedding-culture-in-ma/deloitte-image.jpg", "Deloitte M&A culture statistics")
);
insertAfter(
  ma.blocks,
  (b) =>
    b.type === "paragraph" &&
    b.text.includes("likelihood a M&A deal will create value for its stakeholders"),
  imageBlock("images/articles/embedding-culture-in-ma/maturity-table.jpg", "Five stages of organizational maturity in M&A")
);
insertAfter(
  ma.blocks,
  (b) =>
    b.type === "paragraph" &&
    b.text.includes("kinds of conversations it can open up"),
  imageBlock("images/articles/embedding-culture-in-ma/spider-chart.jpg", "Organizational Performance Metrics comparison")
);

// ── Leading Evolutionary Change ──
const evoDir = "public/images/articles/leading-evolutionary-change-human-potential";
const evoCrops = [
  ["figure-02-complexity.jpg", "page-06.jpg", { left: 140, top: 660, width: 1250, height: 560 }],
  ["figure-03-integral.jpg", "page-07.jpg", { left: 110, top: 460, width: 1310, height: 600 }],
  ["figure-04-od-tools.jpg", "page-08.jpg", { left: 170, top: 600, width: 1190, height: 540 }],
  ["figure-05-spending.jpg", "page-08.jpg", { left: 170, top: 1160, width: 1190, height: 540 }],
  ["figure-06-hp-quadrants.jpg", "page-10.jpg", { left: 190, top: 660, width: 1150, height: 540 }],
  ["figure-08-hp-house.jpg", "page-12.jpg", { left: 90, top: 130, width: 1350, height: 500 }],
  ["figure-09-awareness.jpg", "page-12.jpg", { left: 330, top: 930, width: 870, height: 540 }],
  ["figure-10-opm.jpg", "page-14.jpg", { left: 280, top: 400, width: 970, height: 640 }],
  ["figure-11-correlations.jpg", "page-15.jpg", { left: 70, top: 430, width: 1390, height: 800 }],
  ["figure-12-methodology.jpg", "page-16.jpg", { left: 90, top: 530, width: 1350, height: 720 }],
];

for (const [name, page, region] of evoCrops) {
  await crop(`${evoDir}/${page}`, `${evoDir}/${name}`, region);
}

const evo = content["leading-evolutionary-change-human-potential"];
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("increasingly complex world"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-02-complexity.jpg`, "Complexity and ways of knowing")
);
insertAfter(
  evo.blocks,
  (b) =>
    b.type === "paragraph" &&
    b.text.includes("Ken Wilber") &&
    b.text.includes("Integral Map"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-03-integral.jpg`, "Ken Wilber Integral Map four quadrants")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("systems quadrant"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-04-od-tools.jpg`, "Spread of organizational development tools")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("corporate development budgets"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-05-spending.jpg`, "Learning and development spending by quadrant")
);
insertAfter(
  evo.blocks,
  (b) =>
    b.type === "paragraph" &&
    b.text.includes("lever to lift all areas of our being"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-06-hp-quadrants.jpg`, "Human Potential realization across quadrants")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("Being Inspired, Being Abundant"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-08-hp-house.jpg`, "Human Potential meter and HP House")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("actualizing of one"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-09-awareness.jpg`, "Stated vs actualized awareness")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("bridge Human Potential Realization and business results"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-10-opm.jpg`, "Six Organizational Performance Metrics")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("eight measurable Being Attitudes"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-11-correlations.jpg`, "Correlations between OPMs, States, and Being Attitudes")
);
insertAfter(
  evo.blocks,
  (b) => b.type === "paragraph" && b.text.includes("The assessment is merely the beginning"),
  imageBlock(`${evoDir.replace("public/", "")}/figure-12-methodology.jpg`, "Seven-step Human Potential Methodology")
);

fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);
console.log("\nUpdated article-content.json with PDF images.");
