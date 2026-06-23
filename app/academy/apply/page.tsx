import type { Metadata } from "next";
import AcademyApplyPage from "@/components/academy-apply-page";

export const metadata: Metadata = {
  title: "Apply — Human Potential Coach Certification Oct–Dec 2026 | BEING at Full Potential",
  description:
    "Apply for the October–December 2026 HPCC cohort. ICF-approved certification training — 11 immersive modules, 25 CCEUs. Limited places. Reserve yours today.",
  openGraph: {
    title: "Apply — Human Potential Coach Certification Oct–Dec 2026 | BEING at Full Potential",
    description:
      "Apply for the October–December 2026 HPCC cohort. ICF-approved certification training — 11 immersive modules, 25 CCEUs. Limited places. Reserve yours today.",
    images: [{ url: "/brand/og-realize-your-full-potential.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apply — Human Potential Coach Certification Oct–Dec 2026 | BEING at Full Potential",
    description:
      "Apply for the October–December 2026 HPCC cohort. ICF-approved certification training — 11 immersive modules, 25 CCEUs. Limited places. Reserve yours today.",
    images: ["/brand/og-realize-your-full-potential.png"],
  },
};

export default function Page() {
  return <AcademyApplyPage />;
}
