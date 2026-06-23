import { CATALOG } from "./linkedin-catalog.mjs";

async function analyze(slug) {
  const entry = CATALOG.find((e) => e.slug === slug);
  const raw = await fetch(
    `https://r.jina.ai/https://www.linkedin.com/pulse/${entry.linkedinPath}/`
  ).then((r) => r.text());

  let body = raw;
  const rec = body.search(/## Recommended by LinkedIn/i);
  if (rec > 0) body = body.slice(0, rec);
  const footer = body.search(/## More articles by/i);
  if (footer > 0) body = body.slice(0, footer);

  const start = body.search(/Published [A-Za-z]+ \d+, \d{4}/);
  if (start > 0) body = body.slice(start);

  const urls = [];
  for (const m of body.matchAll(/https:\/\/media\.licdn\.com\/dms\/image\/[^\s"'<>\\)]+/g)) {
    const u = m[0].replace(/&amp;/g, "&");
    if (/profile-displayphoto/i.test(u)) continue;
    urls.push(u);
  }

  console.log(`\n=== ${slug} ===`);
  console.log("body images:", urls.length);
  urls.forEach((u, i) => {
    const pos = body.indexOf(u);
    const ctx = body.slice(Math.max(0, pos - 80), pos + u.length + 120).replace(/\n/g, " ");
    console.log(i, ctx.slice(0, 200));
  });

  // caption lines after linkedin.com/pulse links (embedded image placeholders)
  for (const m of body.matchAll(
    /linkedin\.com\/pulse\/[^\)]+\)\s*\n+\s*([^\n#]{5,80})\s*\n/g
  )) {
    console.log("caption-after-link:", m[1].trim());
  }
}

await analyze("improving-employee-experience");
await analyze("human-potential-400m-opportunity");
