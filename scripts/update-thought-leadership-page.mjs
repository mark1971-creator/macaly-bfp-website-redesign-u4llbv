import fs from "fs";

const p = "components/thought-leadership-page.tsx";
const lines = fs.readFileSync(p, "utf8").split("\n");
const before = lines.slice(0, 106);
const after = lines.slice(709);

const importLine = 'import { getThoughtLeadershipArticles } from "@/lib/articles";';
const importIdx = before.findIndex((l) => l.startsWith("import { SafeImg"));
before.splice(importIdx + 1, 0, importLine);

const out = [
  ...before,
  "",
  "// Article data from lib/article-content.json",
  "const allArticles = getThoughtLeadershipArticles();",
  ...after,
].join("\n");

fs.writeFileSync(p, out);
console.log("Updated thought-leadership-page.tsx:", out.split("\n").length, "lines");
