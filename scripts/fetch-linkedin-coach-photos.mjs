#!/usr/bin/env node
/** Fetch coach profile photos from LinkedIn og:image metadata. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const coaches = [
  {
    url: "https://www.linkedin.com/in/amritaasingh/",
    out: "public/wp-content/uploads/2025/02/amrita-singh-3-150x150.jpg",
  },
  {
    url: "https://www.linkedin.com/in/nidhi-arora/",
    out: "public/wp-content/uploads/2025/03/Nidhi-picture-150x150.jpg",
  },
  {
    url: "https://www.linkedin.com/in/priyankadesh/",
    out: "public/wp-content/uploads/2025/08/Priyanka-150x150.jpg",
  },
];

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xhtml+xml",
};

function extractProfileImage(html) {
  const patterns = [
    /property="og:image" content="([^"]+)"/i,
    /content="([^"]+)" property="og:image"/i,
    /property='og:image' content='([^']+)'/i,
    /(https:\/\/media\.licdn\.com\/dms\/image\/[^"'\\s]+profile-displayphoto[^"'\\s]*)/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return decodeURIComponent(match[1].replace(/&amp;/g, "&").replace(/\\u0026/g, "&"));
    }
  }
  return null;
}

async function fetchHtml(url) {
  try {
    const pageRes = await fetch(url, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(60000),
    });
    if (pageRes.ok) return pageRes.text();
  } catch {
    // fall through to Jina reader
  }

  try {
    const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(60000),
    });
    if (jinaRes.ok) return jinaRes.text();
  } catch {
    return "";
  }

  return "";
}

for (const coach of coaches) {
  const dest = path.join(ROOT, coach.out);
  if (fs.existsSync(dest)) {
    console.log("skip exists", coach.out);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  const html = await fetchHtml(coach.url);
  const imageUrl = extractProfileImage(html);

  if (!imageUrl) {
    console.log("skip no profile image", coach.url, html.length ? "html bytes" : "empty");
    continue;
  }

  const imgRes = await fetch(imageUrl, { headers, redirect: "follow" });
  if (!imgRes.ok) {
    console.log("skip image fetch failed", coach.url, imgRes.status);
    continue;
  }

  const buf = Buffer.from(await imgRes.arrayBuffer());
  await sharp(buf)
    .resize(150, 150, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);

  const meta = await sharp(dest).metadata();
  console.log("saved", coach.out, `${meta.width}x${meta.height}`, imageUrl.slice(0, 80));
}

console.log("Done.");
