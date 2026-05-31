import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import EducationPage from "@/components/education-page";

export const metadata: Metadata = (siteMetadata as Record<string, Metadata>)["/education"];

export default function Page() {
  return <EducationPage />;
}
