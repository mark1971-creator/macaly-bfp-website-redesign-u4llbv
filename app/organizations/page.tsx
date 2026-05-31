import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import OrganizationsPage from "@/components/organizations-page";

export const metadata: Metadata = (siteMetadata as Record<string, Metadata>)["/organizations"];

export default function Page() {
  return <OrganizationsPage />;
}
