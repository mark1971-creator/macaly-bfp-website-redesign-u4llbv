#!/usr/bin/env node
/** Add PDF-sourced articles to lib/article-content.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");
const BAK_PATH = path.join(ROOT, "lib/article-content.json.bak");
const REDIRECTS_PATH = path.join(ROOT, "lib/article-redirects.json");

const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
const bak = JSON.parse(fs.readFileSync(BAK_PATH, "utf8"));

function publicExists(src) {
  if (!src || !src.startsWith("/")) return false;
  return fs.existsSync(path.join(ROOT, "public", src.replace(/^\//, "")));
}

function sanitizeBlocks(blocks) {
  return blocks.filter((block) => {
    if (block.type === "image") return publicExists(block.src);
    if (block.type === "image-text-split") return publicExists(block.src);
    return true;
  });
}

function patchRedirects(slugs) {
  const redirects = JSON.parse(fs.readFileSync(REDIRECTS_PATH, "utf8"));

  // Remove any home redirect for published article slugs
  const filtered = redirects.filter((r) => {
    for (const slug of slugs) {
      if (r.source === `/thoughtleadership/${slug}` && r.destination === "/") return false;
    }
    return true;
  });

  const legacy = [
    ["diversity-equity-and-inclusion", "diversity-equity-inclusion"],
    ["embedding-culture-in-ma", "embedding-culture-in-ma"],
  ];
  for (const [from, to] of legacy) {
    const source = `/${from}`;
    const destination = `/thoughtleadership/${to}`;
    const entry = filtered.find((r) => r.source === source);
    if (entry) entry.destination = destination;
    else filtered.push({ source, destination, permanent: true });
  }

  fs.writeFileSync(REDIRECTS_PATH, `${JSON.stringify(filtered, null, 2)}\n`);
}

// ── 1. Enrich existing IDG article (Characteristics of quantum measurement PDF) ──
const idg = content["measure-inner-development-goals"];
if (idg) {
  const hasBackground = idg.blocks.some((b) => b.text?.includes("new paradigm"));
  if (!hasBackground) {
    idg.blocks.unshift(
      {
        type: "heading",
        level: 2,
        text: "Background",
      },
      {
        type: "paragraph",
        text: "A “new paradigm” of organizational purpose and impact is emerging. In this paradigm, creativity takes precedence over mere productivity, as we recognize the importance of cultivating innovative solutions and imaginative thinking in a world increasingly driven by artificial intelligence and automation. Rather than viewing efficiency and output as the sole measures of success, we embrace the inherent value of creativity as a catalyst for transformation and progress.",
      },
      {
        type: "paragraph",
        text: "Furthermore, the “new paradigm” emphasizes self-realization over self-preservation, reflecting the evolving aspirations and values of the younger generation. Instead of prioritizing stability, status and security above all else, individuals are increasingly seeking fulfilment, purpose, and authenticity in their personal and professional lives. This shift towards self-realization acknowledges the importance of holistic development, inner growth, and meaningful connections, challenging traditional notions of success and achievement.",
      }
    );
  }
  idg.title =
    "Embracing Paradox: Measuring Inner Development Goals in Organizations";
  idg.image = "/images/articles/measure-inner-development-goals.jpg";
  idg.sourceUrl =
    "https://beingatfullpotential.com/thoughtleadership/measure-inner-development-goals";
}

// ── 2. DEI article ──
content["diversity-equity-inclusion"] = {
  ...bak["diversity-equity-inclusion"],
  image: "/images/articles/diversity-equity-inclusion.jpg",
  blocks: sanitizeBlocks(bak["diversity-equity-inclusion"].blocks),
  sourceUrl: "https://beingatfullpotential.com/diversity-equity-and-inclusion/",
  type: "article",
};

// ── 3. M&A article (PDF version — leaner intro, no missing inline images) ──
content["embedding-culture-in-ma"] = {
  slug: "embedding-culture-in-ma",
  title:
    "3 steps to embedding the cultural dimension in the M&A due diligence process",
  date: "2021-09-22",
  author: "Mark Vandeneijnde",
  image: "/images/articles/embedding-culture-in-ma.jpg",
  sourceUrl: "https://beingatfullpotential.com/embedding-culture-in-ma/",
  type: "article",
  blocks: sanitizeBlocks(bak["embedding-culture-in-ma"].blocks).filter(
    (b) => !(b.type === "paragraph" && b.text === "=============")
  ),
};

// ── 4. Leading Evolutionary Change (PDF, updated 2022-04-03) ──
content["leading-evolutionary-change-human-potential"] = {
  slug: "leading-evolutionary-change-human-potential",
  title:
    "Leading Evolutionary Change in Organizations through Human Potential Realization",
  date: "2022-04-03",
  author: "Peter Leong, with Mark Vandeneijnde and Sujith Ravindran",
  image: "/images/articles/leading-evolutionary-change-human-potential.jpg",
  sourceUrl: "https://beingatfullpotential.com/",
  type: "article",
  blocks: [
    {
      type: "paragraph",
      text: "Introducing the Human Potential Assessment Tool and Methodology. Original version: 19 August 2015. Updated: 3 April 2022.",
    },
    {
      type: "paragraph",
      text: "Many organizations today are stretched to their limits trying to keep up with a changing landscape — one that is growing in complexity, driven by technological advancements, disruptive technologies, and social connectivity. There is a need for more effective ways of navigating this complex organizational world.",
    },
    {
      type: "paragraph",
      text: "There is also clear evidence that employees feel increasingly disengaged and restless in organizations. Rather than status and financial rewards, today’s workforce searches for meaning and purpose. Employees’ talents and unique gifts — human potential — are under-utilized. There is a deep desire to bring more of their whole selves to work in service of the greater good.",
    },
    {
      type: "paragraph",
      text: "However, our management toolkit falls short in delivering against these new demands. This paper introduces concepts to illustrate where most organization development funds are currently being spent, why these investments are no longer yielding results, and where the next wave of OD focus needs to be. We also offer a concrete alternative that allows organizations to shift their attention from systems-based OD interventions to mindset and inner-being-based interventions in a structured and systematic way.",
    },
    {
      type: "blockquote",
      text: "When the Being comes alive, the Doing thrives.",
    },
    {
      type: "heading",
      level: 2,
      text: "Part I – Changing landscape",
    },
    {
      type: "heading",
      level: 3,
      text: "All is not as well as it seems",
    },
    {
      type: "paragraph",
      text: "Based on Gallup’s State of Global Workplace survey, employee engagement in New Zealand is still just 24 percent (among the highest in the world). 60 percent of the workforce is not engaged, and a further 16 percent are actively disengaged.",
    },
    {
      type: "paragraph",
      text: "What drives sustainable confidence and employee engagement is purpose — not profit. The Deloitte Core Beliefs and Culture Survey (2014) shows that organizations with a strong sense of purpose are far more likely to create a best-place-to-work culture that drives innovation, embraces diversity, and helps employees reach their full potential.",
    },
    {
      type: "paragraph",
      text: "According to our approach to measuring Human Potential Realization, on average only 50–60% of individual talent and gifts are being utilized — a great opportunity to unlock engagement and purpose when we begin to harness the untapped human potential in organizations.",
    },
    {
      type: "paragraph",
      text: "Since the turn of the 20th century, management methods have historically emphasized analysis — dividing complicated systems into manageable bites and reassembling them — often ignoring the interactive effects of the system’s parts and the human side of people’s potential. Our analytical-technology-driven approaches are reaching their limits in an increasingly complex world.",
    },
    {
      type: "heading",
      level: 2,
      text: "Part II – An emerging need",
    },
    {
      type: "paragraph",
      text: "We cannot rely only on analytical-objective-technological tools to understand the truths and reality of the challenges confronting us. The time has come to open up to more integral ways of knowing and build a higher-level evolutionary map of reality to access the next frontier in value creation.",
    },
    {
      type: "paragraph",
      text: "Ken Wilber’s Integral Map — four major perspectives through which any phenomenon can be looked at — shows why our current management paradigm that relies on analytical systems and tools (lower-right quadrant) gives an incomplete map of organizational change. When we give more attention to mindsets and inner being (upper left), behavior (upper right), and culture (lower left), new questions emerge that provide a more complete picture.",
    },
    {
      type: "paragraph",
      text: "Most change management tools and corporate development budgets are concentrated in the systems quadrant. Mindset and inner being — the upper-left quadrant — is the most neglected, troublesome, and invisible developmental area for corporate leaders, with few practical implementation-ready tools available.",
    },
    {
      type: "paragraph",
      text: "McKinsey notes that over $14 billion is spent annually on leadership development, yet only 7 percent of senior managers think their companies develop global leaders effectively. One of the four common mistakes identified is underestimating mindsets — identifying the deepest thoughts, feelings, assumptions, and beliefs is usually a precondition of behavioral change, yet is too often shirked in development programs.",
    },
    {
      type: "heading",
      level: 2,
      text: "Part III – Filling the void",
    },
    {
      type: "heading",
      level: 3,
      text: "Mindset and Inner Being",
    },
    {
      type: "paragraph",
      text: "Companies’ failures or struggles to create sustainable value and growth are usually not due to a lack of technical knowledge and systems, but due to insufficient attention and investment in programs to raise consciousness and release the immense potentialities of people.",
    },
    {
      type: "paragraph",
      text: "Frederic Laloux observes that Teal organizations invite people to reclaim their inner wholeness, creating environments where people feel free to fully express themselves, bringing unprecedented levels of energy, passion, and creativity to work.",
    },
    {
      type: "heading",
      level: 3,
      text: "Leading evolutionary change through Human Potential realization",
    },
    {
      type: "paragraph",
      text: "Real and evolutionary change begins with each of us at the inner core of our being. Human Potential realization can be the lever to lift all areas of our being — mindset and behavior, shared values in culture, and new inner perspectives injected into how we work with our systems.",
    },
    {
      type: "heading",
      level: 3,
      text: "The Human Potential Assessment Tool",
    },
    {
      type: "paragraph",
      text: "The Human Potential Assessment Tool measures the extent to which one’s potential is realized based on a newly created model and framework. It puts Human Potential Realization data on the visible and tangible table, opening a safe conversational and developmental pathway to discover and harness untapped human potential.",
    },
    {
      type: "paragraph",
      text: "Maximizing Human Potential depends on triggering four States: Being Inspired, Being Abundant, Being in Service, and Being Aware. Within each State are several Dimensions that pinpoint the areas with the greatest impact on life and work.",
    },
    {
      type: "paragraph",
      text: "The tool is more than measure and metrics. The underlying essence is the actualizing of one’s human potential — putting wisdom gained into practice to create goodness for oneself and others.",
    },
    {
      type: "heading",
      level: 2,
      text: "Part IV – The Human Potential Assessment Framework and Methodology",
    },
    {
      type: "heading",
      level: 3,
      text: "What gets measured gets done",
    },
    {
      type: "paragraph",
      text: "The critical difference between the Human Potential Tool and other assessment tools is the depth of insight. The tool comprises 85 insightful statements that get to the deeper layers of human potential awareness, opening the door to breakthrough generative conversations, ideas, and affirmative activities.",
    },
    {
      type: "paragraph",
      text: "Four States and 23 Dimensions are the foundation of what drives us as human beings. Unlike personality attributes, these dimensions are common to all of us. They explore the organization’s deeper human dynamics — the more they are expressed, the more fulfilling the work experience becomes.",
    },
    {
      type: "heading",
      level: 3,
      text: "Connecting Human Potential to business drivers",
    },
    {
      type: "paragraph",
      text: "The organizational Human Potential Assessment Toolkit translates assessment data into six tangible Organizational Performance Metrics — drivers of market success that bridge Human Potential Realization and business results:",
    },
    {
      type: "ul",
      items: [
        "Inventiveness",
        "Customer Orientation",
        "Employee Engagement",
        "Trustworthiness",
        "Self Leadership",
        "Getting things done",
      ],
    },
    {
      type: "paragraph",
      text: "Creating the conditions for Human Potential to thrive inevitably translates into increased productivity, loyalty, trust, innovation, and bottom-line results. The toolkit also identifies eight measurable Being Attitudes that drive peak experience and performance.",
    },
    {
      type: "heading",
      level: 3,
      text: "The 7-step Human Potential Methodology",
    },
    {
      type: "paragraph",
      text: "The assessment is merely the beginning. The methodology drives change through three phases:",
    },
    {
      type: "ul",
      items: [
        "Enquire — sensing dilemmas and critical business questions, then assessing what the data reveals along the four states and 23 dimensions.",
        "Discovery — processing and transforming insights into actionable next steps through subtracting (understanding disconnects), passaging (releasing control of normal solution processes), and arrival (seeing opportunities in uncertainties).",
        "Harness — visualizing new intentions, re-scripting implementation plans, rolling out targeted training and coaching, and re-sculpturing management objectives and tools.",
      ],
    },
    {
      type: "paragraph",
      text: "The method deliberately refrains from offering fully articulated conclusions. The most profound discoveries and lasting commitments emerge when the client creates their own story in the data.",
    },
    {
      type: "heading",
      level: 2,
      text: "Conclusion",
    },
    {
      type: "paragraph",
      text: "There is a massive desire among employees today to work for organizations that define themselves beyond simply creating shareholder value. Management must make the growth needs of the employee a strategic imperative.",
    },
    {
      type: "paragraph",
      text: "Too much reliance on systems-based OD intervention has limited our ability to reclaim the health and wholeness of our human potentialities. With the Human Potential Toolkit, we now have a business-friendly way of tapping into the white space of Human Potential realization.",
    },
    {
      type: "paragraph",
      text: "To learn more or experience the Human Potential Assessment individually, visit beingatfullpotential.com.",
    },
  ],
};

fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);

patchRedirects([
  "diversity-equity-inclusion",
  "embedding-culture-in-ma",
  "leading-evolutionary-change-human-potential",
]);

console.log("Added/updated articles:");
console.log("  - measure-inner-development-goals (enriched)");
console.log("  - diversity-equity-inclusion");
console.log("  - embedding-culture-in-ma");
console.log("  - leading-evolutionary-change-human-potential");
console.log(`Total articles: ${Object.keys(content).length}`);
