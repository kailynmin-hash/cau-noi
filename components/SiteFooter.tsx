"use client";

import Link from "next/link";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { uiText } from "@/lib/i18n";

export function CrisisBanner({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  const ui = uiText[language];

  return (
    <section className="border-y border-rose-200/70 bg-rose-50 text-rose-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-rose-600 text-white shadow-sm shadow-rose-900/20">
            <PhoneCall size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">{ui.crisisTitle}</p>
            <p className="text-sm leading-6 text-rose-900">
              {compact ? ui.crisisBodyCompact : ui.crisisBody}
            </p>
          </div>
        </div>
        <a
          href="tel:988"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          {ui.call988}
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const { language } = useLanguage();
  const ui = uiText[language];

  return (
    <footer className="mt-auto border-t border-teal-950/10 bg-white">
      <CrisisBanner />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
            <ShieldCheck size={18} className="text-teal-700" aria-hidden="true" />
            {ui.privacyTitle}
          </div>
          <p className="max-w-2xl leading-6">{ui.privacyBody}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/about" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {ui.footerAbout}
          </Link>
          <Link href="/resources" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {ui.footerResources}
          </Link>
          <Link href="/quiz" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {ui.footerQuiz}
          </Link>
        </div>
      </div>
    </footer>
  );
}
