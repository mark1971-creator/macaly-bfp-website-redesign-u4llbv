import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, "..", "lib", "article-content.json");

let s = fs.readFileSync(filePath, "utf8");

// Smart/curly quotes inside JSON string values need to become escaped straight quotes
// “ = left double quote, ” = right double quote
// ‘ = left single quote, ’ = right single quote
s = s.replace(/“/g, '\\"');
s = s.replace(/”/g, '\\"');
s = s.replace(/‘/g, "'");
s = s.replace(/’/g, "'");

try {
  JSON.parse(s);
  console.log("JSON VALID - writing file");
  fs.writeFileSync(filePath, s, "utf8");
} catch (e) {
  console.log("Still invalid:", e.message);
}
