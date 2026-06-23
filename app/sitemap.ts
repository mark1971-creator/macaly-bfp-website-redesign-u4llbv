import type { MetadataRoute } from "next";
import articleContent from "@/lib/article-content.json";

const BASE = "https://beingatfullpotential.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/impact`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/team`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/organizations`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/teams`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/individuals`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/education`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/assessments`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/insight`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/thoughtleadership`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/academy`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE}/academy/apply`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE}/academy/idg-certification`, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const articles = Object.entries(articleContent as Record<string, { type: string; date?: string }>)
    .filter(([, entry]) => entry.type === "article")
    .map(([slug, entry]) => ({
      url: `${BASE}/thoughtleadership/${slug}`,
      lastModified: entry.date || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const caseStudies = Object.entries(articleContent as Record<string, { type: string; date?: string }>)
    .filter(([, entry]) => entry.type === "case-study")
    .map(([slug, entry]) => ({
      url: `${BASE}/case-studies/${slug}`,
      lastModified: entry.date || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticPages, ...articles, ...caseStudies];
}
