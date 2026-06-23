import type { Metadata } from "next";
import { notFound } from "next/navigation";
import articleContent from "@/lib/article-content.json";
import ArticleDetailContent from "@/components/article-detail-content";
import type { ArticleData } from "@/components/article-detail-content";
import { buildArticleMetadata } from "@/lib/article-metadata";

type ContentMap = Record<string, ArticleData>;
const content = articleContent as ContentMap;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = content[slug];
  if (!article) return { title: "Article | BEING at Full Potential" };
  return buildArticleMetadata(article, `/thoughtleadership/${slug}`, { kind: "article" });
}

export async function generateStaticParams() {
  return Object.entries(content)
    .filter(([, v]) => v.type === "article")
    .map(([slug]) => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = content[slug];

  if (!article || article.type !== "article") {
    notFound();
  }

  return (
    <ArticleDetailContent
      article={article}
      backHref="/thoughtleadership"
      backLabel="Thought Leadership"
    />
  );
}
