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
        url: "/brand/og-realize-your-full-potential.png",
        width: 1200,
        height: 630,
        alt: "Realize Your Full Potential — Leadership, Innovation, Transformation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BEING at Full Potential | Human Potential Development",
    description:
      "Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.",
    images: ["/brand/og-realize-your-full-potential.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BEING at Full Potential",
  url: "https://beingatfullpotential.com",
  logo: "https://beingatfullpotential.com/brand/icon-512.png",
  description:
    "BEING at Full Potential specializes in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.",
  sameAs: [
    "https://www.facebook.com/BeingAtFullPotential",
    "https://twitter.com/beingatFP",
    "https://www.linkedin.com/company/being-at-full-potential",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "mark@beingatfullpotential.com",
    contactType: "customer service",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
