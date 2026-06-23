import { CATALOG } from "./linkedin-catalog.mjs";

const entry = CATALOG.find((e) => e.slug === "from-sustainability-to-thrive-ability-2");

// Try Jina reader for clean markdown
const jinaUrl = `https://r.jina.ai/https://www.linkedin.com/pulse/${entry.linkedinPath}/`;
const md = await fetch(jinaUrl, {
  headers: { Accept: "text/plain" },
  signal: AbortSignal.timeout(60000),
}).then((r) => r.text());

console.log(md.slice(0, 3000));
