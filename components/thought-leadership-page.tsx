"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-navy text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="hsl(38,55%,50%)" strokeWidth="1.5" />
        <path d="M10 6v4M10 13v1" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-body text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────────
function Nav({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "ABOUT", href: "/about", implemented: true },
    { label: "INSIGHT", href: "/insight", implemented: true },
    { label: "IMPACT", href: "/impact", implemented: true },
    { label: "ACADEMY", href: "/academy", implemented: true },
    { label: "ASSESSMENTS", href: "/assessments", implemented: true },
    { label: "CONTACT", href: "/#contact", implemented: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            if (!link.implemented) {
              return (
                <button key={link.label}
                  onClick={() => onNotImplemented("This page is coming soon — we're building it now!")}
                  className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors">
                  {link.label}
                </button>
              );
            }
            return (
              <Link key={link.label} href={link.href}
                className={`font-body text-xs tracking-[0.15em] transition-colors ${
                  link.href === "/insight" ? "text-gold-light" : "text-white/70 hover:text-white"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all">
          TAKE ASSESSMENT
        </a>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white p-2" aria-label="Toggle menu">
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => {
            if (!link.implemented) return (
              <button key={link.label} onClick={() => { setMobileOpen(false); onNotImplemented("This page is coming soon!"); }}
                className="font-body text-sm tracking-[0.12em] text-white/70 text-left">{link.label}</button>
            );
            return (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="font-body text-sm tracking-[0.12em] text-white">{link.label}</Link>
            );
          })}
          <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
            className="font-body text-sm tracking-[0.12em] border border-gold text-gold px-4 py-2.5 text-center mt-2">
            TAKE ASSESSMENT
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Article data ───────────────────────────────────────────────────────────────
const allArticles = [
  // 2026
  {
    slug: "humanitys-inner-development",
    title: "Humanity's Inner Development: What the 2026 IDG Meta-Analysis Reveals",
    date: "April 9, 2026",
    year: 2026,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2026/04/Heading-400x250.png",
    href: "/thoughtleadership/humanitys-inner-development",
    excerpt: "Key findings from an Inner Development Goals meta-analysis conducted in March 2026, aggregating self-assessments from approximately 3,200 individuals across five continents.",
  },
  {
    slug: "inner-development-goals-to-measure-or-not-2026",
    title: "Inner Development Goals: To Measure or Not to Measure?",
    date: "April 9, 2026",
    year: 2026,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2026/04/Heading-2-400x250.png",
    href: "/thoughtleadership/inner-development-goals-to-measure-or-not-2026",
    excerpt: "A persistent paradox lies at the heart of IDG adoption: how do you measure deeper human qualities like compassion, self-awareness, and courage without diminishing their essence?",
  },
  // 2025
  {
    slug: "action-logics-across-generations",
    title: "Exploring Action Logics Across Generations – Insights from the IDG Assessment Data",
    date: "November 12, 2025",
    year: 2025,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2025/11/action-logics-by-geneation-400x250.png",
    href: "/thoughtleadership/action-logics-across-generations",
    excerpt: "The IDG assessment now integrates Action Logics, a developmental framework inspired by Bill Torbert — revealing how your inner operating system shapes your worldview across generations.",
  },
  {
    slug: "idg-b-corp-synergy",
    title: "The Natural Synergy Between Inner Development Goals (IDGs) and the B Corp Movement",
    date: "November 9, 2025",
    year: 2025,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2025/11/1757326458073-400x250.png",
    href: "/thoughtleadership/idg-b-corp-synergy",
    excerpt: "The IDGs — 23 science-based skills across five dimensions — serve as powerful enablers for the B Corp movement, connecting inner development with business-for-good credentials.",
  },
  {
    slug: "redefining-validation",
    title: "Redefining Validation: From Psychometrics to Soul Recognition",
    date: "September 4, 2025",
    year: 2025,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2025/09/1746102597443-400x250.jpg",
    href: "/thoughtleadership/redefining-validation",
    excerpt: "Ten years after launching the Human Potential Assessment, a deeper question arises: can inner development ever be fully captured by psychometric tools, or does it require a different kind of recognition?",
  },
  {
    slug: "8-characteristics-soulful-organization",
    title: "8 Characteristics of a Soulful Organization",
    date: "September 4, 2025",
    year: 2025,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2025/09/The-Inner-Work-of-Outer-Impact-1-400x250.png",
    href: "/thoughtleadership/8-characteristics-soulful-organization",
    excerpt: "Key takeaways from a Back to Source Coaching webinar on how personal and collective transformation fuels systemic change — and what makes an organization truly soulful.",
  },
  // 2024
  {
    slug: "berlin-marathon",
    title: "Being at Full Potential: Renewing a Father–Son Relationship at the Berlin Marathon",
    date: "October 18, 2024",
    year: 2024,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2024/10/12236_20240929_092724_409364385_socialmedia-400x250.jpg",
    href: "/thoughtleadership/berlin-marathon",
    excerpt: "As the founder of Being at Full Potential, part of the job description is to keep stretching in new ways. An unexpected journey to the Berlin Marathon became a profound story of renewal.",
  },
  {
    slug: "measure-inner-development-goals",
    title: "Inner Development Goals: To Measure or Not to Measure?",
    date: "April 8, 2024",
    year: 2024,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2024/04/LinkedIn-article-image-400x250.png",
    href: "/thoughtleadership/measure-inner-development-goals",
    excerpt: "In our quest to drive adoption of Inner Development Goals in organizations, a paradox remains: IDGs exist to focus attention on deeper human qualities that resist conventional measurement.",
  },
  // 2023
  {
    slug: "gap-in-employee-well-being",
    title: "5 Ways to Explain the Gap in Employee Well-Being",
    date: "December 6, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/12/DIs-Workplace-Well-Being-Improving-or-Declining-Making-Sense-of-the-Conflicting-Data-400x250.png",
    href: "/thoughtleadership/gap-in-employee-well-being",
    excerpt: "A Deloitte survey reveals a puzzling gap: employees feel a standstill or decline in well-being, while executives believe they've improved. Five frameworks to make sense of the contradiction.",
  },
  {
    slug: "retrospective-conversations-that-matter",
    title: "Retrospective – Conversations that Matter",
    date: "November 17, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/11/UR_AH24-400x250.jpg",
    href: "/thoughtleadership/retrospective-conversations-that-matter",
    excerpt: "One year after launching 'Conversations That Matter', a reflection on what emerged when we created open space every two weeks to explore the Human Potential House framework.",
  },
  {
    slug: "evidence-based-strategies",
    title: "Evidence-Based Strategies for Maximizing Human Potential",
    date: "November 2, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/11/GEN-Laker-Mental-Health-1290x860-1-400x250.jpg",
    href: "/thoughtleadership/evidence-based-strategies",
    excerpt: "Choosing the path of Human Potential Realization requires deep trust in people's resourcefulness. Here is the scientific evidence that fulfillment at work drives long-term organizational success.",
  },
  {
    slug: "being-human-at-work",
    title: "Being Human at Work: Harnessing the Power of Emotions to Drive Employee Engagement",
    date: "September 7, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/09/EQ-400x250.jpg",
    href: "/thoughtleadership/being-human-at-work",
    excerpt: "What role do emotions play in driving engagement? Understanding the power of the emotional dimension at work is key to creating organizations where people bring their full selves.",
  },
  {
    slug: "roi-of-boosting-employee-engagement",
    title: "The ROI of Boosting Employee Engagement",
    date: "August 30, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/08/Screenshot-2023-09-08-092317-400x250.png",
    href: "/thoughtleadership/roi-of-boosting-employee-engagement",
    excerpt: "The business case for engagement has never been clearer — yet most organizations still struggle to close the gap. A deep look at what the data actually shows about engagement and performance.",
  },
  {
    slug: "countering-the-threat-of-ai",
    title: "Countering the Threat of AI: Being Fully HUMAN is the Next Competitive Advantage",
    date: "August 25, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/08/q41ieu3p-400x250.png",
    href: "/thoughtleadership/countering-the-threat-of-ai",
    excerpt: "As AI rapidly enters every domain of work and life, the uniquely human qualities of presence, empathy, and creativity emerge as the next frontier of competitive advantage.",
  },
  {
    slug: "improving-employee-experience",
    title: "Improving Employee Experience through Workplace Actualization",
    date: "June 14, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/06/Maslow-Leadership-Diagram-Needs-at-Work-v5-1024x663-1-400x250.jpg",
    href: "/thoughtleadership/improving-employee-experience",
    excerpt: "HR leaders increasingly recognize Employee Experience as the key to breakthroughs — yet most programs miss the deeper root cause. Workplace Actualization offers a new paradigm.",
  },
  {
    slug: "learning-to-listen",
    title: "Learning to Listen in the Age of Decentralized Governance",
    date: "May 16, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/05/IMG_5340-400x250.jpeg",
    href: "/thoughtleadership/learning-to-listen",
    excerpt: "As banks collapse, governments lose trust, and AI enters our lives, the art of deep listening may be the most essential leadership capacity for navigating a decentralized world.",
  },
  {
    slug: "decentralization-blockchain-human-potential",
    title: "Decentralization, Blockchain & Human Potential Realization",
    date: "February 22, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/02/Cardano-logo-400x250.png",
    href: "/thoughtleadership/decentralization-blockchain-human-potential",
    excerpt: "Cardano founder Charles Hoskinson's inner work and the rise of decentralized systems point to a deeper truth: outer transformation requires inner transformation first.",
  },
  {
    slug: "6-organizational-performance-metrics",
    title: "6 Organizational Performance Metrics Brought to Life",
    date: "January 24, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/01/Iceberg-OPM-400x250.jpg",
    href: "/thoughtleadership/6-organizational-performance-metrics",
    excerpt: "Most business leaders focus on visible performance metrics. But when is the last time you paused to consider the deeper human qualities — the underwater part of the iceberg — shaping them?",
  },
  {
    slug: "human-potential-model-validation",
    title: "Is Our Approach to Human Potential Development Scientifically Validated?",
    date: "January 23, 2023",
    year: 2023,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2023/01/1668418869806-400x250.png",
    href: "/thoughtleadership/human-potential-model-validation",
    excerpt: "As inner development gains recognition as a prerequisite for outer change, our work becomes more relevant — and more scrutinized. Here is the scientific evidence behind our methodology.",
  },
  // 2022
  {
    slug: "leadership-methods-future-proof",
    title: "2 Compelling Leadership Methods to Future Proof Your Company",
    date: "October 16, 2022",
    year: 2022,
    author: "Jasmine Hum",
    image: "https://beingatfullpotential.com/wp-content/uploads/2022/10/Futureproof-your-business-scaled-1-400x250.jpg",
    href: "/thoughtleadership/leadership-methods-future-proof",
    excerpt: "In an unpredictable world, many organizations are too bureaucratic and too slow. Two leadership methods that enable agility and protect against disruption in a volatile landscape.",
  },
  {
    slug: "23-ways-to-express-human-potential",
    title: "23 Ways to Express Your Human Potential",
    date: "February 25, 2022",
    year: 2022,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2020/11/WHAT-WE-DO-2-400x250.jpg",
    href: "/thoughtleadership/23-ways-to-express-human-potential",
    excerpt: "Little stories that highlight the human qualities deeply valued in the people we work with — each representing one 'brick' of the Human Potential House, now brought together as a complete framework.",
  },
  // 2021
  {
    slug: "reflections-on-2021",
    title: "Reflections on 2021",
    date: "December 16, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/12/frankfurt-trainstation-small-400x250.jpg",
    href: "/thoughtleadership/reflections-on-2021",
    excerpt: "Beginning the year with the card 'Holding space in the eye of the storm', 2021 became a year of pausing, listening, and laying foundations for new possibilities on the horizon.",
  },
  {
    slug: "embedding-culture-in-ma",
    title: "3 Steps to Embedding the Cultural Dimension in the M&A Due Diligence Process",
    date: "September 22, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/09/dilbert-400x250.gif",
    href: "/thoughtleadership/embedding-culture-in-ma",
    excerpt: "M&A due diligence focuses heavily on financial and legal aspects — yet culture is the key success factor. Three practical steps to embed the cultural dimension from the start.",
  },
  {
    slug: "organizational-change-management",
    title: "Organizational Change Management: A Definitive Guide",
    date: "August 19, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/08/Organizational-Change-Management-A-definitive-guide-1.jpg",
    href: "/thoughtleadership/organizational-change-management",
    excerpt: "A comprehensive guide to how organizations modify their structures, management approaches, and cultural dynamics — and why most change initiatives still fall short.",
  },
  {
    slug: "4-types-of-organizational-change",
    title: "4 Types of Organizational Change",
    date: "August 18, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/08/4-Types-of-Organizational-Change-1.jpg",
    href: "/thoughtleadership/4-types-of-organizational-change",
    excerpt: "Organizational change can be a tough nut to crack. Approaches differ by business, but the fundamentals remain universal. A clear breakdown of the four types and how they apply.",
  },
  {
    slug: "diversity-equity-inclusion",
    title: "5 Stages of Diversity Equity and Inclusion (DEI) Consciousness",
    date: "July 1, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/07/13434971_1218979194781857_7303990100667854031_n-400x250.jpg",
    href: "/thoughtleadership/diversity-equity-inclusion",
    excerpt: "A unifying approach to DEI that goes beyond compliance and diversity programs — exploring the five stages of consciousness that determine how leaders and organizations engage with inclusion.",
  },
  {
    slug: "disruptive-innovation",
    title: "3 Impactful Ways to Develop Human Potential for Disruptive Innovation",
    date: "May 5, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/04/its-not-what-you-look-at-that-matters-its-what-you-see-400x250.jpg",
    href: "/thoughtleadership/disruptive-innovation",
    excerpt: "A genuine insight into the customer is the key to disruptive innovation. Three ways inner development unlocks the creative perception that fuels breakthrough ideas.",
  },
  {
    slug: "world-is-vuca",
    title: "The World is VUCA – Do We Compete With It or Collaborate With It?",
    date: "February 25, 2021",
    year: 2021,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/02/13466080_1218979364781840_2029804817535700_n-400x250.jpg",
    href: "/thoughtleadership/world-is-vuca",
    excerpt: "A conversation with former colleagues sparked a reflection on how we respond to volatility, uncertainty, complexity and ambiguity — as individuals and as organizations.",
  },
  // 2020
  {
    slug: "transformational-leaders-2020",
    title: "Transformational Leaders in Transformational Times – A Harvest of Deeper Insights",
    date: "December 21, 2020",
    year: 2020,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2020/12/14-e1614243403414-400x250.jpg",
    href: "/thoughtleadership/transformational-leaders-2020",
    excerpt: "2020 was a year of pausing, letting go, reflecting, and recommitting. The webinar series organized at year end laid the foundations for the tremendous opportunities now emerging.",
  },
  {
    slug: "omega-hms-restructuring-article",
    title: "Human Potential Based Restructuring at Omega HMS",
    date: "November 13, 2020",
    year: 2020,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/09/10626797_1218979294781847_4220713866197897045_n-400x250.jpg",
    href: "/thoughtleadership/omega-hms-restructuring-article",
    excerpt: "How Omega Healthcare Management Services, a global leader in healthcare outsourcing, used Human Potential principles to restructure around their number-one value: customer service.",
  },
  {
    slug: "to-re-enter-workforce",
    title: "To Re-Enter, or Not to Re-Enter, the Workforce?",
    date: "October 27, 2020",
    year: 2020,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2020/10/where-want-to-be-400x250.jpg",
    href: "/thoughtleadership/to-re-enter-workforce",
    excerpt: "For the first time in 10 years, scanning LinkedIn's job listings raises a question every founder eventually faces: what does re-entering the workforce actually mean for your potential?",
  },
  {
    slug: "business-case-for-being",
    title: "The Business Case for BEING",
    date: "September 22, 2020",
    year: 2020,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2020/09/97767155_2283058755331891_2885586817338310656_n-2-400x250.jpg",
    href: "/thoughtleadership/business-case-for-being",
    excerpt: "How does investing in the BEING dimension impact organizational performance? A candid exploration of the evidence and frameworks available to answer this crucial question.",
  },
  {
    slug: "impact-at-individual-level-marta",
    title: "Impact at Individual Level – An Inspiring Story by Marta Seweryn",
    date: "February 13, 2020",
    year: 2020,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2020/02/matha-2.jpg",
    href: "/thoughtleadership/impact-at-individual-level-marta",
    excerpt: "A firsthand account from a marketing professional of how professional coaching with a Human Potential approach transformed her relationship with leadership and her own potential.",
  },
  // 2019
  {
    slug: "human-potential-methodology-org-transformation",
    title: "Human Potential Methodology for Organizational Transformation",
    date: "December 12, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/12/IMG-20190514-WA0015-400x250.jpg",
    href: "/thoughtleadership/human-potential-methodology-org-transformation",
    excerpt: "A conversation between Sujith Ravindran, Mark Vandeneijnde and Geoff Swannell on the Human Potential Method — a unique approach to helping organizations achieve their highest potential.",
  },
  {
    slug: "human-potential-400m-opportunity",
    title: "Human Potential Realization: A £400M Opportunity – Aligning What We KNOW with What We DO",
    date: "December 3, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/12/IMG_20191113_165735-400x250.jpg",
    href: "/thoughtleadership/human-potential-400m-opportunity",
    excerpt: "What makes a great organizational culture? Why do so many culture change attempts fail? A framework for bridging the gap between knowing the right thing and actually doing it.",
  },
  {
    slug: "human-potential-realization-starts-at-home-2",
    title: "Human Potential Realization Starts at Home – Part 2",
    date: "December 1, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/12/Sync-a_for-article-400x250.jpg",
    href: "/thoughtleadership/human-potential-realization-starts-at-home-2",
    excerpt: "Whenever we feel stuck, a shift is needed. The second part of a personal exploration of how the inner work of potential realization begins — not in the boardroom, but at home.",
  },
  {
    slug: "human-potential-realization-starts-at-home-1",
    title: "Human Potential Realization Starts at Home – Part 1",
    date: "September 2, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/09/Office-2-400x250.jpg",
    href: "/thoughtleadership/human-potential-realization-starts-at-home-1",
    excerpt: "A daughter's proudly kept bedroom becomes the starting point for a reflection on what it means to truly inhabit one's potential — and why the work begins closest to home.",
  },
  {
    slug: "impact-at-team-level-cto",
    title: "Impact at Team Level – The Day Our CTO Faded Away",
    date: "September 2, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/09/sit-team-400x250.jpg",
    href: "/thoughtleadership/impact-at-team-level-cto",
    excerpt: "A young, brilliant systems engineer in India named Nikhil single-handedly built our entire backend infrastructure — and then, in a pivotal team moment, something remarkable happened.",
  },
  {
    slug: "leadership-development-366-billion",
    title: "Leadership Development Is a $366 Billion Industry: Here's Why Most Programs Don't Work",
    date: "June 24, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/06/13432296_1218979191448524_5653665715935266370_n-400x250.jpg",
    href: "/thoughtleadership/leadership-development-366-billion",
    excerpt: "95% of learning organizations plan to increase or maintain their leadership development investment. So why do so many programs fail to move the needle? The data reveals the gap.",
  },
  {
    slug: "back-to-home-base",
    title: "Back to HOME Base – A Coaching Best Practice by Mirjana Power",
    date: "June 11, 2019",
    year: 2019,
    author: "Mirjana Power",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/06/House_redux_22x-1-400x250.png",
    href: "/thoughtleadership/back-to-home-base",
    excerpt: "The 'house' within the Human Potential Assessment report offers rich possibilities for coach, coachee and coaching relationship — especially when returning to foundational inner work.",
  },
  {
    slug: "evolving-leadership-consciousness",
    title: "Evolving and Elevating Leadership Consciousness",
    date: "June 9, 2019",
    year: 2019,
    author: "Peter Leong",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/06/4.jpg",
    href: "/thoughtleadership/evolving-leadership-consciousness",
    excerpt: "Consciousness and reality are one — and timeless leaders free the confines of their consciousness to perceive possibilities that are invisible to others. A meditation on elevated leadership.",
  },
  {
    slug: "employability-future-of-work",
    title: "Employability and Future of Work – Vision and Solutions for Policy Makers and Leaders",
    date: "June 9, 2019",
    year: 2019,
    author: "Peter Leong",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/06/image001-400x250.png",
    href: "/thoughtleadership/employability-future-of-work",
    excerpt: "The era when a degree alone secured good employment is over. The future of work demands a new framework for employability — one centered on inner development and human potential.",
  },
  {
    slug: "synchronizing-inner-outer-worlds",
    title: "Synchronizing Inner and Outer Worlds Unleashes Potential",
    date: "June 9, 2019",
    year: 2019,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/06/IMG_20190514_101858-400x250.jpg",
    href: "/thoughtleadership/synchronizing-inner-outer-worlds",
    excerpt: "A new experiment with Thornton's Budgens — a vision-led independent supermarket in London — on what happens when inner work and outer organizational change move in sync.",
  },
  {
    slug: "od-work-in-breakdown",
    title: "OD Work is in Breakdown — Human Potential Realization is the Next Breakthrough",
    date: "May 20, 2019",
    year: 2019,
    author: "Sujith Ravindran",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/05/od-in-breakdown-400x229.jpg",
    href: "/thoughtleadership/od-work-in-breakdown",
    excerpt: "Employee engagement is at an all-time low despite record spending on OD. A candid look at why traditional organizational development fails — and what comes next.",
  },
  {
    slug: "accessing-higher-states-of-awareness",
    title: "Accessing Higher States of Awareness: The Next Paradigm of Innovation",
    date: "May 20, 2019",
    year: 2019,
    author: "Sujith Ravindran",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/05/ACCESSING-HIGHER-STATES-OF-AWARENESS-THE-NEXT-PARADIGM-OF-INNOVATION-400x250.png",
    href: "/thoughtleadership/accessing-higher-states-of-awareness",
    excerpt: "Innovation is a top priority for organizations — yet most approaches focus outward. A new model reveals how accessing higher states of awareness unlocks the next paradigm of breakthrough innovation.",
  },
  {
    slug: "conscious-culture-presentation",
    title: "Conscious Culture Presentation",
    date: "February 13, 2019",
    year: 2019,
    author: "Annelieke Verkerk",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1533990917CASE-STUDIES-300x225.jpg",
    href: "/thoughtleadership/conscious-culture-presentation",
    excerpt: "Presentation at the 19th International Conference on Knowledge, Culture, and Change in Organizations — on how everyone has the power to affect the direction of an organization.",
  },
  // 2018
  {
    slug: "ai-artificial-intelligence-awareness",
    title: "AI = Artificial Intelligence or Awareness Intelligence?",
    date: "December 5, 2018",
    year: 2018,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1544013549conscious-AI-300x111.jpg",
    href: "/thoughtleadership/ai-artificial-intelligence-awareness",
    excerpt: "As AI becomes inevitable, the question shifts: what human qualities does it challenge us to develop more fully? A reflection on Awareness Intelligence as the true response to artificial intelligence.",
  },
  {
    slug: "creating-conscious-culture-3",
    title: "Creating Conscious Culture – Part 3",
    date: "August 11, 2018",
    year: 2018,
    author: "Peter Leong",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1533990917CASE-STUDIES-300x225.jpg",
    href: "/thoughtleadership/creating-conscious-culture-3",
    excerpt: "The final part of a series exploring what makes a great organizational culture, why so many attempts fail, and how to approach culture change in a genuinely sustainable way.",
  },
  {
    slug: "creating-conscious-culture-2",
    title: "Creating Conscious Culture – Part 2",
    date: "August 11, 2018",
    year: 2018,
    author: "Peter Leong",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1533990761FOR-ORGANATISATIONS-introduction-300x162.jpg",
    href: "/thoughtleadership/creating-conscious-culture-2",
    excerpt: "Continuing the exploration of organizational culture — how to move beyond surface-level culture programs toward the deep inner work that actually shifts organizational behavior.",
  },
  {
    slug: "creating-conscious-culture-1",
    title: "Creating Conscious Culture – Part 1",
    date: "August 11, 2018",
    year: 2018,
    author: "Peter Leong",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/fullsizeoutput_2258-300x225.jpeg",
    href: "/thoughtleadership/creating-conscious-culture-1",
    excerpt: "Part one of a three-part series: what makes a great organizational culture? How does culture influence performance? And why do so many culture change efforts fall short?",
  },
  {
    slug: "human-potential-realization-igniting-happiness",
    title: "Human Potential Realization: Igniting Employee Happiness AND Unlocking Business Performance",
    date: "March 28, 2018",
    year: 2018,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/06/13432296_1218979191448524_5653665715935266370_n-400x250.jpg",
    href: "/thoughtleadership/human-potential-realization-igniting-happiness",
    excerpt: "A must-read for all employers seeking the next breakthrough in organizational performance — with scientific proof that Human Potential Realization is the key to sustainable success.",
  },
  {
    slug: "shifting-innovation-inside-out",
    title: "Shifting Innovation from OUTSIDE-IN to INSIDE-OUT: A Coaching Perspective",
    date: "February 28, 2018",
    year: 2018,
    author: "Fabio Salvadori",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/thought-leadership-sectors-EDUCATION-300x152.jpg",
    href: "/thoughtleadership/shifting-innovation-inside-out",
    excerpt: "In a world of 7 billion connected human beings, the source of breakthrough innovation has shifted inward. A coaching perspective on making that inside-out shift real.",
  },
  // 2017
  {
    slug: "creating-transformational-spaces",
    title: "Creating Transformational Spaces Within the Business Context – 5 Lessons",
    date: "December 20, 2017",
    year: 2017,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2017/12/FOR-ORGANATISATIONS-introduction-400x250.jpg",
    href: "/thoughtleadership/creating-transformational-spaces",
    excerpt: "The time is ripe to bring greater focus to the deeper human drivers of performance. Five lessons learned from creating genuine transformational spaces within the organizational context.",
  },
  {
    slug: "gift-of-self-compassion",
    title: "The Gift of Self Compassion",
    date: "December 5, 2017",
    year: 2017,
    author: "Mirjana Power",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1544015125Mirjana-300x206.jpg",
    href: "/thoughtleadership/gift-of-self-compassion",
    excerpt: "Self-awareness and self-love matter. Who we are is how we lead. And at the heart of everything: self-compassion — the often overlooked foundation of sustainable high performance.",
  },
  {
    slug: "5-keys-to-google-team",
    title: "5 Keys to a Successful Google Team",
    date: "November 3, 2017",
    year: 2017,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2017/11/Generic-spider-400x250.jpg",
    href: "/thoughtleadership/5-keys-to-google-team",
    excerpt: "Google's research into what makes teams effective uncovered five factors — none of them technical. A reflection on what their findings reveal about human potential at the team level.",
  },
  {
    slug: "daring-greatly-in-the-classroom",
    title: "Daring Greatly in the Classroom",
    date: "October 20, 2017",
    year: 2017,
    author: "Sally Edwards",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/School-300x163.jpg",
    href: "/thoughtleadership/daring-greatly-in-the-classroom",
    excerpt: "What does it mean to say 'I don't know' as a teacher? Challenging the expectation that educators must always have the answer — and what vulnerability makes possible in the classroom.",
  },
  {
    slug: "un-sustainability-of-sustainability-departments",
    title: "The Un-Sustainability of Sustainability Departments",
    date: "August 20, 2017",
    year: 2017,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1503253240unsustainability-300x172.jpg",
    href: "/thoughtleadership/un-sustainability-of-sustainability-departments",
    excerpt: "A reflection on the meaning and purpose of sustainability departments — and a great opportunity to evolve the role of change-agents and game-changers within modern organizations.",
  },
  {
    slug: "lessons-in-thrive-ability",
    title: "Lessons in THRIVE-Ability from the French Countryside",
    date: "August 20, 2017",
    year: 2017,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1472738021countryside-300x208.jpg",
    href: "/thoughtleadership/lessons-in-thrive-ability",
    excerpt: "Why 'sustain' the status quo when it isn't working? A personal reflection from the French countryside on the shift from sustainability to genuine thrive-ability in organizations.",
  },
  {
    slug: "from-sustainability-to-thrive-ability-3",
    title: "From Sustainability to Thrive-Ability – Part 3: HOW to Build a Thrive-Able Organization",
    date: "August 20, 2017",
    year: 2017,
    author: "Mark Vandeneijnde",
    image: "https://beingatfullpotential.com/wp-content/uploads/2019/04/sa_1503252814Values-change-300x225.jpg",
    href: "/thoughtleadership/from-sustainability-to-thrive-ability-3",
    excerpt: "Insights from the Human Potential Summit: 20 visionary change-makers explored sustainability through fresh eyes — and found a roadmap toward building organizations that truly thrive.",
  },
];

const ARTICLES_PER_PAGE = 12;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ThoughtLeadershipPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  const showToast = (msg: string) => setToast(msg);
  const hideToast = () => setToast(null);

  // Derive unique years for filter
  const years = useMemo(() => {
    const unique = Array.from(new Set(allArticles.map((a) => a.year))).sort((a, b) => b - a);
    return unique;
  }, []);

  // Filtered articles
  const filtered = useMemo(() => {
    if (selectedYear === "all") return allArticles;
    return allArticles.filter((a) => a.year === selectedYear);
  }, [selectedYear]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when year filter changes
  const handleYearChange = (year: number | "all") => {
    setSelectedYear(year);
    setVisibleCount(ARTICLES_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast} onClose={hideToast} />}
      <Nav onNotImplemented={showToast} />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[52vh] flex items-end bg-navy overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-navy" />
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        {/* Decorative rings */}
        <div className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.08]">
          <div className="absolute inset-0 rounded-full border border-gold" />
          <div className="absolute inset-[14%] rounded-full border border-gold" />
          <div className="absolute inset-[28%] rounded-full border border-gold" />
          <div className="absolute inset-[42%] rounded-full border border-gold" />
        </div>
        {/* Left decorative line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        {/* Gold accent top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/insight" className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase">
              Insight
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-xs tracking-[0.2em] text-gold/70 uppercase">Thought Leadership</span>
          </div>

          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">Archive</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Thought{" "}
            <span className="text-gold italic">Leadership</span>
          </h1>
          <p className="font-body text-lg text-white/55 max-w-2xl leading-relaxed">
            {allArticles.length} articles spanning a decade of research, reflection and insight on human potential, conscious leadership, and organizational transformation.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ────────────────────────────────────────────────────────── */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <span className="font-body text-xs tracking-[0.15em] text-foreground/40 uppercase shrink-0 mr-2">Filter:</span>
            <button
              onClick={() => handleYearChange("all")}
              className={`font-body text-xs tracking-[0.1em] px-4 py-2 border transition-all shrink-0 ${
                selectedYear === "all"
                  ? "border-navy bg-navy text-white"
                  : "border-border text-foreground/60 hover:border-navy/40 hover:text-navy"
              }`}
            >
              All Years
              <span className="ml-1.5 text-[10px] opacity-60">({allArticles.length})</span>
            </button>
            {years.map((year) => {
              const count = allArticles.filter((a) => a.year === year).length;
              return (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`font-body text-xs tracking-[0.1em] px-4 py-2 border transition-all shrink-0 ${
                    selectedYear === year
                      ? "border-gold bg-gold text-white"
                      : "border-border text-foreground/60 hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {year}
                  <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Result count */}
          <div className="flex items-center justify-between mb-10">
            <p className="font-body text-sm text-foreground/50">
              Showing{" "}
              <span className="text-navy font-medium">{Math.min(visibleCount, filtered.length)}</span>
              {" "}of{" "}
              <span className="text-navy font-medium">{filtered.length}</span>
              {" "}articles
              {selectedYear !== "all" && (
                <span className="text-gold"> · {selectedYear}</span>
              )}
            </p>
            {selectedYear !== "all" && (
              <button
                onClick={() => handleYearChange("all")}
                className="font-body text-xs tracking-[0.1em] text-gold/70 hover:text-gold transition-colors uppercase"
              >
                ← Clear filter
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group bg-white overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col border border-border hover:border-gold/20"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-navy/5 shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="font-body text-[10px] tracking-[0.15em] text-gold/80 uppercase bg-gold/8 px-2 py-0.5">
                      {article.year}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gold/30" />
                    <span className="font-body text-xs text-foreground/40 truncate">{article.author}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-lg font-light text-navy leading-snug mb-3 group-hover:text-gold transition-colors duration-300 flex-1">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="font-body text-sm text-foreground/55 leading-relaxed mb-5 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="font-body text-[11px] text-foreground/35">{article.date}</span>
                    <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-14">
              <button
                onClick={() => setVisibleCount((c) => c + ARTICLES_PER_PAGE)}
                className="font-body text-xs tracking-[0.2em] uppercase border border-navy text-navy px-10 py-4 hover:bg-navy hover:text-white transition-all"
              >
                Load More Articles
                <span className="ml-2 text-[10px] opacity-50">
                  ({filtered.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}

          {/* All loaded state */}
          {!hasMore && filtered.length > ARTICLES_PER_PAGE && (
            <div className="text-center mt-14">
              <div className="inline-flex items-center gap-4">
                <div className="w-12 h-px bg-gold/40" />
                <span className="font-body text-xs tracking-[0.2em] text-foreground/40 uppercase">All articles shown</span>
                <div className="w-12 h-px bg-gold/40" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full border border-white" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-white" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-white" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Go Deeper</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15] mb-6">
            Ready to Put These Ideas<br />
            <span className="text-gold italic">Into Practice?</span>
          </h2>
          <p className="font-body text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Our assessments, coaching programs, and certifications help leaders translate insight into lasting transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://beingatfullpotential.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] bg-gold text-white px-8 py-4 hover:bg-gold/90 transition-colors uppercase"
            >
              Take the Assessment
            </a>
            <Link
              href="/insight"
              className="font-body text-xs tracking-[0.2em] border border-white/30 text-white/70 px-8 py-4 hover:border-gold hover:text-gold transition-all uppercase"
            >
              Back to Insight
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#141210] border-t border-gold/15 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Image
                src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
                alt="BEING at Full Potential"
                width={120}
                height={48}
                className="h-10 w-auto object-contain mb-6"
              />
              <p className="font-body text-sm text-white/40 leading-relaxed">
                Empowering conscious leaders and organizations to realize their full human potential since 2010.
              </p>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-5">Explore</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Insight", href: "/insight" },
                  { label: "Thought Leadership", href: "/thoughtleadership" },
                  { label: "Assessments", href: "https://beingatfullpotential.io/" },
                ].map((link) => (
                  <a key={link.label} href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-5">Contact</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:mark@beingatfullpotential.com"
                  className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">
                  mark@beingatfullpotential.com
                </a>
                <p className="font-body text-sm text-white/30 mt-2">
                  Global HQs on 3 continents
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/25">
              © {new Date().getFullYear()} BEING at Full Potential. All rights reserved.
            </p>
            <a href="https://beingatfullpotential.com" target="_blank" rel="noopener noreferrer"
              className="font-body text-xs text-white/25 hover:text-white/50 transition-colors">
              beingatfullpotential.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
