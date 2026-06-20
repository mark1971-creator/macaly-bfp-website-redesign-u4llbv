import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import AssessmentPage from "@/components/assessment-page";

export const metadata: Metadata = {
  ...(siteMetadata as Record<string, Metadata>)["/assessments"],
  openGraph: {
    title: "Assessments — Human Potential Assessment Tools | BEING at Full Potential",
    description:
      "Discover the Individual, Team, and Organisational Human Potential Assessments. Measure the invisible dimensions that drive innovation, engagement, and sustainable performance.",
    images: [
      {
        url: "/brand/og-measure-what-matters.png",
        width: 1200,
        height: 630,
        alt: "Measure What Matters Most — Human Potential Assessment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-measure-what-matters.png"],
  },
};

export default function AssessmentsPage() {
  return <AssessmentPage />;
}
