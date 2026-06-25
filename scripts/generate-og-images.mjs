/**
 * Generates 1200x630 OG/social share images from article hero images.
 * Run: node scripts/generate-og-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const articlesDir = path.join(root, "public", "images", "articles");
const ogDir = path.join(root, "public", "images", "og");

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function main() {
  await fs.promises.mkdir(ogDir, { recursive: true });

  const files = (await fs.promises.readdir(articlesDir)).filter(
    (f) => f.endsWith(".jpg") && !f.includes("/")
  );

  for (const file of files) {
    const src = path.join(articlesDir, file);
    const dest = path.join(ogDir, file);

    try {
      await sharp(src)
        .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "centre" })
        .jpeg({ quality: 90 })
        .toFile(dest);
      console.log(`✓ ${file}`);
    } catch (e) {
      console.error(`✗ ${file}: ${e.message}`);
    }
  }

  console.log(`\nGenerated ${files.length} OG images in public/images/og/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
