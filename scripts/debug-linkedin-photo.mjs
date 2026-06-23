#!/usr/bin/env node
import fs from "fs";

const url = process.argv[2] || "https://www.linkedin.com/in/amritaasingh/";
const r = await fetch(`https://r.jina.ai/${url}`, {
  headers: { Accept: "text/plain" },
  signal: AbortSignal.timeout(90000),
});
const text = await r.text();
fs.writeFileSync("scripts/_debug-linkedin.txt", text);
const imgs = [...text.matchAll(/https:\/\/media\.licdn\.com[^\s)\]"']+/g)].map((m) => m[0]);
console.log("status", r.status, "len", text.length, "imgs", imgs.length);
for (const img of imgs.slice(0, 5)) console.log(img.slice(0, 120));
