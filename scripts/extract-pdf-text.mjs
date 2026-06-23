#!/usr/bin/env node
import fs from "fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF = process.argv[2];
if (!PDF) {
  console.error("Usage: node scripts/extract-pdf-text.mjs <path-to.pdf>");
  process.exit(1);
}

const data = new Uint8Array(fs.readFileSync(PDF));
const doc = await getDocument({ data, disableFontFace: true, verbosity: 0 }).promise;

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  const text = content.items.map((i) => i.str).join(" ").replace(/\s+/g, " ").trim();
  console.log(`\n=== PAGE ${p} ===\n${text}`);
}
