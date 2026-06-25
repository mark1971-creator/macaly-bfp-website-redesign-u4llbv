const fs = require("fs");
const f = process.argv[2];
const text = fs.readFileSync(f, "utf8");

let result = "";
let inString = false;
let escaped = false;

for (let i = 0; i < text.length; i++) {
  const ch = text[i];
  const code = text.charCodeAt(i);

  if (escaped) {
    result += ch;
    escaped = false;
    continue;
  }

  if (ch === "\\" && inString) {
    result += ch;
    escaped = true;
    continue;
  }

  if (ch === '"' && !escaped) {
    inString = !inString;
    result += ch;
    continue;
  }

  if (code === 0x201C || code === 0x201D) {
    if (inString) {
      result += '\\"';
    } else {
      result += '"';
      inString = !inString;
    }
    continue;
  }

  result += ch;
}

try {
  JSON.parse(result);
  console.log("VALID");
  fs.writeFileSync(f, result, "utf8");
} catch (e) {
  console.log("ERROR:", e.message);
  const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || -1);
  if (pos >= 0) {
    const start = Math.max(0, pos - 60);
    console.log("Context:", JSON.stringify(result.substring(start, pos + 60)));
  }
}
