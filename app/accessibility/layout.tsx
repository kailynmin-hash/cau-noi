import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Accessibility Settings",
  description: "Customize Cầu Nối with dyslexia-friendly text, high contrast, text size, and reduced motion settings.",
  alternates: {
    canonical: "/accessibility",
  },
};

export default function AccessibilityLayout({ children }: { children: ReactNode }) {
  return children;
}
