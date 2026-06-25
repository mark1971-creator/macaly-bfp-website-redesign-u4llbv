import articleContent from "./article-content.json";
import type { ArticleData } from "@/components/article-detail-content";

const content = articleContent as Record<string, ArticleData>;

export function formatArticleDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function getExcerpt(article: ArticleData, maxLen = 220): string {
  for (const block of article.blocks) {
    if (block.type === "paragraph" && block.text.length > 40) {
      const text = stripHtml(block.text).trim();
      return text.length <= maxLen ? text : `${text.slice(0, maxLen).trim()}…`;
    }
  }
  return "";
}

export type ArticleCard = {
  slug: string;
  title: string;
  date: string;
  year: number;
  author: string;
  image: string;
  href: string;
  excerpt: string;
  kind: "article" | "case-study";
  tag?: string;
};

function toCard(a: ArticleData): ArticleCard {
  const isCaseStudy = a.type === "case-study";
  return {
    slug: a.slug,
    title: a.title,
    date: formatArticleDate(a.date),
    year: parseInt(a.date.slice(0, 4), 10),
    author: a.author,
    image: a.image,
    href: isCaseStudy ? `/case-studies/${a.slug}` : `/thoughtleadership/${a.slug}`,
    excerpt: getExcerpt(a),
    kind: a.type,
    tag: isCaseStudy ? "Case Study" : undefined,
  };
}

export function getThoughtLeadershipArticles(): ArticleCard[] {
  return Object.values(content)
    .filter((a) => a.type === "article")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(toCard);
}

/** Articles + case studies for the unified library listing */
export function getLibraryArticles(): ArticleCard[] {
  return Object.values(content)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(toCard);
}

export function getArticleBySlug(slug: string): ArticleData | undefined {
  return content[slug];
}

export function getFeaturedInsightArticle(): ArticleCard | undefined {
  return getThoughtLeadershipArticles()[0];
}

export function getInsightArticleHighlights(limit = 3): ArticleCard[] {
  return getThoughtLeadershipArticles().slice(1, 1 + limit);
}

export type CaseStudyCard = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  summary: string;
  image: string;
  href: string;
};

const CASE_STUDY_META: Record<
  string,
  { client: string; sector: string; summary: string }
> = {
  "omega-hms": {
    client: "Omega Healthcare Management Services",
    sector: "Healthcare · India",
    summary:
      "Omega HMS used the Human Potential Assessment to redesign client-facing teams around empathy, curiosity, and collaboration — matching people to roles where their inherent potential could be fully expressed.",
  },
  "business-case-human-potential-realisation": {
    client: "Thornton's Budgens",
    sector: "Retail · London, UK",
    summary:
      "After sales declined -7% in 2014, owner Andrew Thornton invested in developing human potential throughout the organisation. Coaching unlocked creativity at every level, driving a full business turnaround.",
  },
  "siam-computing": {
    client: "Siam Computing",
    sector: "Technology · Thailand",
    summary:
      "Siam Computing partnered with BEING at Full Potential to strengthen company culture through Inner Development Goals — embedding inner skills into how teams collaborate, lead, and innovate.",
  },
};

export function getCaseStudyCards(): CaseStudyCard[] {
  return Object.values(content)
    .filter((a) => a.type === "case-study")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((a) => {
      const meta = CASE_STUDY_META[a.slug] ?? {
        client: a.title,
        sector: "Case Study",
        summary: getExcerpt(a, 280),
      };
      return {
        slug: a.slug,
        title: a.title,
        client: meta.client,
        sector: meta.sector,
        summary: meta.summary,
        image: a.image,
        href: `/case-studies/${a.slug}`,
      };
    });
}
