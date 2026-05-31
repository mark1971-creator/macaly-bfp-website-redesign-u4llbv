import type { Metadata } from "next";
import { notFound } from "next/navigation";
import articleContent from "@/lib/article-content.json";
import ArticleDetailContent from "@/components/article-detail-content";
import type { ArticleData } from "@/components/article-detail-content";

type ContentMap = Record<string, ArticleData>;
const content = articleContent as ContentMap;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = content[slug];
  if (!article) return { title: "Case Study | BEING at Full Potential" };

  const description =
    (article.blocks.find((b) => b.type === "paragraph") as { type: "paragraph"; text: string } | undefined)?.text?.slice(0, 160) ||
    `Read the ${article.title} case study on BEING at Full Potential.`;

  return {
    title: `${article.title} | Case Study | BEING at Full Potential`,
    description,
    openGraph: {
      title: `${article.title} | Case Study`,
      description,
      images: article.image ? [{ url: article.image }] : [],
    },
  };
}

export async function generateStaticParams() {
  return Object.entries(content)
    .filter(([, v]) => v.type === "case-study")
    .map(([slug]) => ({ slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const article = content[slug];

  if (!article || article.type !== "case-study") {
    notFound();
  }

  return (
    <ArticleDetailContent
      article={article}
      backHref="/impact"
      backLabel="Impact"
    />
  );
}
