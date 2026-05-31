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
        url: "https://images.pexels.com/photos/29347332/pexels-photo-29347332.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        width: 940,
        height: 650,
        alt: "Misty forest trail — BEING at Full Potential Academy",
      },
    ],
  },
};

export default function Page() {
  return <AcademyPage />;
}
