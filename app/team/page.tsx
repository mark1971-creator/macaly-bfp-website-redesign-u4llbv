import type { Metadata } from "next";
import TeamPage from "@/components/team-page";

export const metadata: Metadata = {
  title: "Our Team | BEING at Full Potential",
  description:
    "A global community of 130+ certified Human Potential coaches and change agents across 4 continents, striving for a world where each person can fully express their unique potential.",
  keywords: [
    "human potential coaches",
    "global coaching team",
    "being at full potential team",
    "certified coaches",
    "change agents",
    "conscious leadership coaches",
  ],
  openGraph: {
    title: "Our Team — Human Potential Coaches | BEING at Full Potential",
    description:
      "Say hello to some of the most remarkable humans on earth. Our global community of coaches and change agents ready to support your journey.",
    images: [
      {
        url: "https://beingatfullpotential.com/wp-content/uploads/2019/05/IMG-20180412-WA0011.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function Page() {
  return <TeamPage />;
}
