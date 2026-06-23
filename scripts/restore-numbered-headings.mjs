#!/usr/bin/env node
/** Restore leading numbers on section headings (renderer displays them in gold). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const CONTENT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib/article-content.json");
const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

const patches = {
  "embedding-culture-in-ma": [
    ["Reframe how we think about cultural integration", "1. Reframe how we think about cultural integration"],
    ["Understanding and assessing organizational maturity", "2. Understanding and assessing organizational maturity"],
    ["Bridging finance and culture", "3. Bridging finance and culture"],
  ],
  "diversity-equity-inclusion": [
    ["Fear-based consciousness", "1. Fear-based consciousness"],
    ["Feel-good based consciousness", "2. Feel-good based consciousness"],
    ["Reason-based consciousness", "3. Reason-based consciousness"],
    ["Wisdom-based consciousness", "4. Wisdom-based consciousness"],
    ["Service-based consciousness", "5. Service-based consciousness"],
  ],
  "leading-evolutionary-change-human-potential": [
    ["All is not as well as it seems", "1. All is not as well as it seems"],
    ["Our management tools are reaching the limits", "1. Our management tools are reaching the limits"],
    ["We need a more diverse way of thinking", "2. We need a more diverse way of thinking"],
    ["Integral maps help us to access new questions", "3. Integral maps help us to access new questions"],
    ["There is a gap to be filled", "4. There is a gap to be filled"],
    ["Mindset and Inner Being", "1. Mindset and Inner Being"],
    ["Leading evolutionary change through Human Potential realization", "2. Leading evolutionary change through Human Potential realization"],
    ["Good news – we have a new integral tool to realize Human Potential", "3. Good news – we have a new integral tool to realize Human Potential"],
    ["What is the Human Potential Assessment Tool?", "4. What is the Human Potential Assessment Tool?"],
    ["The Human Potential Assessment: What gets measured gets done", "1. The Human Potential Assessment: What gets measured gets done"],
    ["How does Human Potential relate to my core business drivers?", "2. How does Human Potential relate to my core business drivers?"],
    ["The Human Potential Methodology for organizational change", "3. The Human Potential Methodology for organizational change"],
    ["Deep listening and thinking to find the unique story of each organization", "4. Deep listening and thinking to find the unique story of each organization"],
  ],
};

for (const [slug, rules] of Object.entries(patches)) {
  const article = content[slug];
  if (!article) continue;
  for (const block of article.blocks) {
    if (block.type !== "heading") continue;
    for (const [prefix, replacement] of rules) {
      if (block.text.startsWith(prefix) && !/^\d+\.\s/.test(block.text)) {
        block.text = block.text.replace(prefix, replacement);
        break;
      }
    }
  }
}

fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);
console.log("Restored numbered section headings.");
