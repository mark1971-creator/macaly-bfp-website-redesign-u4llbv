import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beingatfullpotential.com";
const DEFAULT_OG = "/brand/og-measure-what-matters.png";

type ArticleLike = {
  title: string;
  date?: string;
  author?: string;
  image?: string;
  blocks: Array<{ type: string; text?: string }>;
};

function firstParagraph(article: ArticleLike): string {
  const block = article.blocks.find((b) => b.type === "paragraph" && b.text?.trim());
  return block?.text?.trim() ?? "";
}

function absoluteImageUrl(image?: string): string {
  if (!image || image.includes("article-fallback")) {
    return `${SITE_URL}${DEFAULT_OG}`;
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
}

function ogImageUrl(image?: string): string {
  if (!image || image.includes("article-fallback")) {
    return `${SITE_URL}${DEFAULT_OG}`;
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const ogPath = image.replace("/images/articles/", "/images/og/");
  return `${SITE_URL}${ogPath.startsWith("/") ? ogPath : `/${ogPath}`}`;
}

export function buildArticleMetadata(
  article: ArticleLike,
  path: string,
  options?: { kind?: "article" | "case-study" }
): Metadata {
  const kind = options?.kind ?? "article";
  const description =
    firstParagraph(article).slice(0, 160) ||
    (kind === "case-study"
      ? `Read the ${article.title} case study on BEING at Full Potential.`
      : `Read "${article.title}" on BEING at Full Potential.`);

  const pageUrl = `${SITE_URL}${path}`;
  const imageUrl = ogImageUrl(article.image);
  const titleSuffix =
    kind === "case-study" ? "Case Study | BEING at Full Potential" : "BEING at Full Potential";

  return {
    title: `${article.title} | ${titleSuffix}`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: article.title,
      description,
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
      siteName: "BEING at Full Potential",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [imageUrl],
    },
  };
}
