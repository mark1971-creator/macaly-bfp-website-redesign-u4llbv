import "./globals.css";

import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";

export const metadata: Metadata = {
  title: "BEING at Full Potential | Human Potential Development",
  description: "BEING at Full Potential specializes in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line. Serving organizations globally.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://beingatfullpotential.com"),
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
        url: "/brand/og-measure-what-matters.png",
        width: 1200,
        height: 630,
        alt: "Measure What Matters Most — Human Potential Assessment by BEING at Full Potential",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BEING at Full Potential | Human Potential Development",
    description:
      "Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.",
    images: ["/brand/og-measure-what-matters.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
