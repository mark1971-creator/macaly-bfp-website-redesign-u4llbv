#!/usr/bin/env node
/**
 * Install user-cropped images and rebuild the evolutionary change article
 * from the March 2025 PDF content.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(
  process.env.CURSOR_PROJECT_ASSETS ??
    "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/assets",
  "c__Users_Mark_Vandeneijnde_AppData_Roaming_Cursor_User_workspaceStorage_8d4b9c189e7e421f0dacef46c80e23e7_images_image-"
);
const OUT_DIR = path.join(
  ROOT,
  "public/images/articles/leading-evolutionary-change-human-potential"
);
const BASE = "/images/articles/leading-evolutionary-change-human-potential";
const CONTENT_PATH = path.join(ROOT, "lib/article-content.json");
const SLUG = "leading-evolutionary-change-human-potential";

const IMAGE_MAP = [
  ["5200ce8f-b27a-48ce-bc66-5a90b5847bab.png", "table-01-gallup.jpg"],
  ["a218a6d3-49f1-4909-a3ac-994916c37891.png", "table-02-deloitte.jpg"],
  ["56e95ba3-911e-4596-8fd1-cdc4ca62ded9.png", "figure-01-utilization.jpg"],
  ["2ae871c2-3371-4722-ac8c-e256d974fdaa.png", "figure-02-complexity.jpg"],
  ["aebacf0c-c855-47d1-b5b9-804a8cc75b7b.png", "figure-03-integral.jpg"],
  ["bdb635a6-b4d4-4245-963f-8ed8e87dba84.png", "figure-04-od-tools.jpg"],
  ["4b1291d4-77b1-4764-b43d-1d8d07f93ee1.png", "figure-05-spending.jpg"],
  ["a68c3375-7f39-430d-ab5f-fca867057f68.png", "quote-change-yourself.jpg"],
  ["fb7dc825-e009-468a-b10d-009a3d1d6f1a.png", "quote-einstein.jpg"],
  ["8df1f6a5-6688-4295-8b5b-a02699bd61a9.png", "quote-obrian.jpg"],
  ["54a41d23-6cad-472b-be35-50ec74348715.png", "figure-06-hp-quadrants.jpg"],
  ["9d6db564-19d4-4134-94fb-87d618f66811.png", "figure-07-hp-tool.jpg"],
  ["0a34cf12-9a91-4711-8c63-17f1e76912f2.png", "figure-08-hp-house.jpg"],
  ["3056e1ca-a1c7-4641-8e4a-419531939e53.png", "figure-09-awareness.jpg"],
  ["0ea23edb-10a9-4738-b132-1a3f81b6c79e.png", "figure-10-opm.jpg"],
  ["fd1bc63e-5dff-449b-a75f-6f90f7030ecd.png", "figure-11-correlations.jpg"],
  ["f544dda2-e022-41b7-a9b9-d0d49c11e904.png", "figure-12-methodology.jpg"],
  ["1a85dd19-08bd-4e28-ac9a-205a819e20d1.png", "quote-alan-watts.jpg"],
];

function img(name, alt) {
  return { type: "image", src: `${BASE}/${name}`, alt, caption: "" };
}

function p(text) {
  return { type: "paragraph", text };
}

function h(level, text) {
  return { type: "heading", level, text };
}

function bq(text) {
  return { type: "blockquote", text };
}

function ul(items) {
  return { type: "ul", items };
}

const blocks = [
  p(
    "Introducing the Human Potential Assessment Tool and Methodology. Original version: 19 August 2015. Updated: March 2025."
  ),
  h(2, "Abstract"),
  p(
    "Many organizations today are stretched to their limits, trying to keep up with the changing landscape that is growing in complexity, driven by technological advancements, disruptive technologies, and social connectivity. There is a need for more effective ways of navigating this complex organizational world."
  ),
  p(
    "There is also clear evidence that employees feel increasingly disengaged and restless in organizations. Rather than status and financial rewards, today's workforce searches for meaning and purpose. Employees' talents and unique gifts (human potential) are under-utilized. There is a deep desire to bring more of their whole selves to work to serve the greater good."
  ),
  p(
    "However, our management toolkit falls short and needs to deliver against these new demands. This paper introduces concepts to illustrate where most organization development (OD) funds are currently being spent, why these investments are no longer yielding results, and where the next wave of OD focus needs to be. We also offer a concrete alternative that allows organizations to shift their attention from systems-based OD interventions to mindset and inner-being-based OD interventions in a structured and systematic way."
  ),
  p(
    "Shifting OD interventions this way will better align the individual's passion and talents with the organization's collective purpose. Harnessing this untapped potential will inevitably unleash a massive wave of inspiration and value creation in the marketplace."
  ),
  p(
    "At Being at Full Potential, we are a new generation of global connectors and change agents to support and equip leaders, managers, and employees in making human potential realization the centerpiece for strategic transformation in their organizations."
  ),
  bq(
    "First, say to yourself what you would be, and then do what you must do. — Epictetus"
  ),
  bq("When the Being comes alive, the Doing thrives."),
  p(
    "Being alive is when we live a fulfilled and meaningful life by realizing and actualizing our full human potential."
  ),
  bq(
    "What makes a company a living company? And if a company does not look very healthy, what could the concerned manager do to restore it? — Arie de Geus, The Living Company"
  ),
  bq(
    "The self-interest of the company stems from its understanding that the members' potential helps create the corporate potential. — Arie de Geus, The Living Company"
  ),

  h(2, "Part I – Changing landscape"),
  h(3, "1. All is not as well as it seems"),
  p(
    "First, let us look at three data points that suggest that things are not as well as they seem in many organizations today and that things could be better."
  ),
  h(3, "a. Employee engagement"),
  p(
    "Based on Gallup's State of Global Workplace survey, the rate of employee engagement in New Zealand is still just 24 percent (though among the highest in the world). 60 percent of our workforce is not engaged — they are uninspired, lack motivation, and would do just enough to fulfill their job requirements — and a further 16 percent are actively disengaged."
  ),
  img("table-01-gallup.jpg", "Gallup State of Global Workplace Survey — engagement breakdown"),
  p(
    "As discussed further below, one of the best ways employers can help their staff stay engaged is to give them the tools to realize their full human potential."
  ),
  h(3, "b. Purpose – Not Profit"),
  p(
    "What drives sustainable confidence and employee engagement is purpose, not profit. The Deloitte Core Beliefs and Culture Survey (2014) points out that organizations with a strong sense of purpose are far more likely to create a best-place-to-work culture that drives innovation, embraces diversity, and helps employees reach their full potential compared to organizations that do not."
  ),
  img(
    "table-02-deloitte.jpg",
    "Deloitte Core Beliefs and Culture Survey 2014 — purpose and engagement"
  ),
  h(3, "c. Human Potential is underutilized (hence a great opportunity)"),
  p(
    "According to our unique approach to measuring Human Potential Realization, we found that on average only 50–60% of individual talent and gifts (potential) are being utilized. The details of this approach are discussed in subsequent sections of this paper."
  ),
  img("figure-01-utilization.jpg", "Figure 1 — Measuring human potential utilization"),
  p(
    "On the other hand, this means we have a great opportunity — imagine how many more employees can become more fully engaged and purposeful when we begin to use the Human Potential Assessment Tool and system to unlock and harness the organization's untapped potential."
  ),

  h(2, "Part II – An emerging need"),
  h(3, "1. Our management tools are reaching the limits of their value creation"),
  p(
    "Since the turn of the 20th century, the emphasis in most management methods has historically been on analysis — dividing complicated and complex systems into manageable bites and gluing them back together to produce the best-performing system, often ignoring the interactive effects of the system's parts."
  ),
  p(
    "Given the rapid rise of science, mathematics, and technology that relied mainly on an objective-driven or analytical approach, this has worked well in the past. Without realizing it, the human side of people's potential is often ignored or left out until later in such objective analysis."
  ),
  p(
    "But times are changing. Today's world has moved rapidly from a complicated world order (with many known unknowns) to an increasingly complex world order (with unknown knowns), and we are even approaching a chaotic one (with unknown unknowns). We have reached a point where our current analytical-technology-driven approaches are reaching their limits in creating value in the organization."
  ),
  h(3, "2. We need a more diverse way of thinking"),
  p(
    "There are too many variables to consider in the increasingly complex and ever-changing world that we live and work in today. We cannot rely primarily on analytical-objective-technological tools and methodology to understand the truths and reality of the challenges confronting us."
  ),
  p(
    "The time has come to open up to more integral ways of knowing and build a higher-level evolutionary map of reality to access the next frontier in value creation. We need new thinking and integral tools that will help us ask questions that are not asked, eventually leading us to new solutions that we were blind to."
  ),
  img(
    "figure-02-complexity.jpg",
    "Figure 2 — The realities of our increasingly complex organizational world"
  ),
  h(3, "3. Integral maps help us to access new questions we should be asking"),
  p(
    "By asking new questions that were not asked before, we can get a high-elevation view and a deeper understanding of the reality we live and work in. To access new questions, we must expand our level of consciousness and new ways of knowing in both our outer (external) and inner (interior) worlds — individually and collectively."
  ),
  p(
    "This is the Integral Map (Integral Four Quadrants Theory) developed by Ken Wilber — a comprehensive map that is genuinely inclusive of the basic dimensions, levels, and lines that are the major potentials of all humans. Quadrants refer to four major perspectives through which any phenomenon can be looked at."
  ),
  p(
    "Referring to Figure 3 below, we can see why our current management paradigm, which relies on analytical systems and tools (lower-right quadrant), gives an incomplete map of the whole territory of organizational change. When we pay more attention to mindsets and inner being (upper left), behavior (upper right), and culture (lower left), new questions emerge that provide a more complete picture."
  ),
  img(
    "figure-03-integral.jpg",
    "Figure 3 — Integral Theory four-quadrant framework (Ken Wilber)"
  ),
  h(3, "4. There is a gap to be filled"),
  h(3, "i. Management tools – systems biased"),
  p(
    "Let us look at the spread of the change management tools and developmental programs used in organizations. Many tools are in the Systems quadrant (lower right), where the biases are, as illustrated in Figure 4 below."
  ),
  img(
    "figure-04-od-tools.jpg",
    "Figure 4 — Spread of management organizational development tools"
  ),
  h(3, "ii. Organization development spending – system biased"),
  p(
    "In terms of organizational development spending, based on the spread of management tools, it is a safe assumption to infer that most of our corporate development budget is given to systems and tools development. Figure 5 below suggests that the least spending is on the Mindset and Inner Being quadrant (upper left)."
  ),
  img(
    "figure-05-spending.jpg",
    "Figure 5 — Organization development spending by quadrant"
  ),
  h(3, "iii. Mindset and Inner Being – the neglected perspective"),
  p(
    "Mindset and Inner Being is most likely the area where the least organizational development money is spent. It is also one of the most troublesome, complex, and invisible developmental areas for corporate leaders to deal with. Only a few practical and implementation-ready tools are available, and many organizations shy away from Mindset and Inner Being development."
  ),
  h(3, "iv. Supporting the case for more investment in Mindset and Inner Being"),
  p(
    "In an article by McKinsey & Company titled \"Why leadership-development programs fail,\" it is stated that over $14 billion annually is spent on leadership development. Yet only 7 percent of senior managers polled by a UK business school think that their companies develop global leaders effectively."
  ),
  p(
    "One of the four tips to overcome common mistakes is \"Underestimating Mindsets\" — identifying some of the deepest thoughts, feelings, assumptions, and beliefs is usually a precondition of behavioral change, yet is too often shirked in development programs."
  ),
  p(
    "We can also take the case of CSR. The Cone 2015 Global CSR Study shows that companies have many opportunities to become more genuine in their CSR efforts. However, the study hardly ever addresses the individual mindset and inner being perspective — yet this could be the missing link. It is the inner transformation and awakening that needs to occur in organizations before their products and services can genuinely start meeting the needs of the conscious consumer."
  ),

  h(2, "Part III – Filling the void"),
  h(3, "1. Mindset and Inner Being"),
  p(
    "We contend that companies' failures or their struggle to create sustainable value and growth are usually not due to a lack of technical knowledge and systems, but due to insufficient attention and investment in programs to raise mindsets (consciousness) and release the immense potentialities of people."
  ),
  p(
    "The gap to be filled is finding new pragmatic applications and tools directed to develop the inner dimensions of the person in Mindset and Inner Being. By integrating the particular person's inner self and being into our current organizational learning map and practices, we can expect to reach a higher level of consciousness and ways of knowing."
  ),
  p(
    "Deep down, we intuitively know that unleashing the immense human potential in the organization will increase our sense of fulfillment, wholeness, and peak experience and performance — then we can expect a significant breakthrough in organizational performance and outcomes."
  ),
  img(
    "quote-change-yourself.jpg",
    "When looking at improving a situation, ask how you can change yourself first"
  ),
  p(
    "For example, in an article by Frederic Laloux in Strategy + Business Magazine (6 July 2015), he states that Teal organizations invite people to reclaim their inner wholeness. They create an environment wherein people feel free to fully express themselves, bringing unprecedented levels of energy, passion, and creativity to work."
  ),
  p(
    "Teal organizations start from the premise, resonant with many wisdom traditions, that a person's deepest calling is to achieve wholeness. These organizations engender vibrant workspaces and practices where trust flourishes and people feel they can truly be themselves. We believe that realizing human potential — generating wholeness in us — will close the gap in mindset and inner being development."
  ),
  h(3, "2. Leading evolutionary change through Human Potential realization"),
  p(
    "Real and evolutionary change begins with each of us at the inner core and ground of our being. The core of the inner-self work is at the ontological, existential, and evolutionary level of being and actualizing our full human potential."
  ),
  p(
    "If we want to significantly increase our interventions' impact, we must also demand a transformation of being in the interveners themselves. In other words, we need to bend the beam of observation inwards to see ourselves."
  ),
  p(
    "Human Potential realization can be the lever to lift all areas of our being — mindset and behavior, shared values in culture, and new inner perspectives injected into how we work with our systems, as illustrated in Figure 6 below."
  ),
  img("quote-einstein.jpg", "Einstein — consciousness and problem solving"),
  img("quote-obrian.jpg", "Bill O'Brian — interior condition of the intervener"),
  img(
    "figure-06-hp-quadrants.jpg",
    "Figure 6 — Leading organizational-wide change through Human Potential realization"
  ),
  h(3, "3. Good news – we have a new integral tool to realize Human Potential"),
  p(
    "The good news is that we now have a new tool that we can use to assess, discover, and harness our unrealized human potential. So far, no concerted effort has been put into developing a holistic model to measure and consistently enable this kind of human potential realization — until now, with the creation of the Human Potential Assessment Tool."
  ),
  p(
    "We can now narrow and close the gap between knowing about it and knowing how to apply it, and have the tools to do it too, as captured in Figure 7 below."
  ),
  img(
    "figure-07-hp-tool.jpg",
    "Figure 7 — The Human Potential Assessment Tool and processes"
  ),
  h(3, "4. What is the Human Potential Assessment Tool?"),
  p(
    "The Human Potential Assessment Tool measures the extent to which one's potential is realized based on a newly created model and framework. It puts Human Potential Realization data on the visible and tangible table, opening a safe conversational and developmental pathway to discover and harness untapped human potential."
  ),
  p(
    "Maximizing Human Potential directly depends on triggering four States: Being Inspired, Being Abundant, Being in Service, and Being Aware. Within each State are several Dimensions that pinpoint the areas with the greatest impact on life and work."
  ),
  p(
    "When one has completed the Human Potential Assessment Tool online, we show all the resulting dimension scores in a color-coded House Framework, as shown in Figure 8 below."
  ),
  img(
    "figure-08-hp-house.jpg",
    "Figure 8 — Human Potential Meter and HP House (States and Dimensions)"
  ),
  p(
    "The Human Potential Assessment Tool is more than measure and metrics. The underlying essence is actualizing one's human potential — putting wisdom gained into practice to create goodness for oneself and others. This is often reflected in walking the talk."
  ),
  p(
    "In existential language, actualizing one's potential means being at your fullest potential in the first person — as an active player in being and doing in the field — and not as an observer or a knower of the phenomenon."
  ),
  img(
    "figure-09-awareness.jpg",
    "Figure 9 — Integrating the energy of actual and stated awareness"
  ),
  p(
    "When we unlock people's inner potential, we also help open corporate potential. Companies are at their creative best when employees have a high state of actualized human potential."
  ),
  p(
    "We firmly believe that people's inner human dimension, in terms of their human potential, will become the real point of difference, with the most significant impact on creating continuous organizational value and growth."
  ),

  h(2, "Part IV – The Human Potential Assessment Framework and Methodology"),
  h(3, "1. The Human Potential Assessment: What gets measured gets done"),
  p(
    "The critical difference between the Human Potential Tool and other assessment tools is the depth of insight. Most organizational surveys conclude that having a meaningful or fulfilling job is the primary driver of business success — true, but these statements do not make it easy to identify clear, tangible, and actionable next steps."
  ),
  p(
    "The Human Potential Assessment Tool comprises 85 insightful questions and dimensions that get to the deeper layers of human potential awareness, inspiring and leading to commitment and action. It opens the door to breakthrough generative conversations, ideas, and affirmative activities."
  ),
  p(
    "Four States and 23 Dimensions are the foundation of what drives us as human beings. Unlike personality attributes, these dimensions are common to all of us. They explore the organization's deeper human dynamics — the more they are expressed, the more fulfilling the work experience becomes."
  ),
  h(3, "2. How does Human Potential relate to my core business drivers?"),
  p(
    "The organizational Human Potential Assessment Toolkit translates assessment data into six tangible Organizational Performance Metrics (OPMs) — drivers of market success represented in the spider diagram below (Figure 10)."
  ),
  img(
    "figure-10-opm.jpg",
    "Figure 10 — The Six Organizational Performance Metrics (OPMs)"
  ),
  p(
    "These six OPMs represent the bridge between Human Potential Realization and market success. Creating the conditions for Human Potential to thrive inevitably translates into increased productivity, loyalty, trust, innovation, and bottom-line results."
  ),
  p(
    "Sustained high performance can only happen when the grooves of old mindsets and habits are replaced with new tracks of attitude, behavior, and habits. The toolkit identifies eight measurable Being Attitudes that drive peak experience and performance, as shown in Figure 11 below."
  ),
  img(
    "figure-11-correlations.jpg",
    "Figure 11 — Correlations between OPMs, four States, and eight Being Attitudes"
  ),
  bq(
    "To thrive in this wilderness and come to love it, you'll need new muscles and new ways of making sense of the world around you, new practices that will augment your current approach. — Jennifer Garvey Berger and Keith Johnston"
  ),
  h(3, "3. The Human Potential Methodology for organizational change"),
  p(
    "The assessment is merely the beginning of an organization's journey toward Human Potential. Figure 12 illustrates our unique methodology for driving change within the organizational context."
  ),
  img(
    "figure-12-methodology.jpg",
    "Figure 12 — The 7-Steps Human Potential Methodology"
  ),
  ul([
    "Enquire — Sensing into dilemmas and critical business questions, then Assessing what the data reveals along the four states and 23 dimensions.",
    "Discovery — Processing and transforming insights through Subtracting (understanding disconnects), Passaging (releasing control of normal solution processes), and Arriving (seeing opportunities in uncertainties).",
    "Harness — Visualizing new intentions, Re-scripting implementation plans, rolling out targeted training and coaching, and Re-sculpturing management objectives and tools.",
  ]),
  h(3, "4. Deep listening and thinking to find the unique story of each organization"),
  p(
    "The seven-step Human Potential methodology deliberately refrains from offering fully articulated conclusions and recommendations. Time and again, the most profound discoveries and lasting commitments emerge when the client creates their own story in the data."
  ),

  h(2, "Conclusion"),
  p(
    "As evidenced by all-time low employee engagement scores, employees today strongly desire to work for organizations that define themselves beyond simply maximizing profits and creating shareholder value. To effectively respond, management must make the growth needs of the employee a strategic imperative."
  ),
  p(
    "A new wave of creativity and value creation will be unleashed by enabling each person to fulfill and actualize their unique Human Potential to serve a greater organizational purpose. However, substantial changes in how we think about OD work will need to occur to get there."
  ),
  p(
    "Too much reliance on systems-based OD intervention has limited our ability to reclaim the health and wholeness of our individual and collective human potential. To be a fully healthy organization, we now have a vast opportunity to chart new territory from the Mindset and Inner Being perspective — the white space waiting to emerge."
  ),
  p(
    "With the Human Potential Toolkit, we now have a business- and management-friendly way of tapping into that white space of Human Potential realization. To learn more or experience the Human Potential Assessment individually, visit beingatfullpotential.com."
  ),
  img("quote-alan-watts.jpg", "Alan Watts — new beginnings"),
];

async function installImages() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = path.join(OUT_DIR, ".import-tmp");
  fs.mkdirSync(tmpDir, { recursive: true });

  for (const [srcSuffix, destName] of IMAGE_MAP) {
    const src = ASSETS + srcSuffix;
    if (!fs.existsSync(src)) {
      console.error("Missing asset:", src);
      process.exit(1);
    }
    const tmp = path.join(tmpDir, srcSuffix);
    fs.copyFileSync(src, tmp);
    const dest = path.join(OUT_DIR, destName);
    await sharp(tmp).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
    console.log("  ", destName);
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
  // Hero thumbnail: use branded asset when available
  const assetHero = path.join(
    process.env.CURSOR_PROJECT_ASSETS ??
      "C:/Users/Mark Vandeneijnde/.cursor/projects/c-Users-Mark-Vandeneijnde-macaly-bfp-website-redesign-u4llbv/assets",
    "leading-evolutionary-change-human-potential.jpg"
  );
  const heroDest = path.join(ROOT, "public/images/articles/leading-evolutionary-change-human-potential.jpg");
  if (fs.existsSync(assetHero)) {
    fs.copyFileSync(assetHero, heroDest);
  } else {
    await sharp(path.join(OUT_DIR, "page-02.jpg"))
      .resize(1200, 675, { fit: "cover", position: "top" })
      .jpeg({ quality: 90 })
      .toFile(heroDest);
  }
}

async function main() {
  console.log("Installing images...");
  await installImages();

  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, "utf8"));
  content[SLUG] = {
    slug: SLUG,
    title: "Leading Evolutionary Change in Organizations through Human Potential Realization",
    date: "2025-03-01",
    author: "Peter Leong, with Mark Vandeneijnde and Sujith Ravindran",
    image: "/images/articles/leading-evolutionary-change-human-potential.jpg",
    sourceUrl: "https://beingatfullpotential.com/",
    type: "article",
    blocks,
  };

  fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);
  console.log(`\nUpdated ${SLUG} with ${blocks.length} blocks`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
