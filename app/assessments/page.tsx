import type { Metadata } from "next";
import siteMetadata from "@/app/metadata.json";
import AssessmentPage from "@/components/assessment-page";

export const metadata: Metadata = (siteMetadata as Record<string, Metadata>)["/assessments"];

export default function AssessmentsPage() {
  return <AssessmentPage />;
}
