import type { Metadata } from "next";
import AcademyApplyPage from "@/components/academy-apply-page";

export const metadata: Metadata = {
  title: "Apply — Human Potential Coach Certification Oct–Dec 2026 | BEING at Full Potential",
  description:
    "Apply for the October–December 2026 HPCC cohort. ICF-approved certification training — 11 immersive modules, 25 CCEUs. Limited places. Reserve yours today.",
};

export default function Page() {
  return <AcademyApplyPage />;
}
