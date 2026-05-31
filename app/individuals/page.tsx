import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import IndividualsPage from "@/components/individuals-page";

export const metadata: Metadata = (siteMetadata as Record<string, Metadata>)["/individuals"];

export default function Page() {
  return <IndividualsPage />;
}
