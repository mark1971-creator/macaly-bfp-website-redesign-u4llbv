import type { Metadata } from "next";
import ThoughtLeadershipPage from "@/components/thought-leadership-page";

export const metadata: Metadata = {
  title: "Thought Leadership | BEING at Full Potential",
  description:
    "A decade of articles, research, and insights on human potential, conscious leadership, and organizational transformation — from BEING at Full Potential.",
  keywords: [
    "thought leadership",
    "human potential",
    "conscious leadership",
    "inner development goals",
    "IDG",
    "organizational transformation",
    "employee engagement",
    "leadership development",
  ],
  openGraph: {
    title: "Thought Leadership | BEING at Full Potential",
    description:
      "Explore 50+ articles spanning a decade of research and insight on human potential, conscious leadership, and organizational transformation.",
    images: [
      {
        url: "https://beingatfullpotential.com/wp-content/uploads/2026/04/Heading.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return <ThoughtLeadershipPage />;
}
