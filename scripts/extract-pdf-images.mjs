#!/usr/bin/env node
/** Extract images from PDFs via pdfjs object resolution + page render fallback. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PDFS = [
  {
    slug: "diversity-equity-inclusion",
    pdf: "C:/Users/Mark Vandeneijnde/OneDrive - Being at Full Potential/My Drive/Human Potential/Heart Quotient/Creative writing/D&I/DEI and Consciousness.pdf",
    outDir: "public/images/articles/diversity-equity-inclusion",
    renderPages: [2],
  },
  {
    slug: "embedding-culture-in-ma",
    pdf: "C:/Users/Mark Vandeneijnde/OneDrive - Being at Full Potential/My Drive/Human Potential/Heart Quotient/Human Potential for Organizations/M&A thought leadership/Measuring culture for M&A fit.pdf",
    outDir: "public/images/articles/embedding-culture-in-ma",
    renderPages: [2, 3, 4, 5],
  },
  {
    slug: "leading-evolutionary-change-human-potential",
    pdf: "C:/Users/Mark Vandeneijnde/OneDrive - Being at Full Potential/My Drive/Human Potential/Heart Quotient/Human Potential for INDIVIDUALS/Self learning jouney/Module 2/Leading Evolutionary Change through HUMAN POTENTIAL Realization.pdf",
    outDir: "public/images/articles/leading-evolutionary-change-human-potential",
    renderPages: [5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16],
  },
];

function getObj(page, name, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout: ${name}`)), timeoutMs);
    try {
      page.objs.get(name, (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    } catch (err) {
      clearTimeout(timer);
      reject(err);
    }
  });
}

async function savePdfImage(img, dest) {
  if (!img?.width || !img?.height || !img?.data) return false;

  const { width, height, data, kind } = img;
  let channels = 4;
  if (kind === 3) channels = 3;
  else if (kind === 2) channels = 4;
  else if (kind === 1) channels = 1;
  else return false;

  const expected = width * height * channels;
  if (data.length < expected) return false;

  const input =
    channels === 1
      ? sharp(Buffer.from(data.subarray(0, expected)), {
          raw: { width, height, channels: 1 },
        }).toColourspace("srgb")
      : sharp(Buffer.from(data.subarray(0, expected)), {
          raw: { width, height, channels },
        });

  await input.jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  return true;
}

async function extractEmbedded(page, pageNum, absOut, indexRef) {
  const ops = await page.getOperatorList();
  const seen = new Set();
  const saved = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    if (fn !== OPS.paintImageXObject && fn !== OPS.paintInlineImageXObject) continue;

    const imgName = ops.argsArray[i][0];
    if (seen.has(imgName)) continue;
    seen.add(imgName);

    try {
      const img = await getObj(page, imgName);
      if (!img?.width || !img?.height) continue;
      if (img.width < 120 || img.height < 80) continue;

      indexRef.value += 1;
      const filename = `inline-${String(indexRef.value).padStart(2, "0")}.jpg`;
      const dest = path.join(absOut, filename);
      const ok = await savePdfImage(img, dest);
      if (!ok) continue;

      const meta = await sharp(dest).metadata();
      if ((meta.width ?? 0) < 120) {
        fs.unlinkSync(dest);
        indexRef.value -= 1;
        continue;
      }

      saved.push({
        page: pageNum,
        file: `/${path.relative(path.join(ROOT, "public"), dest).replace(/\\/g, "/")}`,
      });
      console.log("embedded", filename, `${meta.width}x${meta.height}`, `page ${pageNum}`);
    } catch {
      // try next image
    }
  }

  return saved;
}

async function renderPage(page, pageNum, absOut, indexRef) {
  const scale = 2.5;
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext("2d");

  await page.render({
    canvasContext: ctx,
    viewport,
    intent: "print",
  }).promise;

  indexRef.value += 1;
  const filename = `page-${String(pageNum).padStart(2, "0")}.jpg`;
  const dest = path.join(absOut, filename);
  const png = canvas.toBuffer("image/png");
  await sharp(png).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);

  const meta = await sharp(dest).metadata();
  console.log("rendered", filename, `${meta.width}x${meta.height}`);
  return {
    page: pageNum,
    file: `/${path.relative(path.join(ROOT, "public"), dest).replace(/\\/g, "/")}`,
    rendered: true,
  };
}

async function processPdf(config) {
  const absOut = path.join(ROOT, config.outDir);
  fs.mkdirSync(absOut, { recursive: true });

  if (!fs.existsSync(config.pdf)) {
    console.log("missing pdf", config.pdf);
    return [];
  }

  const data = new Uint8Array(fs.readFileSync(config.pdf));
  const doc = await getDocument({ data, disableFontFace: true, verbosity: 0 }).promise;
  const indexRef = { value: 0 };
  const results = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    console.log(`  page ${pageNum}/${doc.numPages}...`);
    try {
      const page = await doc.getPage(pageNum);
      results.push(...(await extractEmbedded(page, pageNum, absOut, indexRef)));

      if (config.renderPages.includes(pageNum)) {
        results.push(await renderPage(page, pageNum, absOut, indexRef));
      }
      console.log(`  page ${pageNum} done`);
    } catch (err) {
      console.error(`page ${pageNum} error:`, err.message);
    }
  }

  fs.writeFileSync(
    path.join(ROOT, "scripts", `extracted-${config.slug}.json`),
    JSON.stringify(results, null, 2)
  );

  return results;
}

async function main() {
  const only = process.argv[2];
  const list = only ? PDFS.filter((p) => p.slug === only) : PDFS;
  if (only && !list.length) {
    console.error("Unknown slug:", only);
    process.exit(1);
  }
  for (const pdf of list) {
    console.log("\n==", pdf.slug, "==");
    try {
      await processPdf(pdf);
    } catch (err) {
      console.error("failed", pdf.slug, err);
    }
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
