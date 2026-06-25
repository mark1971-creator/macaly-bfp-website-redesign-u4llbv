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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "BEING at Full Potential | Human Potential Development",
    description:
      "Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.",
    images: [
      {
        url: "/brand/og-realize-your-full-potential.png",
        width: 1200,
        height: 630,
        alt: "Realize Your Full Potential — BEING at Full Potential",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-realize-your-full-potential.png"],
  },
};

export default function Page() {
  return <HomePage />;
}
