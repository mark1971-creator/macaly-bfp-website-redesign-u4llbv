import "./globals.css";

import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";

export const metadata: Metadata = {
  title: "BEING at Full Potential | Human Potential Development",
  description: "BEING at Full Potential specializes in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line. Serving organizations globally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
