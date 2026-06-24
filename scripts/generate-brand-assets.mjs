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

function starIconSvg(size = 512, { padded = true } = {}) {
  const pad = padded ? size * 0.08 : 0;
  const inner = size - pad * 2;
  const cx = pad + inner / 2;
  const cy = pad + inner / 2;

  // Star path from the actual BFP logo (bounds: ~0-47 x, ~1-49 y)
  const starPath = "M28.2985828,27.3085827 L34.3332008,27.5480379 C33.9753097,29.1539767 33.2776602,30.6533603 32.3033672,31.9428841 L28.2985828,27.3085827 Z M34.3709253,27.3722692 L28.8197283,24.9704962 L34.3335968,22.5548389 C34.6951447,24.1944215 34.6892265,25.8302845 34.3709253,27.3722692 Z M34.671932,27.5025025 L47,25.201807 C46.9713577,28.7532943 46.1873644,32.120893 44.8040469,35.1452623 L34.5284996,27.5557874 L34.4756439,27.5293439 L34.671932,27.5025025 Z M18.1453913,24.9932928 L12.6332272,27.4080992 C12.2720618,25.7690701 12.2780962,24.1337903 12.5963026,22.5923274 L18.1453913,24.9932928 Z M12.6341911,22.415829 C12.9920751,20.8104767 13.6894739,19.3116242 14.6633376,18.0224698 L18.6665491,22.6550985 L12.6341911,22.415829 Z M12.3565769,22.4886035 L5.18556873e-05,24.7944064 C0.0292212642,21.2442434 0.813178612,17.8779017 2.19605447,14.8545621 L12.4216587,22.407399 L12.5094539,22.4553796 L12.3565769,22.4886035 Z M26.8206451,29.1845684 L32.207525,32.0679109 C31.2105407,33.3498356 29.9363112,34.4164842 28.4488679,35.1630518 L26.8206451,29.1845684 Z M32.3434695,32.1406756 L32.306762,32.0897501 L32.4775494,32.1444462 L44.6433942,35.4893144 C43.1483346,38.6264648 41.0035291,41.3811381 38.3877555,43.5707595 L32.3434695,32.1406756 Z M14.7596432,17.8968281 C15.7563108,16.6152949 17.0300526,15.5489029 18.5168968,14.8023596 L20.144513,20.778985 L14.7596432,17.8968281 Z M14.6404708,17.8330432 L14.6811507,17.9122197 L14.5157622,17.8516913 L2.35738953,14.5090852 C3.85215781,11.3731398 5.9961963,8.61944039 8.61091122,6.43037438 L14.6404708,17.8330432 Z M24.6818054,30.2284243 L28.3251775,35.2241554 C27.602241,35.5756072 26.8301348,35.8519541 26.0160391,36.0414437 C25.1989251,36.2316358 24.3817844,36.3244853 23.5763102,36.3274642 L24.6818054,30.2284243 Z M28.3953761,35.3204107 L28.3953761,35.260293 L28.5004821,35.3525681 L38.1313002,43.7823947 C35.47236,45.9454774 32.3437668,47.5320601 28.9268946,48.3569161 L28.3953761,35.3204107 Z M18.6411526,14.7409583 C19.3643422,14.389303 20.1367444,14.1128089 20.9511702,13.9232425 C21.7675743,13.7332156 22.5840049,13.6403624 23.3887995,13.6372299 L22.2834313,19.7350253 L18.6411526,14.7409583 Z M18.6013672,14.6864072 L18.6013672,14.7479382 L18.4669035,14.6187837 L8.86861134,6.21769437 C11.5267142,4.05526657 14.6541817,2.46897865 18.0698078,1.64388533 L18.6013672,14.6864072 Z M22.3055482,30.2334701 L23.438429,36.3270968 C21.7772176,36.3120955 20.1686483,35.9153471 18.7158208,35.2027363 L22.3055482,30.2334701 Z M23.4624233,36.4561592 L23.5000105,36.3513439 L23.5445824,36.5025068 L28.6432214,48.4234926 C26.9879103,48.8009072 25.2667271,49 23.5000105,49 C21.7267434,49 19.9993481,48.7994282 18.3383902,48.4192873 L23.4624233,36.4561592 Z M23.5270626,13.637574 C25.1881303,13.6523106 26.7966027,14.0487342 28.2494138,14.7609816 L24.6598041,19.7299205 L23.5270626,13.637574 Z M23.5165927,13.5812626 L23.5000105,13.614485 L23.425834,13.432928 L18.3547863,1.57696656 C20.010715,1.19925416 21.7325776,1 23.5000105,1 C25.2717368,1 26.9976711,1.20022343 28.6573011,1.57972224 L23.5165927,13.5812626 Z M20.1623661,29.1987064 L18.5750175,35.1324361 C17.1395545,34.4030519 15.861601,33.3630468 14.8427296,32.0773297 L20.1623661,29.1987064 Z M18.5263104,35.3145098 L18.5902783,35.2601897 L18.5902783,35.3765252 L18.0544812,48.3524067 C14.6388953,47.5248373 11.5118783,45.9359835 8.85476663,43.7710339 L18.5263104,35.3145098 Z M28.3902774,14.8312776 C29.8259653,15.5604287 31.1041701,16.6002663 32.1233014,17.8858698 L26.8031154,20.7646814 L28.3902774,14.8312776 Z M28.4179333,14.7278896 L28.3819557,14.7692715 L28.4098712,14.5388676 L28.942008,1.64673784 C32.3574227,2.47369289 35.4843934,4.06183107 38.1416428,6.22602406 L28.4179333,14.7278896 Z M18.6766038,27.3290139 L14.7321685,31.9355189 C13.7779498,30.6913972 13.0630986,29.2256231 12.6759145,27.5946239 L18.6766038,27.3290139 Z M14.5741043,32.1201142 L14.6998675,32.0759677 L14.6102797,32.2031157 L8.59783122,43.558667 C5.98440993,41.3674856 3.84206283,38.6118554 2.34944055,35.4742217 L14.5741043,32.1201142 Z M32.2337172,18.0274419 C33.188363,19.2716269 33.9035789,20.7375859 34.2910081,22.3688552 L28.2889956,22.6344282 L32.2337172,18.0274419 Z M32.3446653,17.8978671 L32.3183686,17.8978671 L32.4239601,17.7231801 L38.3987044,6.43841134 C41.0126988,8.62922022 43.1556427,11.3846258 44.6488542,14.5221502 L32.3446653,17.8978671 Z M12.3954775,27.5122542 L12.4934057,27.5379029 L12.3831797,27.6075812 L2.18855313,35.1290217 C0.809512749,32.1080938 0.0282265667,28.7452792 0,25.1991824 L12.3954775,27.5122542 Z M34.5264523,22.4703478 L34.4731581,22.4703478 L34.6638864,22.3523563 L44.8095549,14.8667888 C46.1894454,17.8880517 46.9713957,21.2514221 47,24.798193 L34.5264523,22.4703478 Z";

  // Star center is approximately at (23.5, 25)
  // Scale to fit in the inner area with minimal margin
  const scale = inner / 55;
  const starCenterX = 23.5;
  const starCenterY = 25;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${NAVY}" rx="${padded ? size * 0.12 : 0}"/>
  <g transform="translate(${cx}, ${cy}) scale(${scale}) translate(${-starCenterX}, ${-starCenterY})">
    <path d="${starPath}" fill="${WHITE}" fill-rule="nonzero"/>
  </g>
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
    <g transform="translate(${256 - 31.5}, ${256 - 24.5})">
      <path d="M28.2985828,27.3085827 L34.3332008,27.5480379 C33.9753097,29.1539767 33.2776602,30.6533603 32.3033672,31.9428841 L28.2985828,27.3085827 Z M34.3709253,27.3722692 L28.8197283,24.9704962 L34.3335968,22.5548389 C34.6951447,24.1944215 34.6892265,25.8302845 34.3709253,27.3722692 Z M34.671932,27.5025025 L47,25.201807 C46.9713577,28.7532943 46.1873644,32.120893 44.8040469,35.1452623 L34.5284996,27.5557874 L34.4756439,27.5293439 L34.671932,27.5025025 Z M18.1453913,24.9932928 L12.6332272,27.4080992 C12.2720618,25.7690701 12.2780962,24.1337903 12.5963026,22.5923274 L18.1453913,24.9932928 Z M12.6341911,22.415829 C12.9920751,20.8104767 13.6894739,19.3116242 14.6633376,18.0224698 L18.6665491,22.6550985 L12.6341911,22.415829 Z M12.3565769,22.4886035 L5.18556873e-05,24.7944064 C0.0292212642,21.2442434 0.813178612,17.8779017 2.19605447,14.8545621 L12.4216587,22.407399 L12.5094539,22.4553796 L12.3565769,22.4886035 Z M26.8206451,29.1845684 L32.207525,32.0679109 C31.2105407,33.3498356 29.9363112,34.4164842 28.4488679,35.1630518 L26.8206451,29.1845684 Z M32.3434695,32.1406756 L32.306762,32.0897501 L32.4775494,32.1444462 L44.6433942,35.4893144 C43.1483346,38.6264648 41.0035291,41.3811381 38.3877555,43.5707595 L32.3434695,32.1406756 Z M14.7596432,17.8968281 C15.7563108,16.6152949 17.0300526,15.5489029 18.5168968,14.8023596 L20.144513,20.778985 L14.7596432,17.8968281 Z M14.6404708,17.8330432 L14.6811507,17.9122197 L14.5157622,17.8516913 L2.35738953,14.5090852 C3.85215781,11.3731398 5.9961963,8.61944039 8.61091122,6.43037438 L14.6404708,17.8330432 Z M24.6818054,30.2284243 L28.3251775,35.2241554 C27.602241,35.5756072 26.8301348,35.8519541 26.0160391,36.0414437 C25.1989251,36.2316358 24.3817844,36.3244853 23.5763102,36.3274642 L24.6818054,30.2284243 Z M28.3953761,35.3204107 L28.3953761,35.260293 L28.5004821,35.3525681 L38.1313002,43.7823947 C35.47236,45.9454774 32.3437668,47.5320601 28.9268946,48.3569161 L28.3953761,35.3204107 Z M18.6411526,14.7409583 C19.3643422,14.389303 20.1367444,14.1128089 20.9511702,13.9232425 C21.7675743,13.7332156 22.5840049,13.6403624 23.3887995,13.6372299 L22.2834313,19.7350253 L18.6411526,14.7409583 Z M18.6013672,14.6864072 L18.6013672,14.7479382 L18.4669035,14.6187837 L8.86861134,6.21769437 C11.5267142,4.05526657 14.6541817,2.46897865 18.0698078,1.64388533 L18.6013672,14.6864072 Z M22.3055482,30.2334701 L23.438429,36.3270968 C21.7772176,36.3120955 20.1686483,35.9153471 18.7158208,35.2027363 L22.3055482,30.2334701 Z M23.4624233,36.4561592 L23.5000105,36.3513439 L23.5445824,36.5025068 L28.6432214,48.4234926 C26.9879103,48.8009072 25.2667271,49 23.5000105,49 C21.7267434,49 19.9993481,48.7994282 18.3383902,48.4192873 L23.4624233,36.4561592 Z M23.5270626,13.637574 C25.1881303,13.6523106 26.7966027,14.0487342 28.2494138,14.7609816 L24.6598041,19.7299205 L23.5270626,13.637574 Z M23.5165927,13.5812626 L23.5000105,13.614485 L23.425834,13.432928 L18.3547863,1.57696656 C20.010715,1.19925416 21.7325776,1 23.5000105,1 C25.2717368,1 26.9976711,1.20022343 28.6573011,1.57972224 L23.5165927,13.5812626 Z M20.1623661,29.1987064 L18.5750175,35.1324361 C17.1395545,34.4030519 15.861601,33.3630468 14.8427296,32.0773297 L20.1623661,29.1987064 Z M18.5263104,35.3145098 L18.5902783,35.2601897 L18.5902783,35.3765252 L18.0544812,48.3524067 C14.6388953,47.5248373 11.5118783,45.9359835 8.85476663,43.7710339 L18.5263104,35.3145098 Z M28.3902774,14.8312776 C29.8259653,15.5604287 31.1041701,16.6002663 32.1233014,17.8858698 L26.8031154,20.7646814 L28.3902774,14.8312776 Z M28.4179333,14.7278896 L28.3819557,14.7692715 L28.4098712,14.5388676 L28.942008,1.64673784 C32.3574227,2.47369289 35.4843934,4.06183107 38.1416428,6.22602406 L28.4179333,14.7278896 Z M18.6766038,27.3290139 L14.7321685,31.9355189 C13.7779498,30.6913972 13.0630986,29.2256231 12.6759145,27.5946239 L18.6766038,27.3290139 Z M14.5741043,32.1201142 L14.6998675,32.0759677 L14.6102797,32.2031157 L8.59783122,43.558667 C5.98440993,41.3674856 3.84206283,38.6118554 2.34944055,35.4742217 L14.5741043,32.1201142 Z M32.2337172,18.0274419 C33.188363,19.2716269 33.9035789,20.7375859 34.2910081,22.3688552 L28.2889956,22.6344282 L32.2337172,18.0274419 Z M32.3446653,17.8978671 L32.3183686,17.8978671 L32.4239601,17.7231801 L38.3987044,6.43841134 C41.0126988,8.62922022 43.1556427,11.3846258 44.6488542,14.5221502 L32.3446653,17.8978671 Z M12.3954775,27.5122542 L12.4934057,27.5379029 L12.3831797,27.6075812 L2.18855313,35.1290217 C0.809512749,32.1080938 0.0282265667,28.7452792 0,25.1991824 L12.3954775,27.5122542 Z M34.5264523,22.4703478 L34.4731581,22.4703478 L34.6638864,22.3523563 L44.8095549,14.8667888 C46.1894454,17.8880517 46.9713957,21.2514221 47,24.798193 L34.5264523,22.4703478 Z" fill="${WHITE}" fill-rule="nonzero"/>
    </g>
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
  const iconSvg512 = starIconSvg(512);
  const iconSvg32 = starIconSvg(32, { padded: false });

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
