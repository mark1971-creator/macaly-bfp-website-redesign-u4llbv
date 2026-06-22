import type { Metadata } from "next";
import ImpactPage from "@/components/impact-page";

export const metadata: Metadata = {
  title: "Impact | BEING at Full Potential",
  description:
    "Real results from organizations worldwide. Explore client stories, case studies, and testimonials showing what becomes possible when human potential is truly unleashed.",
  openGraph: {
    title: "Impact | BEING at Full Potential",
    description:
      "Real results from organizations worldwide. Client stories, case studies, and testimonials from leaders who have experienced transformational change.",
    images: ["/wp-content/uploads/2019/09/10626797_1218979294781847_4220713866197897045_n.jpg"],
  },
};

export default function Page() {
  return <ImpactPage />;
}
