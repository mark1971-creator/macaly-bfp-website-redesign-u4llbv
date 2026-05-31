import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import TeamsPage from "@/components/teams-page";

export const metadata: Metadata = (siteMetadata as Record<string, Metadata>)["/teams"];

export default function Page() {
  return <TeamsPage />;
}
