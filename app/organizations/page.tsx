import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import OrganizationsPage from "@/components/organizations-page";

const baseMetadata = (siteMetadata as Record<string, Metadata>)["/organizations"];

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: baseMetadata.title && baseMetadata.description ? {
    title: baseMetadata.title,
    description: baseMetadata.description,
    images: [{ url: "/brand/og-realize-your-full-potential.png", width: 1200, height: 630 }],
  } : undefined,
  twitter: baseMetadata.title && baseMetadata.description ? {
    card: "summary_large_image",
    title: baseMetadata.title,
    description: baseMetadata.description,
    images: ["/brand/og-realize-your-full-potential.png"],
  } : undefined,
};

export default function Page() {
  return <OrganizationsPage />;
}
