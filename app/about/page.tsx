import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "About Us | BEING at Full Potential",
  description:
    "BEING at Full Potential is a global assessment, training and coaching organization dedicated to unlocking Human Potential. Founded in 2008, we operate across 4 continents with 130+ certified coaches.",
  keywords: [
    "about being at full potential",
    "human potential organization",
    "conscious leadership",
    "sujith ravindran",
    "mark vandeneijnde",
    "global coaching network",
    "human potential coaches",
  ],
  openGraph: {
    title: "About BEING at Full Potential",
    description:
      "A global community of 130+ coaches and change agents dedicated to a world where every individual and organization fully realizes their Human Potential.",
    images: [
      {
        url: "/brand/og-realize-your-full-potential.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return <AboutPage />;
}
