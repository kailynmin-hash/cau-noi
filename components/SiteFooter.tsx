"use client";

import Link from "next/link";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { BotanicalSprig } from "@/components/Botanical";
import { useLanguage } from "@/components/LanguageProvider";

export function CrisisBanner({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();

  return (
    <section className="border-y border-[#A7C6A0]/40 bg-[#F5EDE1] text-[#1F2937]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-[#2E5A3E] text-white shadow-sm shadow-teal-900/20">
            <PhoneCall size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="font-semibold">{t("crisis.title")}</p>
            <p className="text-sm leading-6 text-[#1F2937]">
              {compact ? t("crisis.bodyCompact") : t("crisis.body")}
            </p>
          </div>
        </div>
        <a
          href="tel:988"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2E5A3E] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#244a32]"
        >
          {t("common.call988")}
        </a>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-teal-950/10 bg-[#FFFDF7]">
      <CrisisBanner />
      <BotanicalSprig className="pointer-events-none absolute -right-8 bottom-8 h-56 w-44 text-[#2E5A3E]/35" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
            <ShieldCheck size={18} className="text-teal-700" aria-hidden="true" />
            {t("footer.privacyTitle")}
          </div>
          <p className="max-w-2xl leading-6">{t("footer.privacyBody")}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/#about-cau-noi" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {t("footer.about")}
          </Link>
          <Link href="/resources" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {t("footer.resources")}
          </Link>
          <Link href="/quiz" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {t("footer.quiz")}
          </Link>
          <Link href="/accessibility" className="rounded-md px-1 font-medium text-teal-800 hover:text-teal-950">
            {t("footer.accessibility")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
