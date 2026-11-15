import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/instrument-sans";
import { Footer, Header } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Attraqtive Label | Couture in Visakhapatnam", template: "%s | Attraqtive Label" },
  description: "A private preview of the Attraqtive Label digital boutique in Visakhapatnam.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="en-IN"><body><Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer /></body></html>;
}
