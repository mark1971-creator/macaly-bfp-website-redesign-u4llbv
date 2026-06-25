import type { Metadata } from "next";
import ImpactPage from "@/components/impact-page";

export const metadata: Metadata = {
  title: "Impact | BEING at Full Potential",
  description:
    "Real results from organizations worldwide. Explore client stories, case studies, and testimonials showing what becomes possible when human potential is truly unleashed.",
  openGraph: {
    title: "Impact | BEING at Full Potential",
    description:
      "Real results from organizations worldwide. Client stories, case studies, and testimonials from leaders who have experienced transformational change.",
    images: [{ url: "/brand/og-realize-your-full-potential.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ImpactPage />;
}
