import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { siteOrigin } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: {
    default: "Cầu Nối | CA-45 Youth Mental-Health Navigator",
    template: "%s | Cầu Nối",
  },
  description:
    "A bilingual English and Vietnamese youth mental-health navigator for CA-45.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cầu Nối | CA-45 Youth Mental-Health Navigator",
    description:
      "A bilingual English and Vietnamese youth mental-health navigator for CA-45.",
    url: "/",
    siteName: "Cầu Nối",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cầu Nối | CA-45 Youth Mental-Health Navigator",
    description:
      "A bilingual English and Vietnamese youth mental-health navigator for CA-45.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f8fbf8] text-slate-900">
        <LanguageProvider>
          <AccessibilityProvider>
            <SkipLink />
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter />
            </div>
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
