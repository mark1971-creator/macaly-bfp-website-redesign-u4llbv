import type { Metadata } from "next";
import InsightPage from "@/components/insight-page";

export const metadata: Metadata = {
  title: "Insight | BEING at Full Potential",
  description:
    "Thought leadership articles, videos, books and research from BEING at Full Potential — challenging existing beliefs about success, performance, and human potential.",
  keywords: [
    "human potential",
    "thought leadership",
    "inner development goals",
    "conscious leadership",
    "IDG",
    "employee experience",
    "being entrepreneur",
  ],
  openGraph: {
    title: "Insight | BEING at Full Potential",
    description:
      "Access new horizons. We relentlessly challenge existing beliefs about success, performance, happiness and the constructs that limit meaningful change.",
    images: [
      {
        url: "/wp-content/uploads/2026/04/Heading.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return <InsightPage />;
}
