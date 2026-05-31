import type { Metadata } from "next";
import HomePage from "@/components/home-page";

export const metadata: Metadata = {
  title: "BEING at Full Potential | Human Potential Development",
  description:
    "BEING at Full Potential specializes in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line. Serving organizations globally in North America, Latin America, Europe and India.",
  keywords: [
    "human potential",
    "leadership development",
    "employee engagement",
    "organizational transformation",
    "inner development goals",
    "human potential coach",
    "conscious leadership",
  ],
  openGraph: {
    title: "BEING at Full Potential | Human Potential Development",
    description:
      "Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.",
    images: [
      {
        url: "https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png",
        width: 400,
        height: 200,
      },
    ],
  },
};

export default function Page() {
  return <HomePage />;
}
