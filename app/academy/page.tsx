import type { Metadata } from "next";
import AcademyPage from "@/components/academy-page";

export const metadata: Metadata = {
  title: "Academy — Human Potential Coach Certification | BEING at Full Potential",
  description: "Join 200+ certified coaches on 4 continents. Our ICF-approved Human Potential Coach Certification (HPCC) gives you the tools and methodologies to create lasting transformation in individuals, teams, and organisations.",
  openGraph: {
    title: "Academy — Human Potential Coach Certification | BEING at Full Potential",
    description: "ICF Approved · 25 CCEUs · 11 immersive modules. Become a certified Human Potential Coach and support leaders to work and thrive from their Full Potential.",
    images: [
      {
        url: "/brand/og-realize-your-full-potential.png",
        width: 1200,
        height: 630,
        alt: "Realize Your Full Potential — BEING at Full Potential",
      },
    ],
  },
};

export default function Page() {
  return <AcademyPage />;
}
