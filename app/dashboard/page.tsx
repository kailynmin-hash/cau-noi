import type { Metadata } from "next";
import { DashboardPageContent } from "@/components/DashboardPageContent";

export const metadata: Metadata = {
  title: "Community Dashboard",
  description: "Anonymous aggregate community insights from Cầu Nối survey responses.",
  alternates: {
    canonical: "/dashboard",
  },
  openGraph: {
    title: "Community Dashboard | Cầu Nối",
    description: "Anonymous aggregate community insights from Cầu Nối survey responses.",
    url: "/dashboard",
  },
  twitter: {
    title: "Community Dashboard | Cầu Nối",
    description: "Anonymous aggregate community insights from Cầu Nối survey responses.",
  },
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}

export const dynamic = "force-dynamic";
