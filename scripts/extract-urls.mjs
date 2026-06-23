import fs from "fs";

const transcript =
  "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/agent-transcripts/fce78483-986a-4aad-82c4-5d206909a173/fce78483-986a-4aad-82c4-5d206909a173.jsonl";
const text = fs.readFileSync(transcript, "utf8");
const urls = [...new Set(text.match(/https:\/\/www\.linkedin\.com\/pulse\/[^\s"\\]+/g) ?? [])];
console.log(urls.length);
urls.forEach((u) => console.log(u));
