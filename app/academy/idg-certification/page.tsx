import type { Metadata } from "next";
import IDGCertificationPage from "@/components/idg-certification-page";

export const metadata: Metadata = {
  title: "6-Week IDG Coach Certification Training — Sep–Oct 2025 | BEING at Full Potential",
  description:
    "Become certified to administer the IDG Measurement Tool. 6-week online training for coaches, change agents & sustainability champions. Quantify inner development impact & advance the 17 SDGs.",
};

export default function Page() {
  return <IDGCertificationPage />;
}
