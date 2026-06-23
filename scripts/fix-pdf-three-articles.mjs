#!/usr/bin/env node
/** Restore heroes, fix section numbering, DEI structure, and figure captions for 3 PDF articles. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");

function captionFor(block) {
  if (block.type !== "image" || !block.src) return block;
  const alt = block.alt || "";
  const m = alt.match(/^(Table \d+|Figure \d+)/i);
  if (m) return { ...block, caption: m[1] };
  return block;
}

async function restoreHero(srcRel, destRel) {
  const assetsDir = path.join(
    process.env.CURSOR_PROJECT_ASSETS ??
      "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/assets",
  );
  const slug = path.basename(destRel, ".jpg");
  const assetSrc = path.join(assetsDir, `${slug}.jpg`);
  const src = fs.existsSync(assetSrc) ? assetSrc : path.join(ROOT, srcRel);
  const dest = path.join(ROOT, destRel);
  if (!fs.existsSync(src)) throw new Error(`Missing hero source: ${srcRel}`);
  if (src === assetSrc) {
    fs.copyFileSync(src, dest);
  } else {
    await sharp(src)
      .resize(1200, 675, { fit: "cover", position: "centre" })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(dest);
  }
  console.log("hero", path.basename(dest), src === assetSrc ? "(branded asset)" : "(pdf crop)");
}

function fixDeiBlocks(blocks) {
  const stages = [
    {
      title: "Fear-based consciousness",
      body: "In this state, organizations are mainly focused on their survival. This fosters a highly competitive environment where alliances form to further our own self interest rather than that of the organization or the customers that it serves. As a result of living in this state of fear it is more likely that people will feel excluded and judged. This might result in backstabbing, gossip and categorizing people into stereotypes. As long as fear is the underlying energy of the organization, DEI initiatives will have very little chance of success.",
    },
    {
      title: "Feel-good based consciousness",
      body: "The next level of DEI consciousness can start to express itself when the basic survival needs have been met. This is when organizations wake up to the benefits of a diverse workforce and start putting in place the policies to ensure a more equal representation amongst gender, race, sexual orientation, socioeconomic status, age and so forth. At this stage there is a naïve belief that once all the checkboxes have been ticked, results will automatically follow. However, this surface level implementation of DEI rarely delivers more than the “feel good” factor, and therefore the full potential of our diversity still won’t be realized.",
    },
    {
      title: "Reason-based consciousness",
      body: "At this stage of DEI maturity, organizations are primarily driven by results and common goals. We value each other more based on our contributions to the business than who we are as individuals. In this kind of meritocracy, we don’t fully appreciate each other’s differences and unique life experiences. Everyone is treated equally and, here again, much of the potential inherent in our diversity is left untapped.",
    },
    {
      title: "Wisdom-based consciousness",
      body: "Now the true power of diversity can start to manifest. To do so, organizations must deliberately create spaces where people can reveal more of their true selves, including their fears, their frustrations but also their deeper yearnings and aspirations. In the process of seeing each other at a much deeper level, wounds can be healed, and new, unexpected inspiration starts to flow. Two recent examples come to mind where holding space for these kinds of conversations led to a transformational shift in the organization.",
      examples: [
        "The first one was a profound share about somebody’s experience of systemic racism in their organization. In doing so, this person gave words to something many other people were feeling as well, but until then, didn’t know how to bring out into the open. Allowing everything to be expressed, without constraint, and feeling truly heard by the group, is what made this such a transformational moment.",
        "In the second example the safe space created an opportunity to overcome the generational stereotypes preventing effective collaboration. The older members of the group had deeply held beliefs about the millennials. They perceived them as lacking initiative and inventiveness. Whereas the millennials felt constrained by the controlling behavior of the more senior Gen X members of the team. Once we identified these limiting beliefs we could enter into an open dialogue where each group could express to each other why they were feeling this in a nonjudgmental way. The breakthrough happened when the senior people realized that their controlling behavior was limiting the immense creativity yearning to be expressed by the younger generation. And vice versa, the millennials had a heart opening moment when they understood the heavy responsibility that management was carrying to sustain the business. Seeing each other in their vulnerability, and brilliance, was a bridging moment that opened up new possibilities for innovation and collaboration in the workplace.",
      ],
    },
    {
      title: "Service-based consciousness",
      body: "At this highly evolved stage of DEI maturity we enter into a space of shared humanity, or unity consciousness. Seeing each other through this lens we become aware that at a soul level we all yearn for a sense of connection, purpose and meaning in our lives. In this context, we not only transcend our worldly differences to celebrate the full diversity of our unique life purposes, but we also find a way to align them as an inclusive part of the collective organizational, or societal, cause. This synchronization of individual and collective purpose can only happen when we let go of our own self interests (ego) and orient ourselves toward being in service to the greater good.",
      followUp:
        "Continuing with the example of someone sharing her experience of systemic racism in their organization, the real breakthrough happened when the group realized that was going on within the organization mirrored what was also happening with their stakeholders, and society at large. They understood that a change in the outer world, must first start with themselves. Bringing this expanded awareness into the space immediately shifted the atmosphere. It had an instant effect on how members of this diverse team connected with each other. We could feel the healing energy that was created in that instance ripple out to also impact the broader organization and beyond.",
    },
  ];

  const introEnd = blocks.findIndex(
    (b) => b.type === "heading" && b.text.includes("Breaking down the different states")
  );
  const closingStart = blocks.findIndex(
    (b) => b.type === "paragraph" && b.text.startsWith("In closing")
  );
  if (introEnd === -1 || closingStart === -1) throw new Error("DEI block anchors not found");

  const prefix = blocks.slice(0, introEnd + 2);
  const suffix = blocks.slice(closingStart);

  const stageBlocks = [];
  stages.forEach((stage, i) => {
    stageBlocks.push({ type: "heading", level: 4, text: `${i + 1}. ${stage.title}` });
    stageBlocks.push({ type: "paragraph", text: stage.body });
    if (stage.examples) {
      stageBlocks.push({ type: "ul", items: stage.examples });
    }
    if (stage.followUp) {
      stageBlocks.push({ type: "paragraph", text: stage.followUp });
    }
  });

  return [...prefix, ...stageBlocks, ...suffix];
}

function reorderEvolutionaryFigure6(blocks) {
  const fig6Idx = blocks.findIndex(
    (b) => b.type === "image" && b.src?.includes("figure-06-hp-quadrants")
  );
  const einIdx = blocks.findIndex((b) => b.type === "image" && b.src?.includes("quote-einstein"));
  const obIdx = blocks.findIndex((b) => b.type === "image" && b.src?.includes("quote-obrian"));
  if (fig6Idx === -1 || einIdx === -1 || obIdx === -1) return blocks;

  const ein = blocks[einIdx];
  const ob = blocks[obIdx];
  const without = blocks.filter((_, i) => i !== einIdx && i !== obIdx);
  const newFig6Idx = without.findIndex(
    (b) => b.type === "image" && b.src?.includes("figure-06-hp-quadrants")
  );
  without.splice(newFig6Idx + 1, 0, ein, ob);
  return without;
}

function addFigure2LeadIn(blocks) {
  const fig2Idx = blocks.findIndex(
    (b) => b.type === "image" && b.src?.includes("figure-02-complexity")
  );
  if (fig2Idx === -1) return blocks;
  const prev = blocks[fig2Idx - 1];
  if (prev?.type === "paragraph" && /Figure 2 below/i.test(prev.text)) return blocks;

  const leadIn = {
    type: "paragraph",
    text: "Figure 2 below illustrates the need for diverse ways of knowing and a higher-level evolutionary map of reality to access the next frontier in value creation.",
  };
  const next = [...blocks];
  next.splice(fig2Idx, 0, leadIn);
  return next;
}

async function main() {
  await restoreHero(
    "public/images/articles/diversity-equity-inclusion/inline-01.jpg",
    "public/images/articles/diversity-equity-inclusion.jpg"
  );
  await restoreHero(
    "public/images/articles/embedding-culture-in-ma/inline-02.jpg",
    "public/images/articles/embedding-culture-in-ma.jpg"
  );
  await restoreHero(
    "public/images/articles/leading-evolutionary-change-human-potential/page-02.jpg",
    "public/images/articles/leading-evolutionary-change-human-potential.jpg"
  );

  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));

  content["diversity-equity-inclusion"].image = "/images/articles/diversity-equity-inclusion.jpg";
  content["diversity-equity-inclusion"].blocks = fixDeiBlocks(
    content["diversity-equity-inclusion"].blocks
  ).map(captionFor);

  content["embedding-culture-in-ma"].image = "/images/articles/embedding-culture-in-ma.jpg";
  content["embedding-culture-in-ma"].blocks = content["embedding-culture-in-ma"].blocks.map(captionFor);

  let evoBlocks = content["leading-evolutionary-change-human-potential"].blocks;
  evoBlocks = addFigure2LeadIn(evoBlocks);
  evoBlocks = reorderEvolutionaryFigure6(evoBlocks);
  content["leading-evolutionary-change-human-potential"].image =
    "/images/articles/leading-evolutionary-change-human-potential.jpg";
  content["leading-evolutionary-change-human-potential"].blocks = evoBlocks.map(captionFor);

  fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);
  console.log("Updated lib/article-content.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
