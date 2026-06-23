import fs from "fs";

const slug = process.argv[2] || "improving-employee-experience-through-workplace-mark-vandeneijnde";

async function main() {
  const res = await fetch(`https://www.linkedin.com/pulse/${slug}/`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const h = await res.text();
  fs.writeFileSync("scripts/tmp-improving.html", h);

  // Cover
  const cover =
    h.match(/article-cover_image[^"']+/g)?.map((x) => {
      const full = h.match(
        new RegExp(`https://media\\.licdn\\.com/dms/image/[^"'\\s]+${x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"'\\s]*`)
      );
      return full?.[0]?.replace(/&amp;/g, "&");
    }) ?? [];

  // Inline images with figcaption
  const inlines = [];
  const figRe =
    /<figure[^>]*>[\s\S]*?data-delayed-url="(https:\/\/media\.licdn\.com[^"]+article-inline_image[^"]+)"[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi;
  for (const m of h.matchAll(figRe)) {
    inlines.push({
      url: m[1].replace(/&amp;/g, "&"),
      caption: m[2].replace(/<[^>]+>/g, "").trim(),
    });
  }

  // Fallback: article-inline in data-delayed-url without figure
  if (!inlines.length) {
    for (const m of h.matchAll(
      /data-delayed-url="(https:\/\/media\.licdn\.com\/dms\/image\/[^"]+article-inline_image[^"]+)"/g
    )) {
      inlines.push({ url: m[1].replace(/&amp;/g, "&"), caption: "" });
    }
  }

  console.log("cover candidates", [...new Set(cover.filter(Boolean))].slice(0, 2));
  console.log("inline figures", inlines.length);
  inlines.forEach((x, i) => console.log(i, x.caption, x.url.slice(0, 90)));
}

main();
