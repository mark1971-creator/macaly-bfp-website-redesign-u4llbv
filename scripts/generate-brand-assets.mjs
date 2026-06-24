/**
 * Generates high-resolution favicon and social sharing assets.
 * Run: node scripts/generate-brand-assets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const NAVY = "#0E1B3E";
const GOLD = "#C49A47";
const WHITE = "#FFFFFF";

const HERO_IMAGE =
  "https://images.pexels.com/photos/17301679/pexels-photo-17301679.jpeg?auto=compress&cs=tinysrgb&w=2400";

function buildSunIconPath(cx, cy, teeth, innerR, outerR) {
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.5) / teeth) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / teeth) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + innerR * Math.cos(a0);
    const y0 = cy + innerR * Math.sin(a0);
    const x1 = cx + outerR * Math.cos(a1);
    const y1 = cy + outerR * Math.sin(a1);
    const x2 = cx + innerR * Math.cos(a2);
    const y2 = cy + innerR * Math.sin(a2);
    d += `${i === 0 ? "M" : "L"} ${x0.toFixed(3)} ${y0.toFixed(3)} L ${x1.toFixed(3)} ${y1.toFixed(3)} L ${x2.toFixed(3)} ${y2.toFixed(3)} `;
  }
  return `${d}Z`;
}

function sunIconSvg(size = 512, { padded = true } = {}) {
  const pad = padded ? size * 0.08 : 0;
  const inner = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;
  const innerR = inner * 0.175;
  const outerR = inner * 0.44;
  const gear = buildSunIconPath(cx, cy, 12, innerR, outerR);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${WHITE}" rx="${padded ? size * 0.12 : 0}"/>
  <path d="${gear}" fill="${NAVY}"/>
  <circle cx="${cx}" cy="${cy}" r="${innerR * 0.92}" fill="${WHITE}"/>
</svg>`;
}

function decorativeRingsSvg(width, height) {
  const cx = width * 0.78;
  const cy = height * 0.48;
  const maxR = Math.min(width, height) * 0.42;
  const rings = [1, 0.76, 0.52, 0.28].map((scale) => {
    const r = maxR * scale;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.18"/>`;
  });
  return rings.join("\n  ");
}

function ogSiteSvg(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}" stop-opacity="1"/>
      <stop offset="100%" stop-color="#162550" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${width}" height="${Math.round(height * 0.005)}" fill="${GOLD}" opacity="0.5"/>
  <rect x="0" y="${height - Math.round(height * 0.005)}" width="${width}" height="${Math.round(height * 0.005)}" fill="${GOLD}" opacity="0.3"/>

  <circle cx="${Math.round(width * 0.833)}" cy="${Math.round(height * 0.317)}" r="${Math.round(height * 0.476)}" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.1"/>
  <circle cx="${Math.round(width * 0.833)}" cy="${Math.round(height * 0.317)}" r="${Math.round(height * 0.349)}" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.08"/>
  <circle cx="${Math.round(width * 0.833)}" cy="${Math.round(height * 0.317)}" r="${Math.round(height * 0.222)}" fill="none" stroke="${GOLD}" stroke-width="0.8" opacity="0.06"/>
  <circle cx="${Math.round(width * 0.167)}" cy="${Math.round(height * 0.873)}" r="${Math.round(height * 0.286)}" fill="none" stroke="${GOLD}" stroke-width="0.6" opacity="0.06"/>

  <rect x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.27)}" width="60" height="3" rx="1.5" fill="${GOLD}" opacity="0.7"/>
  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.341)}" fill="${GOLD}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(height * 0.035)}" letter-spacing="6" font-weight="400" opacity="0.9">BEING AT FULL POTENTIAL</text>

  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.476)}" fill="${WHITE}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(height * 0.121)}" font-weight="300">Realize Your</text>
  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.611)}" fill="${GOLD}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(height * 0.121)}" font-weight="300" font-style="italic">Full Potential</text>

  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.698)}" fill="${WHITE}" fill-opacity="0.6" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(height * 0.035)}" font-weight="400">Leadership. Innovation. Transformation.</text>

  <rect x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.762)}" width="180" height="42" rx="21" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.6"/>
  <text x="${Math.round(width * 0.08 + 44)}" y="${Math.round(height * 0.762 + 27)}" fill="${GOLD}" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="1.5" opacity="0.8">EXPLORE</text>

  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.905)}" fill="${WHITE}" fill-opacity="0.35" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(height * 0.025)}" letter-spacing="3">beingatfullpotential.com</text>
</svg>`;
}

function ogAssessmentOverlaySvg(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}" stop-opacity="0.82"/>
      <stop offset="55%" stop-color="${NAVY}" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#060E1F" stop-opacity="0.88"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${GOLD}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#overlay)"/>
  <rect x="0" y="0" width="${width}" height="3" fill="url(#goldLine)"/>
  ${decorativeRingsSvg(width, height)}

  <!-- Brand mark -->
  <g transform="translate(${width * 0.08}, ${height * 0.1}) scale(${height * 0.00095})">
    <rect width="512" height="512" fill="${NAVY}" rx="48" opacity="0.85"/>
    <path d="${buildSunIconPath(256, 256, 12, 512 * 0.175, 512 * 0.44)}" fill="${WHITE}"/>
    <circle cx="256" cy="256" r="${512 * 0.175 * 0.92}" fill="${NAVY}"/>
  </g>

  <!-- Eyebrow -->
  <text x="${width * 0.08}" y="${height * 0.38}" fill="${GOLD}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(height * 0.034)}" letter-spacing="12" font-weight="400">HUMAN POTENTIAL ASSESSMENT</text>

  <!-- Headline -->
  <text x="${width * 0.08}" y="${height * 0.54}" fill="${WHITE}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(height * 0.115)}" font-weight="300">Measure What</text>
  <text x="${width * 0.08}" y="${height * 0.68}" fill="${GOLD}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(height * 0.115)}" font-weight="300" font-style="italic">Matters Most</text>

  <!-- Subcopy -->
  <text x="${width * 0.08}" y="${height * 0.79}" fill="${WHITE}" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(height * 0.034)}" font-weight="400">Quantifying the human qualities that drive innovation,</text>
  <text x="${width * 0.08}" y="${height * 0.86}" fill="${WHITE}" fill-opacity="0.72" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(height * 0.034)}" font-weight="400">engagement, and sustainable performance.</text>

  <!-- Footer -->
  <text x="${width * 0.08}" y="${height * 0.945}" fill="${WHITE}" fill-opacity="0.45" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(height * 0.028)}" letter-spacing="4">BEING AT FULL POTENTIAL</text>
</svg>`;
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function writeSvg(filePath, svg) {
  await ensureDir(path.dirname(filePath));
  await fs.promises.writeFile(filePath, svg, "utf8");
}

async function svgToPng(svg, width, height) {
  return sharp(Buffer.from(svg)).resize(width, height).png({ compressionLevel: 9 }).toBuffer();
}

function pngToIco(pngBuffer, size = 32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateSiteOgImage(width, height, outPath) {
  const svg = Buffer.from(ogSiteSvg(width, height));
  await ensureDir(path.dirname(outPath));
  await sharp(svg).png({ compressionLevel: 9 }).toFile(outPath);
}

async function generateAssessmentOgImage(width, height, outPath) {
  const hero = await fetchBuffer(HERO_IMAGE);
  const base = await sharp(hero)
    .resize(width, height, { fit: "cover", position: "center" })
    .jpeg({ quality: 92 })
    .toBuffer();

  const overlay = Buffer.from(ogAssessmentOverlaySvg(width, height));
  const overlayPng = await sharp(overlay).png().toBuffer();

  await ensureDir(path.dirname(outPath));
  await sharp(base).composite([{ input: overlayPng, top: 0, left: 0 }]).png({ compressionLevel: 9 }).toFile(outPath);
}

async function main() {
  const iconSvg512 = sunIconSvg(512);
  const iconSvg32 = sunIconSvg(32, { padded: false });

  const outputs = [
    ["app/icon.svg", iconSvg512],
    ["public/icon.svg", iconSvg512],
    ["public/brand/icon.svg", iconSvg512],
  ];

  for (const [rel, svg] of outputs) {
    await writeSvg(path.join(root, rel), svg);
    console.log(`✓ ${rel}`);
  }

  const pngTargets = [
    ["app/apple-icon.png", 180],
    ["public/apple-icon.png", 180],
    ["public/brand/icon-192.png", 192],
    ["public/brand/icon-512.png", 512],
    ["public/favicon-32x32.png", 32],
    ["public/favicon-16x16.png", 16],
  ];

  let favicon32Buffer = null;
  for (const [rel, size] of pngTargets) {
    const svg = size >= 64 ? iconSvg512 : iconSvg32;
    const png = await svgToPng(svg, size, size);
    await fs.promises.writeFile(path.join(root, rel), png);
    if (size === 32) favicon32Buffer = png;
    console.log(`✓ ${rel} (${size}×${size})`);
  }

  const ico32 = pngToIco(favicon32Buffer, 32);
  for (const rel of ["public/favicon.ico", "app/favicon.ico"]) {
    await fs.promises.writeFile(path.join(root, rel), ico32);
    console.log(`✓ ${rel}`);
  }

  await generateSiteOgImage(1200, 630, path.join(root, "public/brand/og-realize-your-full-potential.png"));
  console.log("✓ public/brand/og-realize-your-full-potential.png (1200×630)");

  await generateSiteOgImage(2400, 1260, path.join(root, "public/brand/og-realize-your-full-potential@2x.png"));
  console.log("✓ public/brand/og-realize-your-full-potential@2x.png (2400×1260)");

  await fs.promises.copyFile(
    path.join(root, "public/brand/og-realize-your-full-potential.png"),
    path.join(root, "app/opengraph-image.png")
  );
  console.log("✓ app/opengraph-image.png");

  await generateAssessmentOgImage(1200, 630, path.join(root, "public/brand/og-measure-what-matters.png"));
  console.log("✓ public/brand/og-measure-what-matters.png (1200×630)");

  await fs.promises.copyFile(
    path.join(root, "public/brand/og-measure-what-matters.png"),
    path.join(root, "app/assessments/opengraph-image.png")
  );
  console.log("✓ app/assessments/opengraph-image.png");

  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <rect width="1200" height="675" fill="${NAVY}"/>
    <circle cx="600" cy="300" r="90" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.25"/>
    <circle cx="600" cy="300" r="130" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.15"/>
    <rect x="450" y="420" width="300" height="2" fill="${GOLD}" opacity="0.45"/>
  </svg>`;
  await ensureDir(path.join(root, "public/images"));
  await sharp(Buffer.from(fallbackSvg)).jpeg({ quality: 88 }).toFile(path.join(root, "public/images/article-fallback.jpg"));
  console.log("✓ public/images/article-fallback.jpg");

  console.log("\nBrand assets generated successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
